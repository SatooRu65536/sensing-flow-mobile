use core::str;
use std::collections::HashMap;

use chrono::NaiveDateTime;
use entity::sensor_groups;
use serde::{Deserialize, Serialize};
#[cfg(target_os = "android")]
use tauri::ipc::Channel;

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GetAvailableSensorsRequest {}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GetAvailableSensorsResponse(pub std::collections::HashMap<String, bool>); // センサー名と利用可能フラグのマッピング

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateSensorDataRequest {
    pub group_id: i32,        // センサーグループID
    pub data_name: String,    // センサーデータ名
    pub sensors: Vec<String>, // 利用するセンサー名のリスト
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct StartSensorsRequest {
    pub sensors: HashMap<String, i32>, // センサー名とFPSのマッピング
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PushSensorLineRequest(pub String);

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateSensorDataResponse {
    pub id: i32,
    pub name: String,
    pub folder_path: String,
    pub synced: bool,
    pub active_sensors: Vec<String>,
    pub group_id: i32,
    pub created_at: NaiveDateTime,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DeleteSensorDataRequest {
    pub id: i32,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateGroupRequest {
    pub name: String,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GetGroupRequest {
    pub id: i32,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateGroupResponse {
    pub id: i32,
    pub name: String,
    pub sorted: i32,
    pub created_at: NaiveDateTime,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GetGroupResponse {
    pub group: sensor_groups::Model,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GetGroupsResponse {
    pub groups: Vec<sensor_groups::Model>,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DeleteGroupRequest {
    pub id: i32,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SyncSensorDataRequest {
    pub id: i32,
    pub jwt_token: String,
    pub api_url: String,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct UnsyncSensorDataRequest {
    pub id: i32,
    pub jwt_token: String,
    pub api_url: String,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SensorPayload {
    pub sensor: String,
    pub csv_raw: String,
}

#[cfg(target_os = "android")]
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SetEventHandlerArgs {
    pub(crate) handler: Channel,
}
