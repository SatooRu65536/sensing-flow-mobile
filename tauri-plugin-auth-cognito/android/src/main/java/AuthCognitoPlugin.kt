package dev.satooru.tauripluginauthcognito

import android.app.Activity
import android.net.Uri
import androidx.browser.customtabs.CustomTabsIntent
import app.tauri.annotation.Command
import app.tauri.annotation.InvokeArg
import app.tauri.annotation.TauriPlugin
import app.tauri.plugin.Invoke
import app.tauri.plugin.JSObject
import app.tauri.plugin.Plugin

@InvokeArg
class OpenAuthArgs {
    var url: String? = null
    var scheme: String? = null
}

@TauriPlugin
class AuthCognitoPlugin(
    private val activity: Activity,
) : Plugin(activity) {
    @Command
    fun openAuth(invoke: Invoke) {
        val args = invoke.parseArgs(OpenAuthArgs::class.java)
        val url = args.url
        val scheme = args.scheme

        if (url.isNullOrEmpty()) {
            invoke.reject("Error: 'url' parameter is required.")
            return
        }
        if (scheme.isNullOrEmpty()) {
            invoke.reject("Error: 'scheme' parameter is required.")
            return
        }

        try {
            val builder = CustomTabsIntent.Builder()
            builder.setShowTitle(true)
            builder.setShareState(CustomTabsIntent.SHARE_STATE_OFF)

            val customTabsIntent = builder.build()

            customTabsIntent.launchUrl(activity, Uri.parse(url))

            // Resolve without a payload so the Rust side can deserialize to `()`
            invoke.resolve()
        } catch (e: Exception) {
            invoke.reject("Failed to open Custom Tab: ${e.localizedMessage}")
        }
    }
}
