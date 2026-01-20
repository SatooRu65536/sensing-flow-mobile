export interface AuthConfig {
  baseUrl: string;
  clientId: string;
  redirectUri: string;
  scheme: string;
  scope?: string[];
  responseType?: string;
  codeChallengeMethod?: string;
}

export interface AuthConfigAllRequired {
  baseUrl: string;
  clientId: string;
  redirectUri: string;
  scheme: string;
  scope: string[];
  responseType: string;
  codeChallengeMethod: string;
}

export interface ExchangeCodeForTokenPayload {
  code: string;
  verifier: string;
  clientId: string;
  redirectUri: string;
  baseUrl: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
  clientId: string;
  baseUrl: string;
}

export interface Tokens {
  id_token: string;
  access_token: string;
  refresh_token?: string;
}
