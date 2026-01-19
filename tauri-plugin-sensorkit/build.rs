const COMMANDS: &[&str] = &[
    "get_available_sensors",
    "start_sensors",
    "stop_sensors",
    "create_sensor_data",
    "delete_sensor_data",
    "get_grouped_sensor_data",
    "create_group",
    "get_group",
    "get_groups",
    "delete_group",
    "sync_sensor_data",
    "unsync_sensor_data",
    "registerListener",
    "unregister_listener",
];

fn main() {
    tauri_plugin::Builder::new(COMMANDS)
        .android_path("android")
        .ios_path("ios")
        .build();
}
