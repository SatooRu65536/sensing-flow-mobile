use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize, Default)]
#[sea_orm(table_name = "sensor_groups")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    pub sorted: i32,
    pub created_at: DateTime,
}

#[derive(Copy, Clone, Debug, EnumIter)]
pub enum Relation {
    SensorData,
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Self::SensorData => Entity::has_many(super::sensor_data::Entity).into(),
        }
    }
}

impl Related<super::sensor_data::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::SensorData.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
