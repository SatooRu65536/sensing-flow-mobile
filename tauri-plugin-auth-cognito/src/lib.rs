pub use error::{Error, Result};
pub use models::*;

use mobile::AuthCognito;
use tauri::{
    plugin::{Builder, TauriPlugin},
    Manager, Runtime,
};

mod commands;
mod error;
mod mobile;
mod models;

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
        .invoke_handler(tauri::generate_handler![
            commands::start_auth,
            commands::exchange_code_for_token,
            commands::refresh_token,
        ])
        .setup(|app, api| {
            let auth_cognito = mobile::init(app, api)?;
            app.manage(auth_cognito);
            Ok(())
        })
        .build()
}
