log:
    adb logcat | grep -i console
log-kt:
    adb logcat | grep SensorKit
clear:
    adb logcat -c
