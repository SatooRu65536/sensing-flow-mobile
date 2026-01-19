import { invoke } from '@tauri-apps/api/core';

export interface OpenAuthRequest {
  url: string;
  scheme: string;
}

export async function openAuth(payload: OpenAuthRequest): Promise<void> {
  await invoke('plugin:auth-cognito|open_auth', { payload });
}
