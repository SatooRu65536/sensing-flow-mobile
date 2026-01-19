use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct OpenAuthRequest {
    pub url: String,
    pub scheme: String,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ExchangeTokenRequest {
    pub code: String,
    pub verifier: String,
    pub client_id: String,
    pub redirect_uri: String,
    pub base_url: String,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TokenResponse {
    pub id_token: String,
    pub access_token: String,
    pub refresh_token: Option<String>,
}

#[derive(Serialize)]
pub struct TokenRequest<'a> {
    pub grant_type: &'static str,
    pub client_id: &'a str,
    pub code: &'a str,
    pub code_verifier: &'a str,
    pub redirect_uri: &'a str,
}
