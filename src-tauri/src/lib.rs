#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_sensorkit::init())
        .plugin(tauri_plugin_auth_cognito::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
