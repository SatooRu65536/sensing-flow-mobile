use crate::models::{GetAvailableSensorsResponse, StartSensorsRequest};
use crate::services::database::GroupedSensorFiles;
use crate::{
    CreateGroupRequest, CreateGroupResponse, CreateSensorDataRequest, CreateSensorDataResponse,
    DeleteGroupRequest, DeleteSensorDataRequest, GetGroupRequest, GetGroupResponse,
    GetGroupsResponse, SensorkitExt, SyncSensorDataRequest, UnsyncSensorDataRequest,
};
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
    app.sensorkit().start_sensors(payload.clone())
}

#[command]
pub(crate) async fn stop_sensors<R: Runtime>(app: AppHandle<R>) -> crate::Result<()> {
    app.sensorkit().sensor_batch_service.stop();
    app.sensorkit().stop_sensors()
}

#[command]
pub(crate) async fn create_sensor_data<R: Runtime>(
    app: AppHandle<R>,
    payload: CreateSensorDataRequest,
) -> crate::Result<CreateSensorDataResponse> {
    let app_for_callback = app.clone();
    let folder_path = app_for_callback.sensorkit().storage_service.set_folder();

    let callback = Arc::new(move |sensor, data, header| {
        app_for_callback
            .sensorkit()
            .storage_service
            .write(sensor, data, header);
    });

    let sensor_data = app
        .sensorkit()
        .db_service
        .create_sensor_data(
            payload.group_id,
            payload.data_name.clone(),
            folder_path.0,
            payload.sensors,
        )
        .await
        .map(|record| CreateSensorDataResponse {
            id: record.id,
            name: record.name,
            folder_path: record.folder_path,
            synced: record.upload_id.is_some(),
            active_sensors: record.active_sensors.0,
            group_id: record.group_id,
            created_at: record.created_at,
        })?;
    app.sensorkit().sensor_batch_service.start(callback);

    Ok(sensor_data)
}

#[command]
pub(crate) async fn delete_sensor_data<R: Runtime>(
    app: AppHandle<R>,
    payload: DeleteSensorDataRequest,
) -> crate::Result<()> {
    {
        app.sensorkit()
            .db_service
            .delete_sensor_data(&app.sensorkit().storage_service, payload.id)
            .await
    }
}

#[command]
pub(crate) async fn get_grouped_sensor_data<R: Runtime>(
    app: AppHandle<R>,
) -> crate::Result<Vec<GroupedSensorFiles>> {
    app.sensorkit().db_service.get_grouped_sensor_data().await
}

#[command]
pub(crate) async fn create_group<R: Runtime>(
    app: tauri::AppHandle<R>,
    payload: CreateGroupRequest,
) -> crate::Result<CreateGroupResponse> {
    app.sensorkit()
        .db_service
        .create_sensor_group(payload.name)
        .await
        .map(|record| CreateGroupResponse {
            id: record.id,
            name: record.name,
            sorted: record.sorted,
            created_at: record.created_at,
        })
}

#[command]
pub(crate) async fn get_group<R: Runtime>(
    app: AppHandle<R>,
    payload: GetGroupRequest,
) -> crate::Result<GetGroupResponse> {
    app.sensorkit()
        .db_service
        .get_sensor_group(payload.id)
        .await
        .map(|group| GetGroupResponse { group })
}

#[command]
pub(crate) async fn get_groups<R: Runtime>(app: AppHandle<R>) -> crate::Result<GetGroupsResponse> {
    app.sensorkit()
        .db_service
        .get_sensor_groups()
        .await
        .map(|groups| GetGroupsResponse { groups })
}

#[command]
pub(crate) async fn delete_group<R: Runtime>(
    app: AppHandle<R>,
    payload: DeleteGroupRequest,
) -> crate::Result<()> {
    app.sensorkit()
        .db_service
        .delete_sensor_group(&app.sensorkit().storage_service, payload.id)
        .await
}

#[command]
pub(crate) async fn sync_sensor_data<R: Runtime>(
    app: AppHandle<R>,
    payload: SyncSensorDataRequest,
) -> crate::Result<()> {
    let sensor_data = app
        .sensorkit()
        .db_service
        .get_sensor_data(payload.id)
        .await?;

    if sensor_data.upload_id.is_some() {
        return Err(crate::Error::Other("Sensor data is already synced".into()));
    }

    let resp = app
        .sensorkit()
        .cloud_sync_service
        .upload_sensor_data(sensor_data.clone(), payload.jwt_token, payload.api_url)
        .await;

    let data = resp?;
    if !data.failed_sensors.is_empty() {
        return Err(crate::Error::Other(format!(
            "Some sensors failed to upload: {:?}",
            data.failed_sensors
        )));
    }

    app.sensorkit()
        .db_service
        .mark_sensor_data_as_synced(payload.id, data.id)
        .await
}

#[command]
pub(crate) async fn unsync_sensor_data<R: Runtime>(
    app: AppHandle<R>,
    payload: UnsyncSensorDataRequest,
) -> crate::Result<()> {
    let sensor_data = app
        .sensorkit()
        .db_service
        .get_sensor_data(payload.id)
        .await?;

    if sensor_data.upload_id.is_none() {
        return Err(crate::Error::Other("Sensor data is not synced".into()));
    }

    let upload_id = sensor_data
        .upload_id
        .ok_or_else(|| crate::Error::Other("Sensor data is not synced".into()))?;

    let _ = app
        .sensorkit()
        .cloud_sync_service
        .remove_sensor_data(upload_id, payload.jwt_token, payload.api_url)
        .await;

    app.sensorkit()
        .db_service
        .mark_sensor_data_as_unsynced(payload.id)
        .await
}
