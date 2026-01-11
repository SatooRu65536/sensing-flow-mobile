package dev.satooru.tauripluginsensorkit.sensor

import android.app.Activity
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import app.tauri.plugin.JSObject

class AccelerometerService(
    private val activity: Activity,
    private val trigger: (String, JSObject) -> Unit
) : SensorService {
    override val name = "accelerometer"

    private val sensorManager by lazy {
        activity.getSystemService(Activity.SENSOR_SERVICE) as SensorManager
    }

    private val sensor: Sensor? by lazy {
        sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
    }

    private var listener: SensorEventListener? = null
    private var listening = false

    override fun isAvailable(): Boolean = sensor != null

    override fun start(samplingUs: Int) {
        if (!isAvailable() || listening) return

        listener = object : SensorEventListener {
            override fun onSensorChanged(event: SensorEvent) {
                val payload = JSObject().apply {
                    put("x", event.values[0])
                    put("y", event.values[1])
                    put("z", event.values[2])
                    put("timestamp", event.timestamp)
                }
                trigger(name, payload)
            }
            override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}
        }

        sensorManager.registerListener(listener, sensor, samplingUs)
        listening = true
    }

    override fun stop() {
        sensorManager.unregisterListener(listener)
        listening = false
    }
}
