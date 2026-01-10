const COMMANDS: &[&str] = &["ping", "start_accelerometer", "stop_accelerometer", "registerListener"];

fn main() {
    tauri_plugin::Builder::new(COMMANDS)
        .android_path("android")
        .ios_path("ios")
        .build();
}
