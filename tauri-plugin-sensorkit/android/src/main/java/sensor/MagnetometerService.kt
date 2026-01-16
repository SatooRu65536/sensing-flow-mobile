package dev.satooru.tauripluginsensorkit.sensor

import android.app.Activity
import android.hardware.Sensor
import android.hardware.SensorEvent
import app.tauri.plugin.JSObject

class MagnetometerService(
    activity: Activity,
) : BaseHardwareSensorService(activity, Sensor.TYPE_MAGNETIC_FIELD) {
    override val name = "magnetometer"

    override fun createPayload(event: SensorEvent, relativeTimestamp: Long): JSObject {
        val (x, y, z) = event.values
        return JSObject().apply {
            put("sensor", name)
            put("timestamp", relativeTimestamp)
            put("x", x)
            put("y", y)
            put("z", z)
            put("csv_raw", "${relativeTimestamp},$x,$y,$z")
            put("csv_header", "timestamp(ms),x(μT),y(μT),z(μT)")
        }
    }
}
