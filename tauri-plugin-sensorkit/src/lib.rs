pub use error::{Error, Result};
pub use models::*;

use mobile::Sensorkit;
use tauri::{
    plugin::{Builder, TauriPlugin},
    Manager, Runtime,
};

mod commands;
mod error;
mod mobile;
mod models;
mod services;

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
            commands::create_sensor_data,
            commands::delete_sensor_data,
            commands::get_grouped_sensor_data,
            commands::create_group,
            commands::get_group,
            commands::get_groups,
            commands::delete_group,
        ])
        .setup(|app, api| {
            let sensorkit = mobile::init(app, api)?;
            app.manage(sensorkit);
            Ok(())
        })
        .build()
}
