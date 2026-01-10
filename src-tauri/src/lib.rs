use tauri::AppHandle;
use tauri_plugin_sensorkit::{PingRequest, SensorkitExt};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(app_handle: AppHandle, name: &str) -> String {
    // format!("Hello, {}! You've been greeted from Rust!", name)
    let req = PingRequest {
        value: Some(name.to_string()),
    };
    let res = app_handle.sensorkit().ping(req).unwrap();

    format!("Sensorkit responded with: {:?}", res.value.unwrap())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_sensorkit::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
