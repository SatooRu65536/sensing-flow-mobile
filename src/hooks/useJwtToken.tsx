import AlertDialog from '@/components/AlertDialog';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './useAuth';

export function useJwtToken() {
  const { t } = useTranslation();
  const { auth } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const getToken = (openAlert?: boolean): string | undefined => {
    if (auth.isAuthSuccess) return auth.tokens.access_token;

    if (openAlert) setOpen(true);
    return undefined;
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
