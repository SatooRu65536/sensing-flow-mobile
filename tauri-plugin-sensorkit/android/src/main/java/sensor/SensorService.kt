package dev.satooru.tauripluginsensorkit.sensor

interface SensorService {
    val name: String

    fun isAvailable(): Boolean

    fun start(samplingUs: Int)

    fun stop()
}
