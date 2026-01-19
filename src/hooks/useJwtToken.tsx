import AlertDialog from '@/components/AlertDialog';
import type { FileRouteTypes } from '@/routeTree.gen';
import { useNavigate, useRouteContext } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface UseJwtTokenProps {
  from: FileRouteTypes['id'];
}

export function useJwtToken({ from }: UseJwtTokenProps) {
  const { t } = useTranslation();
  const { auth } = useRouteContext({ from });
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const getToken = (): string | undefined => {
    if (auth.data?.idToken) return auth.data.idToken;

    setOpen(true);
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

  const isNotLoggedIn = auth.data === undefined;
  const title = isNotLoggedIn ? t('hooks.useJwtToken.notLoggedIn.title') : t('hooks.useJwtToken.authError.title');
  const message = isNotLoggedIn ? t('hooks.useJwtToken.notLoggedIn.message') : t('hooks.useJwtToken.authError.message');
  const confirmText = isNotLoggedIn
    ? t('hooks.useJwtToken.notLoggedIn.confirmText')
    : t('hooks.useJwtToken.authError.confirmText');
  const cancelText = isNotLoggedIn
    ? t('hooks.useJwtToken.notLoggedIn.cancelText')
    : t('hooks.useJwtToken.authError.cancelText');

  const alertDialog = (
    <AlertDialog
      title={title}
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmText={confirmText}
      cancelText={cancelText}
      open={open}
    >
      <p>{message}</p>
    </AlertDialog>
  );

  return [getToken, alertDialog] as const;
}
