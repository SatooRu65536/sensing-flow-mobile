use crate::file::FileService;
use crate::models::{GetAvailableSensorsResponse, StartSensorsRequest};
use crate::SensorkitExt;

use std::sync::Arc;
use tauri::{command, AppHandle, Manager, Runtime, State};

#[command]
pub(crate) async fn get_available_sensors<R: Runtime>(
    app: AppHandle<R>,
) -> crate::Result<GetAvailableSensorsResponse> {
    app.sensorkit().get_available_sensors()
}

#[command]
pub(crate) async fn start_sensors<R: Runtime>(
    app: AppHandle<R>,
    payload: StartSensorsRequest,
) -> crate::Result<()> {
    let base_dir = app
        .path()
        .app_data_dir()
        .map_err(|_| crate::Error::AppDataDirNotFound)?;

    if let Some(file_service) = app.try_state::<Arc<FileService>>() {
        // 既存の場合はフォルダだけ新しくする
        file_service.start_session()?;
    } else {
        // 初回のみ manage する
        let file_service = Arc::new(FileService::new(&base_dir)?);
        app.manage(file_service);
    }

    app.sensorkit().start_sensors(payload.clone())
}

#[command]
pub(crate) async fn stop_sensors<R: Runtime>(app: AppHandle<R>) -> crate::Result<()> {
    let file_service: State<'_, Arc<FileService>> = app.state();
    file_service.stop_writer();
    app.sensorkit().stop_sensors()
}

#[command]
pub(crate) async fn get_sensor_files<R: Runtime>(
    app: AppHandle<R>,
) -> crate::Result<Vec<serde_json::Value>> {
    app.sensorkit().db_service.get_sensor_files().await
}
