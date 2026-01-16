use crate::models::{GetAvailableSensorsResponse, StartSensorsRequest};
use crate::services::database::GroupedSensorFiles;
use crate::SensorkitExt;
use std::sync::Arc;
use tauri::{command, AppHandle, Runtime};

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
    let app_for_callback = app.clone();
    let folder_path = app_for_callback.sensorkit().storage_service.set_folder();

    let callback = Arc::new(move |sensor, data, header| {
        app_for_callback
            .sensorkit()
            .storage_service
            .write(sensor, data, header);
    });

    let _ = app
        .sensorkit()
        .db_service
        .create_sensor_data(
            payload.group_id,
            payload.data_name.clone(),
            folder_path.0,
            false,
            payload.sensors.keys().cloned().collect::<Vec<String>>(),
        )
        .await?;
    app.sensorkit().sensor_batch_service.start(callback);
    app.sensorkit().start_sensors(payload.clone())
}

#[command]
pub(crate) async fn stop_sensors<R: Runtime>(app: AppHandle<R>) -> crate::Result<()> {
    app.sensorkit().sensor_batch_service.stop();
    app.sensorkit().stop_sensors()
}

#[command]
pub(crate) async fn get_grouped_sensor_data<R: Runtime>(
    app: AppHandle<R>,
) -> crate::Result<Vec<GroupedSensorFiles>> {
    app.sensorkit().db_service.get_grouped_sensor_data().await
}
