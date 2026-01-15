use crate::Result;
use migration::Migrator;
use sea_orm::{ConnectOptions, ConnectionTrait, Database, DatabaseConnection};
use std::fs;
use tauri::{AppHandle, Manager, Runtime};

pub async fn init_db<R: Runtime>(app: &AppHandle<R>) -> Result<DatabaseConnection> {
    // データベースファイルのパスを特定
    let base_dir = app
        .path()
        .app_data_dir()
        .map_err(|_| crate::Error::AppDataDirNotFound)?;

    if !base_dir.exists() {
        fs::create_dir_all(&base_dir)?;
    }

    let db_path = base_dir.join("sensorkit.db");
    let mut opt = ConnectOptions::new(format!("sqlite://{}", db_path.to_string_lossy()))
        .max_connections(1)
        .min_connections(1);

    // 接続確立
    let db = Database::connect(opt).await?;

    // マイグレーション実行
    Migrator::up(db, None).await?;

    Ok(db)
}
