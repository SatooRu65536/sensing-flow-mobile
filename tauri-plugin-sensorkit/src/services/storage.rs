use crate::Result;
use chrono::Local;
use std::{
    collections::{HashMap, VecDeque},
    fs::{self, OpenOptions},
    io::Write,
    path::{Path, PathBuf},
    sync::{
        atomic::{AtomicBool, Ordering},
        Arc, Mutex,
    },
};
use tokio::time::{interval, Duration};

#[derive(Clone)]
struct SensorBuffer {
    header: String,
    lines: VecDeque<String>,
}

#[derive(Clone)]
pub struct StorageService {
    base_dir: PathBuf,
    current_folder: Arc<Mutex<PathBuf>>,
    buffers: Arc<Mutex<HashMap<String, SensorBuffer>>>,
    is_running: Arc<AtomicBool>,
}

impl StorageService {
    pub fn new(base_dir: &Path) -> Result<Self> {
        fs::create_dir_all(base_dir).map_err(|_| crate::Error::CreateDirFailed)?;

        let first_folder = Self::generate_folder_path(base_dir)?;

        let service = StorageService {
            base_dir: base_dir.to_path_buf(),
            current_folder: Arc::new(Mutex::new(first_folder)),
            buffers: Arc::new(Mutex::new(HashMap::new())),
            is_running: Arc::new(AtomicBool::new(true)),
        };

        let writer_service = service.clone();
        tokio::spawn(async move {
            writer_service.run_writer().await;
        });

        Ok(service)
    }

    pub fn start_session(&self) -> Result<()> {
        let new_folder = Self::generate_folder_path(&self.base_dir)?;

        // バッファを一度クリアして、書き込み先パスを更新
        let mut buffers = self.buffers.lock().unwrap();
        buffers.clear();

        let mut folder = self.current_folder.lock().unwrap();
        *folder = new_folder;

        if self
            .is_running
            .compare_exchange(false, true, Ordering::SeqCst, Ordering::SeqCst)
            .is_ok()
        {
            let writer_service = self.clone();
            tokio::spawn(async move {
                writer_service.run_writer().await;
            });
        }

        Ok(())
    }

    fn generate_folder_path(base_dir: &Path) -> Result<PathBuf> {
        let folder_name = Local::now().format("%Y%m%d_%H%M%S").to_string();
        let folder = base_dir.join("sensors").join(folder_name);
        fs::create_dir_all(&folder).map_err(|_| crate::Error::CreateDirFailed)?;
        Ok(folder)
    }

    pub fn push_line(&self, sensor: &str, line: String, header: String) {
        let mut buffers = self.buffers.lock().unwrap();
        let buffer = buffers
            .entry(sensor.to_string())
            .or_insert_with(|| SensorBuffer {
                header,
                lines: VecDeque::new(),
            });
        buffer.lines.push_back(line);
    }

    async fn run_writer(&self) {
        let mut interval = interval(Duration::from_secs(1));

        while self.is_running.load(Ordering::Relaxed) {
            interval.tick().await;
            self.flush_to_disk();
        }

        self.flush_to_disk();
    }

    pub fn stop_writer(&self) {
        self.is_running.store(false, Ordering::SeqCst);
    }

    fn flush_to_disk(&self) {
        let mut buffers = self.buffers.lock().unwrap();
        if buffers.is_empty() {
            return;
        }
        let folder_path = self.current_folder.lock().unwrap().clone();

        for (sensor, buffer) in buffers.iter_mut() {
            if buffer.lines.is_empty() {
                continue;
            }

            let file_path = folder_path.join(format!("{}.csv", sensor));
            let is_new_file = !file_path.exists();

            match OpenOptions::new()
                .create(true)
                .append(true)
                .open(&file_path)
            {
                Ok(mut file) => {
                    let mut data = String::new();

                    // 新規作成時のみヘッダーを挿入
                    if is_new_file {
                        data.push_str(&buffer.header);
                        data.push('\n');
                    }

                    while let Some(line) = buffer.lines.pop_front() {
                        data.push_str(&line);
                        data.push('\n');
                    }

                    if let Err(e) = file.write_all(data.as_bytes()) {
                        eprintln!("Failed to write to file: {}", e);
                    }
                }
                Err(e) => eprintln!("Failed to open file {:?}: {}", file_path, e),
            }
        }
    }
}
