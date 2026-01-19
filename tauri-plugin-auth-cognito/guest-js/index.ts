import { invoke } from '@tauri-apps/api/core';

export interface OpenAuthRequest {
  baseUrl: string;
  clientId: string;
  redirectUri: string;
  scheme: string;
  scope?: string[];
  responseType?: string;
  codeChallengeMethod?: string;
}

export async function startAuth({
  scheme,
  baseUrl,
  clientId,
  redirectUri,
  scope = ['openid'],
  responseType = 'code',
  codeChallengeMethod = 'S256',
}: OpenAuthRequest): Promise<void> {
  if (scheme.includes('://')) throw new Error('VITE_SCHEME should not include "://".');

  const { verifier, challenge } = await generatePKCE();
  localStorage.setItem('pkce_verifier', verifier);

  const url = new URL('/oauth2/authorize', baseUrl);
  url.searchParams.append('client_id', clientId);
  url.searchParams.append('response_type', responseType);
  url.searchParams.append('code_challenge_method', codeChallengeMethod);
  url.searchParams.append('scope', scope.join('+'));
  url.searchParams.append('redirect_uri', redirectUri);
  url.searchParams.append('code_challenge', challenge);

  await invoke('plugin:auth-cognito|start_auth', { url: url.toString(), scheme });
}

async function generatePKCE() {
  // 1. Verifier（検証用文字列）をランダムに生成
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  const verifier = btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  // 2. Challenge（ハッシュ化した文字列）を生成
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await window.crypto.subtle.digest('SHA-256', data);
  const challenge = btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return { verifier, challenge };
}
