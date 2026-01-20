import AlertDialog from '@/components/AlertDialog';
import { isTokenExpiringSoon } from '@/utils/jwt';
import { useNavigate } from '@tanstack/react-router';
import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './useAuth';

export function useJwtToken() {
  const { t } = useTranslation();
  const { auth, refreshToken } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const refreshingRef = useRef(false);

  const getToken = async (openAlert?: boolean): Promise<string | undefined> => {
    if (!auth.isAuthSuccess || !auth.tokens) {
      if (openAlert) setOpen(true);
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
      if (openAlert) setOpen(true);
      return undefined;
    } catch (error) {
      console.error('トークンリフレッシュエラー:', error);
      if (openAlert) setOpen(true);
      return undefined;
    } finally {
      refreshingRef.current = false;
    }
  };

  const onConfirm = () => {
    // TODO: ログイン画面へ遷移
    setOpen(false);
    void navigate({ to: '/settings' });
  };

  const onCancel = () => {
    setOpen(false);
  };

  const onOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const title = auth.isAuthSuccess ? t('hooks.useJwtToken.notLoggedIn.title') : t('hooks.useJwtToken.authError.title');
  const message = auth.isAuthSuccess
    ? t('hooks.useJwtToken.notLoggedIn.message')
    : t('hooks.useJwtToken.authError.message');
  const confirmText = auth.isAuthSuccess
    ? t('hooks.useJwtToken.notLoggedIn.confirmText')
    : t('hooks.useJwtToken.authError.confirmText');
  const cancelText = auth.isAuthSuccess
    ? t('hooks.useJwtToken.notLoggedIn.cancelText')
    : t('hooks.useJwtToken.authError.cancelText');

  const alertDialog = (
    <AlertDialog
      title={title}
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmText={confirmText}
      cancelText={cancelText}
      onOpenChange={onOpenChange}
      open={open}
    >
      <p>{message}</p>
    </AlertDialog>
  );

  return [getToken, alertDialog] as const;
}
