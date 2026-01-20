import { invoke } from '@tauri-apps/api/core';
import { listen, type UnlistenFn } from '@tauri-apps/api/event';
import { AuthConfig, AuthConfigAllRequired, ExchangeCodeForTokenPayload, RefreshTokenPayload, Tokens } from './types';

export * from './types';

export class AuthCognito {
  private config: AuthConfigAllRequired;
  private pkceStorageKey = 'pkce_verifier';
  private tokens: Tokens | null = null;

  constructor(
    {
      scheme,
      baseUrl,
      clientId,
      redirectUri,
      scope = ['openid'],
      responseType = 'code',
      codeChallengeMethod = 'S256',
    }: AuthConfig,
    pkceStorageKey?: string,
  ) {
    if (scheme.includes('://')) throw new Error('VITE_SCHEME should not include "://".');
    if (!redirectUri.includes('://')) throw new Error('redirectUri should include "://".');

    this.config = { scheme, baseUrl, clientId, redirectUri, scope, responseType, codeChallengeMethod };
    if (pkceStorageKey) this.pkceStorageKey = pkceStorageKey;
  }

  async startAuth(): Promise<void> {
    const { verifier, challenge } = await this.generatePKCE();
    localStorage.setItem(this.pkceStorageKey, verifier);

    const url = new URL('/oauth2/authorize', this.config.baseUrl);
    url.searchParams.append('client_id', this.config.clientId);
    url.searchParams.append('response_type', this.config.responseType);
    url.searchParams.append('code_challenge_method', this.config.codeChallengeMethod);
    url.searchParams.append('scope', this.config.scope.join(' '));
    url.searchParams.append('redirect_uri', this.config.redirectUri);
    url.searchParams.append('code_challenge', challenge);

    const payload = { url: url.toString(), scheme: this.config.scheme };
    await invoke('plugin:auth-cognito|start_auth', { payload });
  }

  async watchRedirect(onUpdate: (tokens: Tokens) => void, onError: (error: Error) => void): Promise<UnlistenFn> {
    return await listen<string>('auth-callback', (event) => {
      const urlStr = event.payload;
      const url = new URL(urlStr.replace(this.config.redirectUri, 'http://localhost/')); // URL のパースのため一時的に置換
      const code = url.searchParams.get('code');

      const verifier = localStorage.getItem(this.pkceStorageKey);
      if (!verifier) {
        onError(new Error('PKCE verifier not found in localStorage'));
        return;
      }

      if (!code) {
        onError(new Error('Authorization code not found in callback URL'));
        return;
      }

      const payload: ExchangeCodeForTokenPayload = {
        code,
        verifier,
        clientId: this.config.clientId,
        redirectUri: this.config.redirectUri,
        baseUrl: this.config.baseUrl,
      };

      void invoke<Tokens>('plugin:auth-cognito|exchange_code_for_token', { payload })
        .then((tokens) => {
          this.tokens = tokens;
          onUpdate(tokens);
        })
        .catch(onError);
    });
  }

  async refreshToken(refreshToken?: string): Promise<Tokens> {
    const refreshTokenValue = refreshToken ?? this.tokens?.refresh_token;
    if (!refreshTokenValue) throw new Error('No refresh token available');

    const payload: RefreshTokenPayload = {
      refreshToken: refreshTokenValue,
      clientId: this.config.clientId,
      baseUrl: this.config.baseUrl,
    };

    return await invoke<Tokens>('plugin:auth-cognito|refresh_token', { payload });
  }

  private async generatePKCE() {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    const verifier = btoa(String.fromCharCode(...array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await window.crypto.subtle.digest('SHA-256', data);
    const challenge = btoa(String.fromCharCode(...new Uint8Array(hash)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    return { verifier, challenge };
  }
}
