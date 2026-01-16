package dev.satooru.tauripluginsensorkit.sensor

import android.Manifest
import android.app.Activity
import android.content.pm.PackageManager
import android.location.LocationListener
import android.location.LocationManager
import androidx.annotation.RequiresPermission
import androidx.core.app.ActivityCompat
import app.tauri.plugin.JSObject

class LocationService(
    val activity: Activity
) : BaseSensorService() {
    override val name = "location"
    
    private val locationManager by lazy {
        activity.getSystemService(Activity.LOCATION_SERVICE) as LocationManager
    }

    override fun isAvailable(): Boolean = 
        locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)

    @RequiresPermission(anyOf = [Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION])
    override fun registerListener(samplingUs: Int) {
        if (ActivityCompat.checkSelfPermission(
                activity, Manifest.permission.ACCESS_FINE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            // 権限がない場合は何もしない（あるいはエラーを投げる）
            return
        }

        val minTimeMs = (samplingUs / 1000).toLong()
        locationManager.requestLocationUpdates(
            LocationManager.GPS_PROVIDER,
            minTimeMs,
            0f,
            locationListener
        )
    }

    @RequiresPermission(anyOf = [Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION])
    override fun unregisterListener() {
        locationManager.removeUpdates(locationListener)
    }

    private val locationListener = LocationListener { location ->
        // システム時刻との同期が必要な場合は、location.elapsedRealtimeNanos を使用
        val relativeTimestamp = (android.os.SystemClock.elapsedRealtimeNanos() - startTimeNanos) / 1_000_000
        
        val payload = JSObject().apply {
            put("sensor", name)
            put("timestamp", relativeTimestamp)
            put("latitude", location.latitude)
            put("longitude", location.longitude)
            put("csv_raw", "$relativeTimestamp,${location.latitude},${location.longitude}")
            put("csv_header", "timestamp(ms),latitude,longitude")
        }
        channel?.send(payload)
    }
}
