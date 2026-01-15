use crate::Result;
use entity::sensor_data::ActiveSensors;
use entity::{sensor_data, sensor_groups};
use sea_orm::{ActiveModelTrait, DatabaseConnection, EntityTrait, QueryOrder, Set};
use serde::Serialize;

pub struct DbService {
    db: DatabaseConnection,
}

struct SensorDataWithGroup {
    sensor_data: sensor_data::Model,
    sensor_group: sensor_groups::Model,
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
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn get_grouped_sensor_data(&self) -> Result<Vec<GroupedSensorFiles>> {
        let records: Vec<(sensor_data::Model, Option<sensor_groups::Model>)> =
            sensor_data::Entity::find()
                .inner_join(sensor_groups::Entity)
                .select_also(sensor_groups::Entity)
                .order_by_asc(sensor_groups::Column::Sorted)
                .order_by_desc(sensor_data::Column::CreatedAt)
                .all(&self.db)
                .await?;
        let records = records
            .into_iter()
            .map(|(sd, sg)| (sd, sg))
            .into_iter()
            .map(|(sd, sg)| SensorDataWithGroup {
                sensor_data: sd,
                sensor_group: sg.expect("sensor_group must exist"),
            })
            .collect::<Vec<SensorDataWithGroup>>();

        // GroupId でグループ化する
        let mut grouped: Vec<GroupedSensorFiles> = Vec::new();
        for record in records {
            let group_id = record.sensor_group.id;

            if let Some(group) = grouped.iter_mut().find(|g| g.group_id == group_id) {
                // 既存のグループに追加
                group.sensor_data.push(record.sensor_data);
            } else {
                // 新しいグループを作成
                grouped.push(GroupedSensorFiles {
                    group_id: group_id,
                    group_name: record.sensor_group.name.clone(),
                    created_at: record.sensor_group.created_at.to_string(),
                    sensor_data: vec![record.sensor_data],
                });
            }
        }

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

    pub async fn create_sensor_data(
        &self,
        group_id: i32,
        name: String,
        file_path: String,
        synced: bool,
        active_sensors: Vec<String>,
    ) -> Result<sensor_data::Model> {
        let record = sensor_data::ActiveModel {
            group_id: Set(group_id),
            name: Set(name),
            file_path: Set(file_path),
            synced: Set(synced),
            active_sensors: Set(ActiveSensors(active_sensors)),
            ..Default::default()
        }
        .insert(&self.db)
        .await
        .map_err(|e| {
            println!("SensorKit error: {:?}", e);
            e // そのまま元のエラーを返す
        })?;

        Ok(record)
    }
}
