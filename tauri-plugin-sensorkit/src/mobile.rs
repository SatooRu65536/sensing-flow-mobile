use crate::file_service::FileService;
use crate::models::*;
use serde::de::DeserializeOwned;
use std::sync::Arc;
use tauri::{
    ipc::{Channel, InvokeResponseBody},
    plugin::{PluginApi, PluginHandle},
    AppHandle, Emitter, Manager, Runtime,
};

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
        let app_handle = _app.clone();
        handle.run_mobile_plugin::<()>(
            "setEventHandler",
            SetEventHandlerArgs {
                handler: Channel::new(move |event| {
                    if let InvokeResponseBody::Json(payload) = event {
                        if let Ok(mut data) = serde_json::from_str::<serde_json::Value>(&payload) {
                            // FileService への書き込み
                            let sensor_name =
                                data["sensor"].as_str().unwrap_or("unknown").to_string();
                            if let Some(fs) = app_handle.try_state::<Arc<FileService>>() {
                                let line = data["csv_raw"].as_str().unwrap_or_default().to_string();
                                let header =
                                    data["csv_header"].as_str().unwrap_or_default().to_string();
                                fs.push_line(&sensor_name, line, header);
                            }

                            // TS 側で不要なフィールドを削除
                            if let Some(obj) = data.as_object_mut() {
                                obj.remove("csv_raw");
                                obj.remove("csv_header");
                            }

                            // TS 側へのイベント発火
                            let event_name = format!("sensorkit://{}/update", sensor_name);
                            let _ = app_handle.emit(&event_name, data);
                        }
                    }
                    Ok(())
                }),
            },
        )?;
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
