package dev.satooru.tauripluginsensorkit.sensor

import android.app.Activity
import android.hardware.Sensor
import android.hardware.SensorEvent
import app.tauri.plugin.JSObject

class AccelerometerService(
    activity: Activity,
) : BaseSensorService(activity, Sensor.TYPE_ACCELEROMETER) {
    override val name = "accelerometer"

    override fun createPayload(event: SensorEvent): JSObject {
        val (x, y, z) = event.values
        return JSObject().apply {
            put("sensor", name)
            put("timestamp", event.timestamp)
            put("x", x)
            put("y", y)
            put("z", z)
            put("csv_raw", "${event.timestamp},$x,$y,$z")
            put("csv_header", "timestamp(ns),x(m/s^2),y(m/s^2),z(m/s^2)")
        }
    }
}
