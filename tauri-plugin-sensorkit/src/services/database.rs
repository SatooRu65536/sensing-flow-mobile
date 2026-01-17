use std::path::Path;

use crate::Result;
use entity::sensor_data::ActiveSensors;
use entity::{sensor_data, sensor_groups};
use migration::{Migrator, MigratorTrait};
use sea_orm::{
    ActiveModelTrait, ConnectOptions, Database, DatabaseConnection, EntityTrait, QueryOrder, Set,
};
use serde::Serialize;

pub struct DbService {
    db: DatabaseConnection,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GroupedSensorFiles {
    pub group_id: i32,
    pub group_name: String,
    pub created_at: String,
    pub sensor_data: Vec<sensor_data::Model>,
}

impl DbService {
    pub async fn init(base_dir: &Path) -> Result<Self> {
        // 1. パスの特定とディレクトリ作成
        let db_path = base_dir.join("sensorkit.db");
        let db_path_str = format!("sqlite:/{}?mode=rwc", db_path.to_string_lossy());

        // 2. 接続設定
        let mut opt = ConnectOptions::new(db_path_str);
        opt.max_connections(1).min_connections(1);

        // 3. 接続確立
        let db = Database::connect(opt).await?;

        // 4. マイグレーション実行
        Migrator::up(&db, None).await?;

        Ok(Self { db })
    }

    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn get_grouped_sensor_data(&self) -> Result<Vec<GroupedSensorFiles>> {
        let records: Vec<(sensor_groups::Model, Vec<sensor_data::Model>)> =
            sensor_groups::Entity::find()
                .find_with_related(sensor_data::Entity)
                .order_by_asc(sensor_groups::Column::Sorted)
                .order_by_desc(sensor_data::Column::CreatedAt)
                .all(&self.db)
                .await?;

        let grouped = records
            .into_iter()
            .map(|(group, data_list)| GroupedSensorFiles {
                group_id: group.id,
                group_name: group.name,
                created_at: group.created_at.to_string(),
                sensor_data: data_list,
            })
            .collect();

        Ok(grouped)
    }

    pub async fn create_sensor_group(&self, name: String) -> Result<sensor_groups::Model> {
        let sorted = sensor_groups::Entity::find()
            .order_by_desc(sensor_groups::Column::Sorted)
            .one(&self.db)
            .await?
            .map_or(0, |m| m.sorted + 1);

        let model = sensor_groups::ActiveModel {
            name: Set(name),
            sorted: Set(sorted),
            ..Default::default()
        }
        .insert(&self.db)
        .await?;

        Ok(model)
    }

    pub async fn get_sensor_groups(&self) -> Result<Vec<sensor_groups::Model>> {
        let records = sensor_groups::Entity::find()
            .order_by_asc(sensor_groups::Column::Sorted)
            .all(&self.db)
            .await?;

        Ok(records)
    }

    pub async fn create_sensor_data(
        &self,
        group_id: i32,
        name: String,
        folder_path: String,
        synced: bool,
        active_sensors: Vec<String>,
    ) -> Result<sensor_data::Model> {
        let record = sensor_data::ActiveModel {
            group_id: Set(group_id),
            name: Set(name),
            folder_path: Set(folder_path),
            synced: Set(synced),
            active_sensors: Set(ActiveSensors(active_sensors)),
            ..Default::default()
        }
        .insert(&self.db)
        .await?;

        Ok(record)
    }
}
