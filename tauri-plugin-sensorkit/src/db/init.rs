use sqlx::{
    sqlite::{SqliteConnectOptions, SqlitePoolOptions},
    SqlitePool,
};
use std::fs;
use tauri::{AppHandle, Manager, Runtime};

pub async fn init_db<R: Runtime>(
    app: &AppHandle<R>,
) -> Result<SqlitePool, Box<dyn std::error::Error>> {
    // データベースファイルの保存場所を特定
    let base_dir = app
        .path()
        .app_data_dir()
        .map_err(|_| crate::Error::AppDataDirNotFound)?;

    if !base_dir.exists() {
        fs::create_dir_all(&base_dir)?;
    }

    let db_path = base_dir.join("sensorkit.db");
    let conn_opts = SqliteConnectOptions::new()
        .filename(&db_path)
        .create_if_missing(true);

    // 接続プールの作成
    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect_with(conn_opts)
        .await?;

    sqlx::query(include_str!("./migrations/001-create_init_tables.sql"))
        .execute(&pool)
        .await?;

    Ok(pool)
}
