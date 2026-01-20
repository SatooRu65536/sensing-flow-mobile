import AlertDialog from '@/components/AlertDialog';
import type { AlertProps } from '.';
import { useTranslation } from 'react-i18next';

export function NotLoggedInAlert({ redirectToLogin, closeAlert }: AlertProps) {
  const { t } = useTranslation();

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
