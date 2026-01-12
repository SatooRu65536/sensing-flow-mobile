package dev.satooru.tauripluginsensorkit.sensor

import app.tauri.plugin.Channel

interface SensorService {
    val name: String
    var channel: Channel?

    fun isAvailable(): Boolean

    fun start(samplingUs: Int)

    fun stop()
}
