package dev.satooru.tauripluginsensorkit.sensor

import android.app.Activity
import android.hardware.Sensor
import android.hardware.SensorEvent
import app.tauri.plugin.JSObject

class LightSensorService(
    activity: Activity,
) : BaseHardwareSensorService(activity, Sensor.TYPE_LIGHT) {
    override val name = "light"

    override fun createPayload(event: SensorEvent, relativeTimestamp: Long): JSObject {
        // 光センサーの値は values[0] に格納されています
        val lux = event.values[0]
        return JSObject().apply {
            put("sensor", name)
            put("timestamp", relativeTimestamp)
            put("lux", lux)
            put("csv_raw", "$relativeTimestamp,$lux")
            put("csv_header", "timestamp(ms),light(lux)")
        }
    }
}
