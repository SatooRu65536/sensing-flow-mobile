import type { Tokens } from '@satooru65536/tauri-plugin-auth-cognito';
import { Store } from '@tanstack/store';
import type { AuthStore } from '../types/auth';

const initValue: AuthStore = { tokens: null, isLoading: false, isAuthSuccess: false };
export const authStore = new Store<AuthStore>(initValue);

export const setTokens = (tokens: Tokens) => {
  authStore.setState({ tokens, isLoading: false, isAuthSuccess: true });
};

export const resetAuthStore = () => {
  authStore.setState(initValue);
};
