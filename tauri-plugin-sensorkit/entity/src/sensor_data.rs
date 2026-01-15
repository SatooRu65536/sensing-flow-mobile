use sea_orm::FromJsonQueryResult;
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, FromJsonQueryResult)]
pub struct ActiveSensors(pub Vec<String>);

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "sensor_data")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    pub file_path: String,
    pub synced: bool,
    pub active_sensor: ActiveSensors,
    pub group_id: i32,
    pub created_at: DateTimeWithTimeZone,
}

#[derive(Copy, Clone, Debug, EnumIter)]
pub enum Relation {
    SensorGroup,
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Self::SensorGroup => Entity::belongs_to(super::sensor_groups::Entity)
                .from(Column::GroupId)
                .to(super::sensor_groups::Column::Id)
                .into(),
        }
    }
}

impl Related<super::sensor_groups::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::SensorGroup.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
