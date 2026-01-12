package dev.satooru.tauripluginsensorkit.sensor

import android.app.Activity
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import app.tauri.plugin.Channel
import app.tauri.plugin.JSObject

interface SensorService {
    val name: String
    var channel: Channel?

    fun isAvailable(): Boolean

    fun start(samplingUs: Int)

    fun stop()
}

abstract class BaseSensorService(
    private val activity: Activity,
    private val sensorType: Int,
) : SensorService {
    override var channel: Channel? = null
    private var listening = false
    private var listener: SensorEventListener? = null

    private val sensorManager by lazy {
        activity.getSystemService(Activity.SENSOR_SERVICE) as SensorManager
    }

    private val sensor: Sensor? by lazy {
        sensorManager.getDefaultSensor(sensorType)
    }

    override fun isAvailable(): Boolean = sensor != null

    override fun start(samplingUs: Int) {
        if (!isAvailable() || listening) return

        listener =
            object : SensorEventListener {
                override fun onSensorChanged(event: SensorEvent) {
                    val payload = createPayload(event)
                    channel?.send(payload)
                }

                override fun onAccuracyChanged(
                    sensor: Sensor?,
                    accuracy: Int,
                ) {}
            }

        sensorManager.registerListener(listener, sensor, samplingUs)
        listening = true
    }

    override fun stop() {
        sensorManager.unregisterListener(listener)
        listening = false
    }

    // 各センサで固有のデータ変換ロジックを実装する
    protected abstract fun createPayload(event: SensorEvent): JSObject
}
