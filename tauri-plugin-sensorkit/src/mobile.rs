use crate::services::{DbService, SensorBatchService, StorageService};
use crate::{models::*, SensorkitExt};
use serde::de::DeserializeOwned;
use std::fs;
use tauri::{
    async_runtime::block_on,
    ipc::{Channel, InvokeResponseBody},
    plugin::{PluginApi, PluginHandle},
    AppHandle, Manager, Runtime,
};

#[cfg(target_os = "ios")]
tauri::ios_plugin_binding!(init_plugin_sensorkit);

// initializes the Swift or Kotlin plugin classes
pub fn init<R: Runtime, C: DeserializeOwned>(
    app: &AppHandle<R>,
    api: PluginApi<R, C>,
) -> crate::Result<Sensorkit<R>> {
    let base_dir = app
        .path()
        .app_data_dir()
        .map_err(|_| crate::Error::AppDataDirNotFound)?;
    if !base_dir.exists() {
        fs::create_dir_all(&base_dir).map_err(|_| crate::Error::CreateDirFailed)?;
    }

    let sensor_batch_service = SensorBatchService::new();
    let storage_service = StorageService::new(&base_dir)?;
    let db_service = block_on(async {
        DbService::init(&base_dir)
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
        Ok(Sensorkit {
            handle,
            db_service,
            sensor_batch_service,
            storage_service,
        })
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

        Ok(Sensorkit {
            handle,
            db_service,
            sensor_batch_service,
            storage_service,
        })
    }

    #[cfg(not(any(target_os = "ios", target_os = "android")))]
    #[allow(unreachable_code)]
    {
        unreachable!("The process should have exited already");
    }
}

fn setup_sensor_event_handler<R: Runtime>(
    app_handle: &AppHandle<R>,
) -> Channel<InvokeResponseBody> {
    let app_handle = app_handle.clone();
    Channel::new(move |event| {
        if let InvokeResponseBody::Json(payload) = event {
            app_handle
                .sensorkit()
                .sensor_batch_service
                .push(&app_handle, payload);
        }
        Ok(())
    })
}

/// Access to the sensorkit APIs.
pub struct Sensorkit<R: Runtime> {
    pub handle: PluginHandle<R>,
    pub db_service: DbService,
    pub sensor_batch_service: SensorBatchService,
    pub storage_service: StorageService,
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
