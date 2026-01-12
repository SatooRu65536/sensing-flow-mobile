use crate::{Error, Result};
use serde_json::{json, Value};
use sqlx::{sqlite::SqliteRow, Row, SqlitePool};

pub struct DbService {
    pool: SqlitePool,
}

impl DbService {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }

    pub async fn get_sensor_files(&self) -> Result<Vec<Value>> {
        let rows = sqlx::query(
            r#"
            SELECT 
                sd.id, sd.data_name, sd.file_path, sd.timestamp, sg.group_name 
            FROM sensor_data sd
            JOIN sensor_groups sg ON sd.group_id = sg.id
            ORDER BY sd.timestamp DESC
            "#,
        )
        .fetch_all(&self.pool)
        .await
        .map_err(|e| Error::SqlError(format!("SensorKit: Error {}", e)))?;

        let result = rows
            .into_iter()
            .map(|row: SqliteRow| {
                json!({
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
}
