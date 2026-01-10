use tauri::{AppHandle, command, Runtime};

use crate::models::*;
use crate::Result;
use crate::SensorkitExt;

#[command]
pub(crate) async fn ping<R: Runtime>(
    app: AppHandle<R>,
    payload: PingRequest,
) -> Result<PingResponse> {
    app.sensorkit().ping(payload)
}

#[command]
pub(crate) async fn start_accelerometer<R: Runtime>(
    app: AppHandle<R>,
    payload: StartAccelerometerRequest,
) -> Result<()> {
    app.sensorkit().start_accelerometer(payload)
}

#[command]
pub(crate) async fn stop_accelerometer<R: Runtime>(
    app: AppHandle<R>,
) -> Result<()> {
    app.sensorkit().stop_accelerometer()
}
