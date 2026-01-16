package dev.satooru.tauripluginsensorkit.sensor

import android.app.Activity
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import app.tauri.plugin.JSObject

abstract class BaseHardwareSensorService(
    protected open val activity: Activity,
    private val sensorType: Int,
) : BaseSensorService() {
    
    private val sensorManager by lazy {
        activity.getSystemService(Activity.SENSOR_SERVICE) as SensorManager
    }
    private val sensor: Sensor? by lazy {
        sensorManager.getDefaultSensor(sensorType)
    }
    private var listener: SensorEventListener? = null

    override fun isAvailable(): Boolean = sensor != null

    override fun registerListener(samplingUs: Int) {
        listener = object : SensorEventListener {
            override fun onSensorChanged(event: SensorEvent) {
                // ナノ秒からミリ秒への相対時間変換
                val relativeTimestamp = (event.timestamp - startTimeNanos) / 1_000_000
                channel?.send(createPayload(event, relativeTimestamp))
            }
            override fun onAccuracyChanged(s: Sensor?, a: Int) {}
        }
        sensorManager.registerListener(listener, sensor, samplingUs)
    }

    override fun unregisterListener() {
        sensorManager.unregisterListener(listener)
        listener = null
    }

    protected abstract fun createPayload(event: SensorEvent, relativeTimestamp: Long): JSObject
}
