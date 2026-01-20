import type { Tokens } from '@satooru65536/tauri-plugin-auth-cognito';

interface AuthStoreSuccess {
  tokens: Tokens;
  isLoading: false;
  isAuthSuccess: true;
}
interface AuthStoreLoading {
  tokens: null;
  isLoading: true;
  isAuthSuccess: false;
}
interface AuthStoreFailure {
  tokens: null;
  isLoading: false;
  isAuthSuccess: false;
}
export type AuthStore = AuthStoreSuccess | AuthStoreLoading | AuthStoreFailure;

export interface RefreshResultSuccess {
  success: true;
  newTokens: Tokens;
}
export interface RefreshResultFailure {
  success: false;
}
export type RefreshResult = RefreshResultSuccess | RefreshResultFailure;
