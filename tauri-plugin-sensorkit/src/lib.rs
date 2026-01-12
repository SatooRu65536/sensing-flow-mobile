pub use error::{Error, Result};
pub use models::*;

use mobile::Sensorkit;
use tauri::{
    async_runtime::block_on,
    plugin::{Builder, TauriPlugin},
    Manager, Runtime,
};

mod commands;
mod db;
mod error;
mod file;
mod mobile;
mod models;

/// Extensions to [`tauri::App`], [`tauri::AppHandle`] and [`tauri::Window`] to access the sensorkit APIs.
pub trait SensorkitExt<R: Runtime> {
    fn sensorkit(&self) -> &Sensorkit<R>;
}

impl<R: Runtime, T: Manager<R>> crate::SensorkitExt<R> for T {
    fn sensorkit(&self) -> &Sensorkit<R> {
        self.state::<Sensorkit<R>>().inner()
    }
}

/// Initializes the plugin.
pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("sensorkit")
        .invoke_handler(tauri::generate_handler![
            commands::get_available_sensors,
            commands::start_sensors,
            commands::stop_sensors,
            commands::get_sensor_files
        ])
        .setup(|app, api| {
            let handle = app.clone();
            let db = block_on(async {
                db::init_db(&handle)
                    .await
                    .map_err(|e| {
                        eprintln!("DATABASE ERROR: {:?}", e);
                        e
                    })
                    .expect("Failed to init database")
            });

            let sensorkit = mobile::init(app, api, db)?;
            app.manage(sensorkit);
            Ok(())
        })
        .build()
}
