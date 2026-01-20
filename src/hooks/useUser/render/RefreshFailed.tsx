import AlertDialog from '@/components/AlertDialog';
import type { AlertProps } from '.';
import { useTranslation } from 'react-i18next';

export function RefreshFailedAlert({ redirectToLogin, closeAlert }: AlertProps) {
  const { t } = useTranslation();

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
