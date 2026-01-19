use serde::de::DeserializeOwned;
use tauri::{
    plugin::{PluginApi, PluginHandle},
    AppHandle, Runtime,
};

use crate::models::*;

#[cfg(target_os = "ios")]
tauri::ios_plugin_binding!(init_plugin_auth_cognito);

// initializes the Kotlin or Swift plugin classes
pub fn init<R: Runtime, C: DeserializeOwned>(
    _app: &AppHandle<R>,
    api: PluginApi<R, C>,
) -> crate::Result<AuthCognito<R>> {
    #[cfg(target_os = "android")]
    let handle = api.register_android_plugin("", "AuthCognitoPlugin")?;
    #[cfg(target_os = "ios")]
    let handle = api.register_ios_plugin(init_plugin_auth_cognito)?;
    Ok(AuthCognito(handle))
}

/// Access to the auth-cognito APIs.
pub struct AuthCognito<R: Runtime>(PluginHandle<R>);

impl<R: Runtime> AuthCognito<R> {}
