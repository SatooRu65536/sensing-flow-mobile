use crate::{
    services::sensor_batch::{SensorCsvHeader, SensorData, SensorName},
    Result,
};
use chrono::Local;
use std::{
    fs::{self, OpenOptions},
    io::Write,
    path::{Path, PathBuf},
    sync::{Arc, Mutex},
};

#[derive(Clone)]
pub struct StorageService {
    base_dir: PathBuf,
    current_folder: Arc<Mutex<PathBuf>>,
}

impl StorageService {
    pub fn new(base_dir: &Path) -> Result<Self> {
        let new_folder = Self::get_folder_path(base_dir, false).unwrap();
        fs::create_dir_all(&new_folder).map_err(|_| crate::Error::CreateDirFailed)?;

        Ok(Self {
            base_dir: base_dir.to_path_buf(),
            current_folder: Arc::new(Mutex::new(new_folder)), // 初期フォルダ設定
        })
    }

    pub fn set_file(&self) {
        let new_folder = Self::get_folder_path(&self.base_dir, true).unwrap();
        let mut folder = self.current_folder.lock().unwrap();
        *folder = new_folder;
    }

    fn get_folder_path(base_dir: &Path, generate: bool) -> Result<PathBuf> {
        let folder_name = Local::now().format("%Y%m%d_%H%M%S").to_string();
        let folder = base_dir.join("sensor_data").join(folder_name);
        if generate {
            fs::create_dir_all(&folder).map_err(|_| crate::Error::CreateDirFailed)?;
        }
        Ok(folder.clone())
    }

    pub fn write(&self, sensor: SensorName, data: SensorData, header: SensorCsvHeader) {
        let folder_path = self.current_folder.lock().unwrap().clone();
        let file_path = folder_path.join(format!("{}.csv", sensor.0));
        let is_new_file = !file_path.exists();

        match OpenOptions::new()
            .create(true)
            .append(true)
            .open(&file_path)
        {
            Ok(mut file) => {
                let mut content = String::new();

                // 新規作成時のみヘッダーを挿入
                if is_new_file {
                    content.push_str(header.0.as_str());
                    content.push('\n');
                }

                content.push_str(data.0.as_str());
                content.push('\n');

                if let Err(e) = file.write_all(content.as_bytes()) {
                    eprintln!("Failed to write to file: {}", e);
                }
            }
            Err(e) => eprintln!("Failed to open file {:?}: {}", file_path, e),
        }
    }
}
