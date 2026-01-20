import AlertDialog from '@/components/AlertDialog';
import type { AlertProps } from '.';
import { useTranslation } from 'react-i18next';

export function AuthErrorAlert({ redirectToLogin, closeAlert }: AlertProps) {
  const { t } = useTranslation();

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
