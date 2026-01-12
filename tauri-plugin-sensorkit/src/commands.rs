use crate::file::FileService;
use crate::models::{GetAvailableSensorsResponse, StartSensorsRequest};
use crate::SensorkitExt;

use sqlx::{Row, SqlitePool};
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
    let pool: &SqlitePool = &app.sensorkit().db;

    // 仮のデータを入れる
    sqlx::query(
        r#"
        INSERT INTO sensor_data (data_name, file_path, active_sensors, group_id) VALUES ('example_data', '/path/to/file', 'sensor1,sensor2', 1)
        "#,
    )
    .execute(pool)
    .await
    .map_err(|e| crate::Error::SqlError(format!("SensorKit: Error{}", e.to_string())))?;

    let rows = sqlx::query(
        r#"
        SELECT 
            sd.id, sd.data_name, sd.file_path, sd.timestamp, sg.group_name 
        FROM sensor_data sd
        JOIN sensor_groups sg ON sd.group_id = sg.id
        ORDER BY sd.timestamp DESC
        "#,
    )
    .fetch_all(pool)
    .await
    .map_err(|e| crate::Error::SqlError(format!("SensorKit: Error{}", e.to_string())))?;

    let result = rows
        .into_iter()
        .map(|row: sqlx::sqlite::SqliteRow| {
            // row の型を明示
            serde_json::json!({
                "id": row.get::<i32, _>("id"),
                "dataName": row.get::<String, _>("data_name"),
                "filePath": row.get::<String, _>("file_path"),
                "groupName": row.get::<String, _>("group_name"),
                "timestamp": row.get::<String, _>("timestamp"),
            })
        })
        .collect();

    Ok(result)
}
