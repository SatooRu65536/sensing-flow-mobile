package dev.satooru.tauripluginsensorkit.sensor

import android.app.Activity
import android.hardware.Sensor
import android.hardware.SensorEvent
import app.tauri.plugin.JSObject

class BarometerService(
    activity: Activity,
) : BaseHardwareSensorService(activity, Sensor.TYPE_PRESSURE) {
    override val name = "barometer"

    override fun createPayload(
        event: SensorEvent,
        relativeTimestamp: Long,
    ): JSObject {
        val value = event.values[0]
        return JSObject().apply {
            put("sensor", name)
            put("timestamp", relativeTimestamp)
            put("pressure", value)
            put("csv_raw", "$relativeTimestamp,$value")
            put("csv_header", "timestamp(ms),pressure(hPa)")
        }
    }
}
