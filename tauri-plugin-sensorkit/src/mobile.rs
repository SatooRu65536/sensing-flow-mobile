use serde::de::DeserializeOwned;
use tauri::{
    plugin::{PluginApi, PluginHandle},
    AppHandle, Runtime,
};

use crate::models::*;

#[cfg(target_os = "ios")]
tauri::ios_plugin_binding!(init_plugin_sensorkit);

// initializes the Swift or Kotlin plugin classes
pub fn init<R: Runtime, C: DeserializeOwned>(
    _app: &AppHandle<R>,
    api: PluginApi<R, C>,
) -> crate::Result<Sensorkit<R>> {
    #[cfg(target_os = "ios")]
    {
        let handle = api.register_ios_plugin(init_plugin_sensorkit)?;
        Ok(Sensorkit(handle))
    }

    #[cfg(target_os = "android")]
    {
        let handle =
            api.register_android_plugin("dev.satooru.tauripluginsensorkit", "ExamplePlugin")?;
        Ok(Sensorkit(handle))
    }

    #[cfg(not(any(target_os = "ios", target_os = "android")))]
    #[allow(unreachable_code)]
    {
        unreachable!("The process should have exited already");
    }
}

/// Access to the sensorkit APIs.
pub struct Sensorkit<R: Runtime>(PluginHandle<R>);

impl<R: Runtime> Sensorkit<R> {
    pub fn ping(&self, payload: PingRequest) -> crate::Result<PingResponse> {
        self.0
            .run_mobile_plugin("ping", payload)
            .map_err(Into::into)
    }

    pub fn start_accelerometer(&self, payload: StartAccelerometerRequest) -> crate::Result<()> {
        self.0
            .run_mobile_plugin("startAccelerometer", payload)
            .map(|_: ()| ())
            .map_err(Into::into)
    }

    pub fn stop_accelerometer(&self) -> crate::Result<()> {
        self.0
            .run_mobile_plugin("stopAccelerometer", StopAccelerometerRequest {})
            .map(|_: ()| ())
            .map_err(Into::into)
    }
}
