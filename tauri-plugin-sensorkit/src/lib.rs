use tauri::{
    plugin::{Builder, TauriPlugin},
    Manager, Runtime,
};

pub use models::*;

#[cfg(desktop)]
mod desktop;
#[cfg(mobile)]
mod mobile;

mod commands;
mod error;
mod models;

pub use error::{Error, Result};

#[cfg(desktop)]
use desktop::Sensorkit;
#[cfg(mobile)]
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
            commands::ping,
            commands::start_accelerometer,
            commands::stop_accelerometer
        ])
        .setup(|app, api| {
            #[cfg(mobile)]
            let sensorkit = mobile::init(app, api)?;
            #[cfg(desktop)]
            let sensorkit = desktop::init(app, api)?;
            app.manage(sensorkit);
            Ok(())
        })
        .build()
}
