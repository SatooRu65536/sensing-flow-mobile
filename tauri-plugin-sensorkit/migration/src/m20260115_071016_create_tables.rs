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
                    .col(
                        ColumnDef::new(SensorGroups::CreatedAt)
                            .timestamp()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
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
                    .col(string(SensorData::FolderPath))
                    .col(text(SensorData::ActiveSensors))
                    .col(integer(SensorData::GroupId))
                    .col(string_null(SensorData::UploadId))
                    .col(
                        ColumnDef::new(SensorData::CreatedAt)
                            .timestamp()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
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
        manager
            .drop_table(Table::drop().table(SensorData::Table).to_owned())
            .await?;
        manager
            .drop_table(Table::drop().table(SensorGroups::Table).to_owned())
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
    FolderPath,
    ActiveSensors,
    GroupId,
    CreatedAt,
    UploadId,
}
