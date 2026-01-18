use reqwest::multipart::{Form, Part};
use std::path::Path;

use crate::error::{Error, Result};

#[derive(Clone)]
pub struct CloudSyncService {
    base_url: Option<String>,
}

impl CloudSyncService {
    pub fn new() -> Self {
        Self {
            base_url: option_env!("API_URL").map(|s| s.trim_end_matches('/').to_string()),
        }
    }

    pub async fn upload_sensor_data(
        &self,
        folder_path: String,
        sensors: Vec<String>,
    ) -> Result<()> {
        let url = self.get_url("/sensor-data")?;
        let mut form = Form::new();

        for sensor in sensors {
            let file_path = Path::new(&folder_path).join(format!("{}.csv", sensor));
            let filename = format!("{}.csv", sensor);

            let file_content = std::fs::read(&file_path)
                .map_err(|e| Error::HttpError(format!("Failed to read {}: {}", filename, e)))?;

            let file_part = Part::bytes(file_content)
                .file_name(filename.clone())
                .mime_str("text/csv")
                .map_err(|e| {
                    Error::HttpError(format!("Failed to set MIME for {}: {}", filename, e))
                })?;

            form = form.part("files", file_part);
        }

        let client = reqwest::Client::builder()
            .build()
            .map_err(|e| Error::HttpError(format!("Client build failed: {}", e)))?;

        let resp = client
            .post(url)
            .multipart(form)
            .send()
            .await
            .map_err(|e| Error::HttpError(format!("Upload request failed: {}", e)))?;

        if !resp.status().is_success() {
            let status = resp.status();
            let body = resp.text().await.unwrap_or_else(|_| "unknown error".into());
            return Err(Error::HttpError(format!(
                "Upload failed with status {}: {}",
                status, body
            )));
        }

        Ok(())
    }

    fn get_url(&self, path: &str) -> Result<String> {
        self.base_url
            .clone()
            .ok_or_else(|| Error::ConfigurationError("Cloud sync is not set up".into()))
            .map(|base_url| format!("{}/{}", base_url, path.trim_start_matches('/')))
    }
}
