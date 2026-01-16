use std::{
    collections::{HashMap, VecDeque},
    sync::{
        atomic::{AtomicBool, AtomicU64, Ordering},
        Arc, Mutex,
    },
    time::{Duration, SystemTime, UNIX_EPOCH},
};
use tauri::{AppHandle, Emitter, Runtime};
use tokio::time::interval;

#[derive(Clone)]
struct SensorBuffer {
    header: String,
    lines: VecDeque<String>,
}

#[derive(Clone)]
pub struct SensorBatchService {
    buffers: Arc<Mutex<HashMap<String, SensorBuffer>>>,
    is_running: Arc<AtomicBool>,
    last_emit_time: Arc<AtomicU64>,
}

pub struct SensorName(pub String);
pub struct SensorData(pub String);
pub struct SensorCsvHeader(pub String);
pub type SensorDataCallback =
    Arc<dyn Fn(SensorName, SensorData, SensorCsvHeader) + Send + Sync + 'static>;

impl SensorBatchService {
    pub fn new() -> Self {
        Self {
            buffers: Arc::new(Mutex::new(HashMap::new())),
            is_running: Arc::new(AtomicBool::new(false)),
            last_emit_time: Arc::new(AtomicU64::new(0)),
        }
    }

    pub fn start(&self, callback: SensorDataCallback) {
        self.is_running.store(true, Ordering::Relaxed);

        let mut buffers = self.buffers.lock().unwrap();
        buffers.clear();

        let mut interval = interval(Duration::from_secs(1));
        let self_clone = self.clone();
        tokio::spawn(async move {
            while self_clone.is_running.load(Ordering::Relaxed) {
                interval.tick().await;
                self_clone.dispatch_data(&callback).await;
            }
            self_clone.dispatch_data(&callback).await;
        });
    }

    pub fn stop(&self) {
        self.is_running.store(false, Ordering::Relaxed);
    }

    pub fn push<R: Runtime>(&self, app_handle: &AppHandle<R>, payload: String) {
        println!("SensorKit: Received payload: {}", payload);
        if let Ok(mut data) = serde_json::from_str::<serde_json::Value>(&payload) {
            let sensor_name = data["sensor"].as_str().unwrap_or("unknown").to_string();

            let line = data["csv_raw"].as_str().unwrap_or_default().to_string();
            let header = data["csv_header"].as_str().unwrap_or_default().to_string();

            // バッファへの保存 (Storage用)
            let mut buffers = self.buffers.lock().unwrap();
            let buffer = buffers
                .entry(sensor_name.clone())
                .or_insert_with(|| SensorBuffer {
                    header: header.clone(),
                    lines: VecDeque::new(),
                });
            buffer.lines.push_back(line);

            // イベントの送信（フロントエンド用）
            if self.should_emit(30) {
                // TS側で不要なフィールドを削除（1フレーム分だけ送信）
                if let Some(obj) = data.as_object_mut() {
                    obj.remove("csv_raw");
                    obj.remove("csv_header");
                }

                let event_name = format!("sensorkit://{}/update", sensor_name);
                let _ = app_handle.emit(&event_name, data);
            }
        }
    }

    async fn dispatch_data(&self, callback: &SensorDataCallback) {
        let mut buffers = self.buffers.lock().unwrap();
        if buffers.is_empty() {
            return;
        }

        for (sensor, buffer) in buffers.iter_mut() {
            if buffer.lines.is_empty() {
                continue;
            }

            callback(
                SensorName(sensor.clone()),
                SensorData(buffer.lines.drain(..).collect::<Vec<String>>().join("\n")),
                SensorCsvHeader(buffer.header.clone()),
            );
        }
    }

    fn should_emit(&self, frame_rate: i32) -> bool {
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_millis() as u64;

        let last = self.last_emit_time.load(Ordering::Relaxed);

        let interval_ms = 1000 / frame_rate as u64;
        if now - last >= interval_ms {
            // 時刻を更新
            self.last_emit_time.store(now, Ordering::Relaxed);
            true
        } else {
            false
        }
    }
}
