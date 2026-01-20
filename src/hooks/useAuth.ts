import { tokenManager } from '@/lib/tokenManager';
import { AuthCognito, type Tokens } from '@satooru65536/tauri-plugin-auth-cognito';
import { useStore } from '@tanstack/react-store';
import { Store } from '@tanstack/store';

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

const authStore = new Store<AuthStore>({ tokens: null, isLoading: false, isAuthSuccess: false });
const setJwt = (auth: AuthStore) => {
  authStore.setState(auth);
};

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
          setJwt({ tokens, isLoading: false, isAuthSuccess: true });
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
    setJwt({ tokens: null, isLoading: false, isAuthSuccess: false });
    await tokenManager.clearTokens();
  };

  const refreshToken = async (): Promise<boolean> => {
    if (!auth.tokens?.refresh_token) {
      return false;
    }

    try {
      const newTokens = await authCognito.refreshToken(auth.tokens.refresh_token);
      if (newTokens) {
        setJwt({ tokens: newTokens, isLoading: false, isAuthSuccess: true });
        await tokenManager.saveTokens(newTokens);
        return true;
      }
      return false;
    } catch (error) {
      console.error('トークンリフレッシュエラー:', error);
      return false;
    }
  };

  return { auth, login, logout, refreshToken };
};
export type AuthResult = ReturnType<typeof useAuth>;

export async function loadTokens() {
  const storedTokens = await tokenManager.getTokens();
  if (storedTokens) {
    setJwt({ tokens: storedTokens, isLoading: false, isAuthSuccess: true });
  }
}
