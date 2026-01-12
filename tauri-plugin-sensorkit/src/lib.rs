use tauri::{
    plugin::{Builder, TauriPlugin},
    Manager, Runtime,
};

pub use models::*;

mod mobile;

mod commands;
mod error;
mod file_service;
mod models;

pub use error::{Error, Result};

use mobile::Sensorkit;

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
            commands::stop_sensors
        ])
        .setup(|app, api| {
            let sensorkit = mobile::init(app, api)?;
            app.manage(sensorkit);
            Ok(())
        })
        .build()
}
