# Sensing Flow Mobile
This is the mobile application for Sensing Flow application.

## Setup Development Environment
### 1. Install Dependencies
```shell
pnpm install
```

### 2. Create Environment Variables File
```shell
cp .env.example .env.development
```

### 3. Start Development Application
```shell
pnpm dev:android
```

## Build Application
### 1. Remove Existing Debug or Release APK
```shell
# Debug APK
rm ./src-tauri/gen/android/app/build/outputs/apk/universal/debug/app-universal-debug.apk
# Release APK
rm ./src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release.apk
```

### 2. Build Debug APK
```shell
# Debug APK
pnpm tauri android build -d --apk true
# Release APK
pnpm tauri android build --apk true
```
### 3. Sign Debug APK
```shell
# Debug APK
apksigner sign --ks ./sensing-flow.jks ./src-tauri/gen/android/app/build/outputs/apk/universal/debug/app-universal-debug.apk
# Release APK
apksigner sign --ks ./sensing-flow.jks ./src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release.apk
```

### 4. Install Debug APK on Device
```shell
# Debug APK
adb -s <device_id> install -r ./src-tauri/gen/android/app/build/outputs/apk/universal/debug/app-universal-debug.apk
# Release APK
adb -s <device_id> install -r ./src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release.apk
```
