use crate::{AuthCognitoExt, ExchangeTokenRequest, TokenRequest, TokenResponse};
use crate::{OpenAuthRequest, Result};
use tauri::{command, AppHandle, Runtime};

#[command]
pub(crate) async fn start_auth<R: Runtime>(
    app: AppHandle<R>,
    payload: OpenAuthRequest,
) -> Result<()> {
    app.auth_cognito().start_auth(payload)
}

#[command]
pub async fn exchange_code_for_token<R: Runtime>(
    _app: AppHandle<R>,
    payload: ExchangeTokenRequest,
) -> Result<TokenResponse> {
    let client = reqwest::Client::new();
    let url = format!("https://{}/oauth2/token", payload.domain);

    let form_data = TokenRequest {
        grant_type: "authorization_code",
        client_id: &payload.client_id,
        code: &payload.code,
        code_verifier: &payload.verifier,
        redirect_uri: &payload.redirect_uri,
    };

    let res = client
        .post(url)
        .header("Content-Type", "application/x-www-form-urlencoded")
        .form(&form_data)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if res.status().is_success() {
        res.json::<TokenResponse>().await.map_err(|e| e.to_string())
    } else {
        Err(format!(
            "Exchange failed: {}",
            res.text().await.unwrap_or_default()
        ))
    }
}
