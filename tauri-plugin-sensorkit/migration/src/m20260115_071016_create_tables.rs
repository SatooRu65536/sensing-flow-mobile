use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(SensorGroups::Table)
                    .if_not_exists()
                    .col(pk_auto(SensorGroups::Id))
                    .col(string(SensorGroups::Name))
                    .col(integer(SensorGroups::Sorted))
                    .col(timestamp_with_time_zone(SensorGroups::CreatedAt))
                    .to_owned(),
            )
            .await?;

        manager
            .create_table(
                Table::create()
                    .table(SensorData::Table)
                    .if_not_exists()
                    .col(pk_auto(SensorData::Id))
                    .col(string(SensorData::Name))
                    .col(string(SensorData::FilePath))
                    .col(boolean(SensorData::Synced))
                    .col(text(SensorData::ActiveSensorIds))
                    .col(integer(SensorData::GroupId))
                    .col(timestamp_with_time_zone(SensorData::CreatedAt))
                    .foreign_key(
                        ForeignKey::create()
                            .from(SensorData::Table, SensorData::GroupId)
                            .to(SensorGroups::Table, SensorGroups::Id),
                    )
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts
        todo!();

        manager
            .drop_table(Table::drop().table(SensorData::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum SensorGroups {
    Table,
    Id,
    Name,
    Sorted,
    CreatedAt,
}

#[derive(DeriveIden)]
enum SensorData {
    Table,
    Id,
    Name,
    FilePath,
    Synced,
    ActiveSensorIds,
    GroupId,
    CreatedAt,
}
