package dev.satooru.tauripluginsensorkit.sensor

class SensorRegistry(
    private val sensors: List<SensorService>,
) {
    fun start(
        names: List<String>,
        samplingUs: Int,
    ) {
        sensors
            .filter { it.name in names && it.isAvailable() }
            .forEach { it.start(samplingUs) }
    }

    fun stopAll() = sensors.forEach { it.stop() }

    fun availableSensors(): Map<String, Boolean> = sensors.associate { it.name to it.isAvailable() }
}
