use std::collections::HashMap;

use serde::{Deserialize, Serialize};

// getAvailableSensors

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GetAvailableSensorsRequest {}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GetAvailableSensorsResponse(pub std::collections::HashMap<String, bool>); // センサー名と利用可能フラグのマッピング

// startSensors

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct StartSensorsRequest(pub HashMap<String, i32>); // センサー名とFPSのマッピング
