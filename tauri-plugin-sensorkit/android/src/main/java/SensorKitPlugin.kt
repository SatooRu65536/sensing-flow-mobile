package dev.satooru.tauripluginsensorkit
import android.app.Activity
import android.hardware.SensorManager
import android.util.Log
import app.tauri.annotation.Command
import app.tauri.annotation.InvokeArg
import app.tauri.annotation.TauriPlugin
import app.tauri.plugin.Channel
import app.tauri.plugin.Invoke
import app.tauri.plugin.JSObject
import app.tauri.plugin.Plugin
import dev.satooru.tauripluginsensorkit.sensor.AccelerometerService
import dev.satooru.tauripluginsensorkit.sensor.BarometerService
import dev.satooru.tauripluginsensorkit.sensor.GyroscopeService
import dev.satooru.tauripluginsensorkit.sensor.LinearAccelerationService
import dev.satooru.tauripluginsensorkit.sensor.LocationService
import dev.satooru.tauripluginsensorkit.sensor.MagnetometerService
import dev.satooru.tauripluginsensorkit.sensor.SensorRegistry
import dev.satooru.tauripluginsensorkit.sensor.LightSensorService

@InvokeArg
class StartSensorsArgs : HashMap<String, Int>()

@InvokeArg
class SetEventHandlerArgs {
    lateinit var handler: Channel
}

@TauriPlugin
class SensorKitPlugin(
    private val activity: Activity,
) : Plugin(activity) {
    private val registry =
        SensorRegistry(
            sensors =
                listOf(
                    AccelerometerService(activity),
                    LinearAccelerationService(activity),
                    GyroscopeService(activity),
                    BarometerService(activity),
                    MagnetometerService(activity),
                    LocationService(activity),
                    LightSensorService(activity),
                ),
        )

    @Command
    fun setEventHandler(invoke: Invoke) {
        val args = invoke.parseArgs(SetEventHandlerArgs::class.java)
        this.registry.setChannel(args.handler)
        invoke.resolve()
    }

    @Command
    fun getAvailableSensors(invoke: Invoke) {
        Log.d("SensorKit", "getAvailableSensors called")

        val ret = JSObject()
        registry.availableSensors().forEach { (name, available) ->
            ret.put(name, available)
        }
        invoke.resolve(ret)
    }

    @Command
    fun startSensors(invoke: Invoke) {
        Log.d("SensorKit", "startSensors called")

        val args = invoke.parseArgs(StartSensorsArgs::class.java)

        args.forEach { (sensorName, fps) ->
            val samplingUs = fpsToSamplingUs(fps)
            registry.start(listOf(sensorName), samplingUs)
        }
        invoke.resolve()
    }

    @Command
    fun stopSensors(invoke: Invoke) {
        Log.d("SensorKit", "stopSensors called")

        registry.stopAll()
        invoke.resolve()
    }

    private fun fpsToSamplingUs(fps: Int): Int {
        if (fps <= 0) return SensorManager.SENSOR_DELAY_FASTEST
        return (1_000_000 / fps).coerceAtLeast(1_000)
    }
}
