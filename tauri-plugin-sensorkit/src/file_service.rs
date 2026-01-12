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
pub struct FileService {
    folder: PathBuf,
    buffers: Arc<Mutex<HashMap<String, VecDeque<String>>>>,
    is_running: Arc<AtomicBool>,
}

impl FileService {
    pub fn new(base_dir: &Path) -> Result<Self> {
        // フォルダ名は日時とする
        let folder_name = Local::now().format("%Y%m%d_%H%M%S").to_string();
        let folder = base_dir.join("sensors").join(folder_name);

        fs::create_dir_all(&folder).map_err(|_| crate::Error::CreateDirFailed)?;

        let service = FileService {
            folder,
            buffers: Arc::new(Mutex::new(HashMap::new())),
            is_running: Arc::new(AtomicBool::new(true)),
        };

        let writer_service = service.clone();
        tokio::spawn(async move {
            writer_service.run_writer().await;
        });

        Ok(service)
    }

    pub fn push_line(&self, sensor: &str, line: String) {
        let mut buffers = self.buffers.lock().unwrap();
        let buffer = buffers.entry(sensor.to_string()).or_default();
        buffer.push_back(line);
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
        let mut buffers_snapshot = {
            let mut buffers = self.buffers.lock().unwrap();
            let snapshot = buffers.clone();
            buffers.clear();
            snapshot
        };

        for (sensor, mut lines) in buffers_snapshot.drain() {
            if lines.is_empty() {
                continue;
            }

            let file_path = self.folder.join(format!("{}.csv", sensor));
            let mut file = OpenOptions::new()
                .create(true)
                .append(true)
                .open(&file_path)
                .unwrap();

            let joined = lines.drain(..).collect::<Vec<_>>().join("\n") + "\n";
            file.write_all(joined.as_bytes()).unwrap();
            file.flush().unwrap();
        }
    }
}
