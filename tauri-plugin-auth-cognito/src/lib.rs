use tauri::{
    plugin::{Builder, TauriPlugin},
    Manager, Runtime,
};

pub use models::*;

#[cfg(mobile)]
mod mobile;

mod commands;
mod error;
mod models;

pub use error::{Error, Result};

#[cfg(mobile)]
use mobile::AuthCognito;

/// Extensions to [`tauri::App`], [`tauri::AppHandle`] and [`tauri::Window`] to access the auth-cognito APIs.
pub trait AuthCognitoExt<R: Runtime> {
    fn auth_cognito(&self) -> &AuthCognito<R>;
}

impl<R: Runtime, T: Manager<R>> crate::AuthCognitoExt<R> for T {
    fn auth_cognito(&self) -> &AuthCognito<R> {
        self.state::<AuthCognito<R>>().inner()
    }
}

/// Initializes the plugin.
pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("auth-cognito")
        .invoke_handler(tauri::generate_handler![])
        .setup(|app, api| {
            let auth_cognito = mobile::init(app, api)?;
            app.manage(auth_cognito);
            Ok(())
        })
        .build()
}
