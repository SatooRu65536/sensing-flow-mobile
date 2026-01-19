use crate::OpenAuthRequest;
use serde::de::DeserializeOwned;
use tauri::{
    plugin::{PluginApi, PluginHandle},
    AppHandle, Emitter, Runtime,
};
use tauri_plugin_deep_link::DeepLinkExt;

#[cfg(target_os = "ios")]
tauri::ios_plugin_binding!(init_plugin_auth_cognito);

// initializes the Kotlin or Swift plugin classes
pub fn init<R: Runtime, C: DeserializeOwned>(
    app: &AppHandle<R>,
    api: PluginApi<R, C>,
) -> crate::Result<AuthCognito<R>> {
    let handle = app.clone();
    app.deep_link().on_open_url(move |event| {
        handle
            .emit("auth-callback", event.urls().first().unwrap().as_str())
            .unwrap();
    });

    #[cfg(target_os = "android")]
    {
        let handle =
            api.register_android_plugin("dev.satooru.tauripluginauthcognito", "AuthCognitoPlugin")?;
        Ok(AuthCognito { handle })
    }

    #[cfg(target_os = "ios")]
    {
        let handle = api.register_ios_plugin(init_plugin_auth_cognito)?;
        Ok(AuthCognito { handle })
    }

    #[cfg(not(any(target_os = "ios", target_os = "android")))]
    #[allow(unreachable_code)]
    {
        unreachable!("The process should have exited already");
    }
}

/// Access to the auth-cognito APIs.
pub struct AuthCognito<R: Runtime> {
    pub handle: PluginHandle<R>,
}

impl<R: Runtime> AuthCognito<R> {
    pub fn start_auth(&self, payload: OpenAuthRequest) -> crate::Result<()> {
        self.handle
            .run_mobile_plugin("openAuth", payload)
            .map_err(Into::into)
    }
}
