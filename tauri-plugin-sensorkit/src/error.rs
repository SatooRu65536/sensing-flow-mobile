use sea_orm::DbErr;
use serde::{ser::Serializer, Serialize};

pub type Result<T> = std::result::Result<T, Error>;

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error(transparent)]
    Io(#[from] std::io::Error),

    #[error("Failed to get app data directory path")]
    AppDataDirNotFound,

    #[error("Failed to create directory")]
    CreateDirFailed,

    #[error("Failed to delete directory")]
    DeleteDirFailed,

    #[cfg(mobile)]
    #[error(transparent)]
    PluginInvoke(#[from] tauri::plugin::mobile::PluginInvokeError),

    #[error("SQL error: {0}")]
    SqlError(String),
}

impl Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

impl From<DbErr> for Error {
    fn from(e: DbErr) -> Self {
        Error::SqlError(e.to_string())
    }
}
