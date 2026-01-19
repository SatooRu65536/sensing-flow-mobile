import AuthenticationServices
import SwiftRs
import Tauri
import UIKit
import WebKit

class AuthCognitoPlugin: Plugin {
  var authSession: ASWebAuthenticationSession?

  @objc
  public func openAuth(_ invoke: Invoke) {
    guard let urlString = invoke.getString("url"), !urlString.isEmpty else {
      invoke.reject("Error: 'url' parameter is required and cannot be empty.")
      return
    }
    guard let scheme = invoke.getString("scheme"), !scheme.isEmpty else {
      invoke.reject("Error: 'scheme' parameter is required. It must match your app's URL scheme.")
      return
    }

    guard let url = URL(string: urlString) else {
      invoke.reject("Invalid URL")
      return
    }

    self.authSession = ASWebAuthenticationSession(
      url: url,
      callbackURLScheme: scheme
    ) { callbackURL, error in
      if let error = error {
        invoke.reject(error.localizedDescription)
        return
      }

      if callbackURL != nil {
        // Resolve without a payload so the Rust side can deserialize to `()`
        invoke.resolve()
      }
    }

    self.authSession?.presentationContextProvider = self

    self.authSession?.start()
  }
}

extension AuthPlugin: ASWebAuthenticationPresentationContextProviding {
  func presentationAnchor(for session: ASWebAuthenticationSession) -> ASPresentationAnchor {
    return UIApplication.shared.windows.first { $0.isKeyWindow } ?? ASPresentationAnchor()
  }
}

@_cdecl("init_plugin_auth_cognito")
func initPlugin() -> Plugin {
  return AuthCognitoPlugin()
}
