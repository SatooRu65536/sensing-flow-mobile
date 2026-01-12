package dev.satooru.tauripluginsensorkit.sensor

import android.app.Activity
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import app.tauri.plugin.Channel
import app.tauri.plugin.JSObject

class AccelerometerService(
    private val activity: Activity,
) : SensorService {
    override val name = "accelerometer"
    override var channel: Channel? = null

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

        listener =
            object : SensorEventListener {
                override fun onSensorChanged(event: SensorEvent) {
                    val timestamp = event.timestamp
                    val x = event.values[0]
                    val y = event.values[1]
                    val z = event.values[2]
                    val csvRaw = "$timestamp,$x,$y,$z"

                    val payload =
                        JSObject().apply {
                            put("sensor", name)
                            put("timestamp", timestamp)
                            put("x", x)
                            put("y", y)
                            put("z", z)
                            put("csv_raw", csvRaw)
                        }

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
}
