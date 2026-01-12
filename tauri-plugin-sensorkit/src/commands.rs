use std::fs;
use std::sync::Arc;
use tauri::{command, AppHandle, Manager, Runtime, State};

use crate::file_service::FileService;
use crate::models::{GetAvailableSensorsResponse, StartSensorsRequest};
use crate::SensorkitExt;

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
    fs::create_dir_all(&base_dir).map_err(|_| crate::Error::CreateDirFailed)?;

    let file_service = Arc::new(FileService::new(&base_dir)?);
    app.manage(file_service.clone());

    app.sensorkit().start_sensors(payload.clone())
}

#[command]
pub(crate) async fn stop_sensors<R: Runtime>(app: AppHandle<R>) -> crate::Result<()> {
    let file_service: State<'_, Arc<FileService>> = app.state();
    file_service.stop_writer();
    app.sensorkit().stop_sensors()
}
