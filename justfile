log-android-console:
    adb logcat | grep -i console
log-android-sensorkit:
    adb logcat | grep SensorKit
log-android-clear:
    adb logcat -c

log-ios-sensorkit:
    xcrun simctl spawn booted log stream --level debug --predicate 'process == "sensing-flow-mobile"'
log-ios-clear:
    xcrun simctl spawn booted log erase
