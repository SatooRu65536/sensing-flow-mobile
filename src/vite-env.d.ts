/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_SCHEME: string;
  readonly VITE_COGNITO_CLIENT_ID: string;
  readonly VITE_REDIRECT_URI: string;
  readonly VITE_COGNITO_DOMAIN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
