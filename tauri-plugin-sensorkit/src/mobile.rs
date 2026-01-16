use crate::models::*;
use crate::services::{DbService, StorageService};
use serde::de::DeserializeOwned;
use std::sync::Arc;
use tauri::{
    async_runtime::block_on,
    ipc::{Channel, InvokeResponseBody},
    plugin::{PluginApi, PluginHandle},
    AppHandle, Emitter, Manager, Runtime,
};

#[cfg(target_os = "ios")]
tauri::ios_plugin_binding!(init_plugin_sensorkit);

// initializes the Swift or Kotlin plugin classes
pub fn init<R: Runtime, C: DeserializeOwned>(
    app: &AppHandle<R>,
    api: PluginApi<R, C>,
) -> crate::Result<Sensorkit<R>> {
    let handle = app.clone();
    let db_service = block_on(async {
        DbService::init(&handle)
            .await
            .map_err(|e| {
                eprintln!("DATABASE ERROR: {:?}", e);
                e
            })
            .expect("Failed to init database")
    });

    #[cfg(target_os = "ios")]
    {
        let handle = api.register_ios_plugin(init_plugin_sensorkit)?;
        Ok(Sensorkit { handle, db_service })
    }

    #[cfg(target_os = "android")]
    {
        let handle =
            api.register_android_plugin("dev.satooru.tauripluginsensorkit", "SensorKitPlugin")?;
        let app_handle = app.clone();
        handle.run_mobile_plugin::<()>(
            "setEventHandler",
            SetEventHandlerArgs {
                handler: setup_sensor_event_handler(&app_handle),
            },
        )?;

        Ok(Sensorkit { handle, db_service })
    }

    #[cfg(not(any(target_os = "ios", target_os = "android")))]
    #[allow(unreachable_code)]
    {
        unreachable!("The process should have exited already");
    }
}

fn setup_sensor_event_handler<R: tauri::Runtime>(
    app_handle: &AppHandle<R>,
) -> Channel<InvokeResponseBody> {
    let app_handle = app_handle.clone();
    Channel::new(move |event| {
        if let InvokeResponseBody::Json(payload) = event {
            if let Ok(mut data) = serde_json::from_str::<serde_json::Value>(&payload) {
                // StorageService への書き込み
                let sensor_name = data["sensor"].as_str().unwrap_or("unknown").to_string();
                if let Some(fs) = app_handle.try_state::<Arc<StorageService>>() {
                    let line = data["csv_raw"].as_str().unwrap_or_default().to_string();
                    let header = data["csv_header"].as_str().unwrap_or_default().to_string();
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
    })
}

/// Access to the sensorkit APIs.
pub struct Sensorkit<R: Runtime> {
    pub handle: PluginHandle<R>,
    pub db_service: DbService,
}

impl<R: Runtime> Sensorkit<R> {
    pub fn get_available_sensors(&self) -> crate::Result<GetAvailableSensorsResponse> {
        self.handle
            .run_mobile_plugin("getAvailableSensors", GetAvailableSensorsRequest {})
            .map(|res: GetAvailableSensorsResponse| res)
            .map_err(Into::into)
    }

    pub fn start_sensors(&self, payload: StartSensorsRequest) -> crate::Result<()> {
        self.handle
            .run_mobile_plugin("startSensors", payload)
            .map(|_: ()| ())
            .map_err(Into::into)
    }

    pub fn stop_sensors(&self) -> crate::Result<()> {
        self.handle
            .run_mobile_plugin("stopSensors", ())
            .map(|_: ()| ())
            .map_err(Into::into)
    }
}
