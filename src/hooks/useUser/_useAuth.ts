import { tokenManager } from '@/lib/tokenManager';
import { AuthCognito } from '@satooru65536/tauri-plugin-auth-cognito';
import { useStore } from '@tanstack/react-store';
import { authStore, resetAuthStore, setTokens } from './stores/auth';
import type { RefreshResultSuccess, RefreshResultFailure, RefreshResult } from './types/auth';

const authCognito = new AuthCognito({
  scheme: import.meta.env.VITE_SCHEME,
  baseUrl: import.meta.env.VITE_COGNITO_DOMAIN,
  clientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
  redirectUri: import.meta.env.VITE_REDIRECT_URI,
});

export const useAuth = () => {
  const auth = useStore(authStore);

  const login = async () => {
    try {
      const unlisten = await authCognito.watchRedirect(
        (tokens) => {
          setTokens(tokens);
          unlisten();
          void tokenManager.saveTokens(tokens);
        },
        (error) => {
          console.error('ログインエラー:', error);
        },
      );

      await authCognito.startAuth();
    } catch (error) {
      console.error('ログインエラー:', error);
    }
  };

  const logout = async () => {
    resetAuthStore();
    await tokenManager.clearTokens();
  };

  const refresh = async (): Promise<RefreshResult> => {
    if (!auth.tokens?.refresh_token) {
      return { success: false } satisfies RefreshResultFailure;
    }

    try {
      const newTokens = await authCognito.refreshToken(auth.tokens.refresh_token);
      if (newTokens) {
        setTokens(newTokens);
        await tokenManager.saveTokens(newTokens);
        return { success: true, newTokens } satisfies RefreshResultSuccess;
      }
      return { success: false } satisfies RefreshResultFailure;
    } catch (error) {
      console.error('トークンリフレッシュエラー:', error);
      return { success: false } satisfies RefreshResultFailure;
    }
  };

  return { auth, login, logout, refresh };
};
