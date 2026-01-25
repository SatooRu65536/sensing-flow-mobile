use sea_orm::FromJsonQueryResult;
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, FromJsonQueryResult)]
pub struct Sensors(pub Vec<String>);

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "sync_state")]
#[serde(rename_all = "camelCase")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub sensor_data_id: i32,
    pub upload_id: Uuid, // UUID
    pub synced_sensor_names: Sensors,
    pub failed_sensor_names: Sensors,
    pub created_at: DateTimeUtc,
}

#[derive(Copy, Clone, Debug, EnumIter)]
pub enum Relation {
    SensorData,
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Self::SensorData => Entity::belongs_to(super::sensor_data::Entity)
                .from(Column::SensorDataId)
                .to(super::sensor_data::Column::Id)
                .into(),
        }
    }
}

impl Related<super::sensor_data::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::SensorData.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
