import AlertDialog from '@/components/AlertDialog';
import { isTokenExpiringSoon } from '@/utils/jwt';
import { useNavigate } from '@tanstack/react-router';
import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './useAuth';
import type { TFunction } from 'i18next';

type AlertType = 'authError' | 'notLoggedIn' | 'refreshFailed';

export function useJwtToken() {
  const { t } = useTranslation();
  const { auth, refreshToken } = useAuth();
  const navigate = useNavigate();
  const refreshingRef = useRef(false);
  const [alert, setAlert] = useState<AlertType | null>(null);

  const getToken = async (openAlert?: boolean): Promise<string | undefined> => {
    if (!auth.isAuthSuccess || !auth.tokens) {
      if (openAlert) setAlert('notLoggedIn');
      return undefined;
    }

    const token = auth.tokens.access_token;

    if (!isTokenExpiringSoon(token)) return token;
    if (refreshingRef.current) return token;

    // トークンの有効期限が5分以内の場合
    refreshingRef.current = true;
    try {
      const success = await refreshToken();
      if (success && auth.isAuthSuccess && auth.tokens) return auth.tokens.access_token;
      // TODO: リフレッシュ失敗時の処理
      if (openAlert) setAlert('refreshFailed');
      return undefined;
    } catch (error) {
      console.error('トークンリフレッシュエラー:', error);
      if (openAlert) setAlert('refreshFailed');
      return undefined;
    } finally {
      refreshingRef.current = false;
    }
  };

  const redirectToLogin = () => {
    // TODO: ログイン画面へ遷移
    setAlert(null);
    void navigate({ to: '/settings' });
  };

  const onCancel = () => {
    setAlert(null);
  };

  const alertDialog =
    alert === 'authError' ? (
      <AuthErrorAlert t={t} redirectToLogin={redirectToLogin} closeAlert={onCancel} />
    ) : alert === 'notLoggedIn' ? (
      <NotLoggedInAlert t={t} redirectToLogin={redirectToLogin} closeAlert={onCancel} />
    ) : alert === 'refreshFailed' ? (
      <RefreshFailedAlert t={t} redirectToLogin={redirectToLogin} closeAlert={onCancel} />
    ) : null;

  return [getToken, alertDialog] as const;
}

interface AlertProps {
  t: TFunction;
  redirectToLogin: () => void;
  closeAlert: () => void;
}

function AuthErrorAlert({ t, redirectToLogin, closeAlert }: AlertProps) {
  return (
    <AlertDialog
      title={t('hooks.useJwtToken.notLoggedIn.title')}
      onConfirm={redirectToLogin}
      onCancel={closeAlert}
      confirmText={t('hooks.useJwtToken.notLoggedIn.confirmText')}
      cancelText={t('hooks.useJwtToken.notLoggedIn.cancelText')}
      open
    >
      <p>{t('hooks.useJwtToken.notLoggedIn.message')}</p>
    </AlertDialog>
  );
}

function NotLoggedInAlert({ t, redirectToLogin, closeAlert }: AlertProps) {
  return (
    <AlertDialog
      title={t('hooks.useJwtToken.authError.title')}
      onConfirm={redirectToLogin}
      onCancel={closeAlert}
      confirmText={t('hooks.useJwtToken.authError.confirmText')}
      cancelText={t('hooks.useJwtToken.authError.cancelText')}
      open
    >
      <p>{t('hooks.useJwtToken.authError.message')}</p>
    </AlertDialog>
  );
}

function RefreshFailedAlert({ t, redirectToLogin, closeAlert }: AlertProps) {
  return (
    <AlertDialog
      title={t('hooks.useJwtToken.refreshFailed.title')}
      onConfirm={redirectToLogin}
      onCancel={closeAlert}
      confirmText={t('hooks.useJwtToken.refreshFailed.confirmText')}
      cancelText={t('hooks.useJwtToken.refreshFailed.cancelText')}
      open
    >
      <p>{t('hooks.useJwtToken.refreshFailed.message')}</p>
    </AlertDialog>
  );
}
