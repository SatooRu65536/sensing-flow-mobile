package dev.satooru.tauripluginsensorkit

import android.app.Activity
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.util.Log
import android.webkit.WebView
import app.tauri.annotation.Command
import app.tauri.annotation.InvokeArg
import app.tauri.annotation.TauriPlugin
import app.tauri.plugin.JSObject
import app.tauri.plugin.Plugin
import app.tauri.plugin.Invoke

@InvokeArg
class PingArgs {
    var value: String? = null
}

@TauriPlugin
class ExamplePlugin(private val activity: Activity) : Plugin(activity) {
    private val implementation = Example()

    private var sensorManager: SensorManager? = null
    private var accelerometer: Sensor? = null
    private var listener: SensorEventListener? = null
    private var listening: Boolean = false

    @Command
    fun ping(invoke: Invoke) {
        val args = invoke.parseArgs(PingArgs::class.java)
        val ret = JSObject()
        ret.put("value", implementation.pong(args.value ?: "default value :("))
        invoke.resolve(ret)
    }

    @InvokeArg
    class StartAccelerometerArgs {
        var delayMs: Int = 0
    }

    @Command
    fun startAccelerometer(invoke: Invoke) {
        Log.d("SensorKit", "startAccelerometer called")

        val args = invoke.parseArgs(StartAccelerometerArgs::class.java)
        if (listening) {
            invoke.resolve()
            return
        }

        sensorManager = activity.getSystemService(Activity.SENSOR_SERVICE) as SensorManager
        accelerometer = sensorManager?.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
        
        val delay = when (args.delayMs ?: 0) {
            in 1..9 -> SensorManager.SENSOR_DELAY_GAME
            in 10..49 -> SensorManager.SENSOR_DELAY_UI
            in 50..Int.MAX_VALUE -> SensorManager.SENSOR_DELAY_NORMAL
            else -> SensorManager.SENSOR_DELAY_NORMAL
        }
        
        listener = object : SensorEventListener {
            override fun onSensorChanged(event: SensorEvent) {
                if (event.values.size >= 3) {
                    val xVal = event.values[0].toDouble()
                    val yVal = event.values[1].toDouble()
                    val zVal = event.values[2].toDouble()
                    val ts = event.timestamp
                    
                    val payload = JSObject()
                    payload.put("x", xVal)
                    payload.put("y", yVal)
                    payload.put("z", zVal)
                    payload.put("timestamp", ts)
                    
                    trigger("accelerometer", payload)
                }
            }
            
            override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}
        }
        
        val ok = sensorManager?.registerListener(listener, accelerometer, delay) ?: false
        Log.d("SensorKit", "Accelerometer listening started: $ok")
        listening = ok
        invoke.resolve()
    }

    @Command
    fun stopAccelerometer(invoke: Invoke) {
        Log.d("SensorKit", "stopAccelerometer called")

        if (listening) {
            sensorManager?.unregisterListener(listener)
            listening = false
        }
        invoke.resolve()
    }
}
