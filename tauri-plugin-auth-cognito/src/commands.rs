use crate::AuthCognitoExt;
use crate::{OpenAuthRequest, Result};
use tauri::{command, AppHandle, Runtime};

#[command]
pub(crate) async fn open_auth<R: Runtime>(
    app: AppHandle<R>,
    payload: OpenAuthRequest,
) -> Result<()> {
    app.auth_cognito().open_auth(payload)
}
