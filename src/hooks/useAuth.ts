import { AuthCognito } from '@satooru65536/tauri-plugin-auth-cognito';
import { useStore } from '@tanstack/react-store';
import { Store } from '@tanstack/store';

interface AuthStoreSuccess {
  jwt: string;
  isLoading: false;
  isAuthSuccess: true;
}
interface AuthStoreLoading {
  jwt: null;
  isLoading: true;
  isAuthSuccess: false;
}
interface AuthStoreFailure {
  jwt: null;
  isLoading: false;
  isAuthSuccess: false;
}
export type AuthStore = AuthStoreSuccess | AuthStoreLoading | AuthStoreFailure;

const authStore = new Store<AuthStore>({ jwt: null, isLoading: false, isAuthSuccess: false });
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
          localStorage.setItem('auth_tokens', tokens.access_token);
          setJwt({ jwt: tokens.access_token, isLoading: false, isAuthSuccess: true });
          unlisten();
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

  return { auth, login };
};
export type AuthResult = ReturnType<typeof useAuth>;
