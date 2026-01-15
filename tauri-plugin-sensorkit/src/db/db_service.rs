use crate::{Error, Result};
use sea_orm::DatabaseConnection;
use serde_json::{json, Value};

pub struct DbService {
    db: DatabaseConnection,
}

pub struct SensorFileRecord {
    pub id: i32,
    pub data_name: String,
    pub file_path: String,
    pub synced: bool,
    pub active_sensors: Vec<String>,
    pub created_at: String,
    pub group_id: i32,
    pub group_name: String,
    pub group_created_at: String,
}

pub struct GroupedSensorFiles {
    pub group_id: i32,
    pub group_name: String,
    pub group_created_at: String,
    pub sensor_files: Vec<SensorFileRecord>,
}

impl DbService {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn get_sensor_files(&self) -> Result<Vec<GroupedSensorFiles>> {
        let records = sqlx::query(
            r#"
            SELECT 
                sd.id,
                sd.data_name,
                sd.file_path,
                sd.synced,
                sd.active_sensors,
                sd.created_at,
                sg.id AS group_id,
                sg.group_name,
                sg.group_created_at AS group_created_at
            FROM sensor_data sd
            INNER JOIN sensor_groups sg ON sd.group_id = sg.id
            ORDER BY sg.sorted ASC, sd.created_at DESC
            "#,
        )
        .fetch_all(&self.db)
        .await
        .map_err(|e| Error::SqlError(format!("SensorKit: Error {}", e)))?;

        let records: Vec<SensorFileRecord> = records
            .into_iter()
            .map(|row: sea_orm::QueryResult| {
                let active_sensors = row
                    .get::<String, _>("active_sensor")
                    .split(',')
                    .map(|s| s.to_string())
                    .collect::<Vec<String>>();

                SensorFileRecord {
                    id: row.get::<i32, _>("id"),
                    data_name: row.get::<String, _>("data_name"),
                    file_path: row.get::<String, _>("file_path"),
                    synced: row.get::<bool, _>("synced"),
                    active_sensors,
                    created_at: row.get::<String, _>("created_at"),
                    group_id: row.get::<i32, _>("group_id"),
                    group_name: row.get::<String, _>("group_name"),
                    group_created_at: row.get::<String, _>("group_created_at"),
                }
            })
            .collect::<Vec<SensorFileRecord>>();
        // GroupId でグループ化する
        let mut grouped: Vec<GroupedSensorFiles> = Vec::new();
        for record in records {
            let group_id = record.group_id;

            if let Some(group) = grouped.iter_mut().find(|g| g.group_id == group_id) {
                // 既存のグループに追加
                group.sensor_files.push(record);
            } else {
                // 新しいグループを作成
                grouped.push(GroupedSensorFiles {
                    group_id,
                    group_name: record.group_name.clone(),
                    group_created_at: record.group_created_at.clone(),
                    sensor_files: vec![record],
                });
            }
        }

        Ok(grouped)
    }

    pub async fn create_sensor_data(
        &self,
        group_id: i32,
        data_name: String,
        file_path: String,
        synced: bool,
        active_sensors: Vec<String>,
    ) -> Result<()> {
        sqlx::query(
            r#"
            INSERT INTO sensor_data (
                group_id,
                data_name,
                file_path,
                synced,
                active_sensor_ids
            ) VALUES (?, ?, ?, ?, ?)
            "#,
        )
        .bind(group_id)
        .bind(data_name)
        .bind(file_path)
        .bind(synced)
        .bind(active_sensors.join(","))
        .execute(&self.pool)
        .await
        .map_err(|e| Error::SqlError(format!("SensorKit: Error {}", e)))?;

        Ok(())
    }
}
