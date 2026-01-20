import AlertDialog from '@/components/AlertDialog';
import type { AlertProps } from '.';
import { useTranslation } from 'react-i18next';

// TODO: NotRegisteredAlertの内容を適切に修正する
export function NotRegisteredAlert({ redirectToLogin, closeAlert }: AlertProps) {
  const { t } = useTranslation();

  return (
    <AlertDialog
      title={t('hooks.useJwtToken.notRegistered.title')}
      onConfirm={redirectToLogin}
      onCancel={closeAlert}
      confirmText={t('hooks.useJwtToken.notRegistered.confirmText')}
      cancelText={t('hooks.useJwtToken.notRegistered.cancelText')}
      open
    >
      <p>{t('hooks.useJwtToken.notRegistered.message')}</p>
    </AlertDialog>
  );
}
