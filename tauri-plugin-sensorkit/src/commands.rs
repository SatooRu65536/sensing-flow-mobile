use tauri::{command, AppHandle, Runtime};

use crate::models::*;
use crate::Result;
use crate::SensorkitExt;

#[command]
pub(crate) async fn get_available_sensors<R: Runtime>(
    app: AppHandle<R>,
) -> Result<GetAvailableSensorsResponse> {
    app.sensorkit().get_available_sensors()
}

#[command]
pub(crate) async fn start_sensors<R: Runtime>(
    app: AppHandle<R>,
    payload: StartSensorsRequest,
) -> Result<()> {
    app.sensorkit().start_sensors(payload)
}

#[command]
pub(crate) async fn stop_sensors<R: Runtime>(app: AppHandle<R>) -> Result<()> {
    app.sensorkit().stop_sensors()
}
