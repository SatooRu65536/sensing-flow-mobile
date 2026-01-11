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
            api.register_android_plugin("dev.satooru.tauripluginsensorkit", "SensorKitPlugin")?;
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
    pub fn get_available_sensors(&self) -> crate::Result<GetAvailableSensorsResponse> {
        self.0
            .run_mobile_plugin("getAvailableSensors", GetAvailableSensorsRequest {})
            .map(|res: GetAvailableSensorsResponse| res)
            .map_err(Into::into)
    }

    pub fn start_sensors(&self, payload: StartSensorsRequest) -> crate::Result<()> {
        self.0
            .run_mobile_plugin("startSensors", payload)
            .map(|_: ()| ())
            .map_err(Into::into)
    }

    pub fn stop_sensors(&self) -> crate::Result<()> {
        self.0
            .run_mobile_plugin("stopSensors", ())
            .map(|_: ()| ())
            .map_err(Into::into)
    }
}
