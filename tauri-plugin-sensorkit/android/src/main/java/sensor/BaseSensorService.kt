package dev.satooru.tauripluginsensorkit.sensor

import app.tauri.plugin.Channel

interface SensorService {
    val name: String
    var channel: Channel?

    fun isAvailable(): Boolean

    fun start(samplingUs: Int)

    fun stop()
}

abstract class BaseSensorService : SensorService {
    override var channel: Channel? = null
    private var listening = false
    protected var startTimeNanos: Long = 0

    override fun start(samplingUs: Int) {
        if (!isAvailable() || listening) return

        startTimeNanos = android.os.SystemClock.elapsedRealtimeNanos()
        registerListener(samplingUs)
        listening = true
    }

    override fun stop() {
        if (!listening) return
        unregisterListener()
        listening = false
    }

    // 各サービスで実装：リスナーの登録
    protected abstract fun registerListener(samplingUs: Int)

    // 各サービスで実装：リスナーの解除
    protected abstract fun unregisterListener()
}
