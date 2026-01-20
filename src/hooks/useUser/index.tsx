import { useAuth } from './_useAuth';
import { useProfile } from './_useProfile';
import { AuthErrorAlert, NotLoggedInAlert, NotRegisteredAlert, RefreshFailedAlert } from './render';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { isTokenExpiringSoon } from '@/utils/jwt';

type AlertType = 'authError' | 'notLoggedIn' | 'refreshFailed' | 'notRegistered';
type GetTokenFunc = () => Promise<string | undefined>;

interface UseRegisteredUserProps {
  requireRegisteredUser?: boolean; // ユーザ登録済みであることを要求する
}

export function useUser(props?: UseRegisteredUserProps) {
  const requireRegisteredUser = props?.requireRegisteredUser ?? true;

  const navigate = useNavigate();
  const [alert, setAlert] = useState<AlertType | null>(null);

  const { auth, login, logout, refresh } = useAuth();
  const userProfile = useProfile({ auth });

  const getToken: GetTokenFunc = async () => {
    // 認証前
    if (!auth.isAuthSuccess) {
      setAlert('notLoggedIn');
      return undefined;
    }

    // ユーザ登録前
    if (requireRegisteredUser && !userProfile.isSuccess) {
      setAlert('notRegistered');
      return undefined;
    }

    const token = auth.tokens.access_token;
    // トークン有効期限切れ間近
    if (isTokenExpiringSoon(token)) {
      const res = await refresh();

      // リフレッシュ失敗
      if (!res.success) {
        setAlert('refreshFailed');
        return undefined;
      }

      return res.newTokens.access_token;
    }

    return token;
  };

  const redirectToLogin = (shouldLogout: boolean = false) => {
    if (shouldLogout) void logout();
    setAlert(null);
    void navigate({ to: '/settings' });
  };

  const onCancel = () => {
    setAlert(null);
  };

  const alertDialog =
    alert === 'authError' ? (
      <AuthErrorAlert redirectToLogin={redirectToLogin} closeAlert={onCancel} />
    ) : alert === 'notRegistered' ? (
      <NotRegisteredAlert redirectToLogin={redirectToLogin} closeAlert={onCancel} />
    ) : alert === 'notLoggedIn' ? (
      <NotLoggedInAlert redirectToLogin={redirectToLogin} closeAlert={onCancel} />
    ) : alert === 'refreshFailed' ? (
      <RefreshFailedAlert redirectToLogin={redirectToLogin} closeAlert={onCancel} />
    ) : null;

  const isSignedIn = auth.isAuthSuccess;
  return { getToken, login, logout, isSignedIn, alertDialog, userProfile } as const;
}

export type UserResult = ReturnType<typeof useUser>;
export type LoginFunction = UserResult['login'];
export type LogoutFunction = UserResult['logout'];
export type UserProfile = NonNullable<ReturnType<typeof useUser>['userProfile']['data']>;
