import { AuthCognito } from '@satooru65536/tauri-plugin-auth-cognito';

const auth = new AuthCognito({
  scheme: import.meta.env.VITE_SCHEME,
  baseUrl: import.meta.env.VITE_COGNITO_DOMAIN,
  clientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
  redirectUri: import.meta.env.VITE_REDIRECT_URI,
});

export const useAuth = () => {
  const login = async () => {
    try {
      const unlisten = await auth.watchRedirect(
        (tokens) => {
          localStorage.setItem('auth_tokens', JSON.stringify(tokens));
          unlisten();
        },
        (error) => {
          console.error('ログインエラー:', error);
        },
      );

      await auth.startAuth();
    } catch (error) {
      console.error('ログインエラー:', error);
    }
  };

  return { login };
};
export type AuthResult = ReturnType<typeof useAuth>;
