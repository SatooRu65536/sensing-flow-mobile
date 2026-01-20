use crate::{
    error::{Error, Result},
    services::UploadSensorDataResponse,
};
use entity::sensor_data;
use reqwest::multipart::{Form, Part};
use std::path::Path;

#[derive(Clone)]
pub struct CloudSyncService {}

impl CloudSyncService {
    pub fn new() -> Self {
        Self {}
    }

    pub async fn upload_sensor_data(
        &self,
        sensor_data: sensor_data::Model,
        jwt_token: String,
        api_url: String,
    ) -> Result<UploadSensorDataResponse> {
        let url = self.get_url("/sensor-data", api_url);
        let mut form = Form::new()
            .text("createdAt", sensor_data.created_at.to_string())
            .text("dataName", sensor_data.name.clone());

        for sensor in sensor_data.active_sensors.0.iter() {
            let file_path = Path::new(&sensor_data.folder_path).join(format!("{}.csv", sensor));
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
            .bearer_auth(jwt_token)
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

        let text = resp
            .text()
            .await
            .map_err(|e| Error::HttpError(e.to_string()))?;

        let response_data: UploadSensorDataResponse = serde_json::from_str(&text).map_err(|e| {
            Error::HttpError(format!(
                "Failed to parse response JSON: {}. Body: {}",
                e, text
            ))
        })?;

        Ok(response_data)
    }

    pub async fn remove_sensor_data(
        &self,
        upload_id: String,
        jwt_token: String,
        api_url: String,
    ) -> Result<()> {
        let url = self.get_url(&format!("/sensor-data/{}", upload_id), api_url);

        let client = reqwest::Client::builder()
            .build()
            .map_err(|e| Error::HttpError(format!("Client build failed: {}", e)))?;

        let resp = client
            .delete(url)
            .bearer_auth(jwt_token)
            .send()
            .await
            .map_err(|e| Error::HttpError(format!("Delete request failed: {}", e)))?;

        if !resp.status().is_success() {
            let status = resp.status();
            let body = resp.text().await.unwrap_or_else(|_| "unknown error".into());
            return Err(Error::HttpError(format!(
                "Delete failed with status {}: {}",
                status, body
            )));
        }

        Ok(())
    }

    fn get_url(&self, path: &str, api_url: String) -> String {
        let base_url = api_url.trim_end_matches('/');
        format!("{}/{}", base_url, path.trim_start_matches('/'))
    }
}
