import styles from './index.module.scss';
import AlertDialog from '@/components/AlertDialog';
import { IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { deleteGroup } from '@satooru65536/tauri-plugin-sensorkit';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_GROUPED_SENSOR_DATA, GET_GROUPS } from '@/consts/query-key';

interface DeleteGroupDialogProps {
  groupId: number;
  groupName: string;
}

export default function DeleteGroupDialog({ groupId, groupName }: DeleteGroupDialogProps) {
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async () => {
      try {
        await deleteGroup(groupId);
      } catch (e) {
        console.error(e);
        throw new Error(t('components.DeleteGroupDialog.error.failedToDeleteGroup'));
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [GET_GROUPED_SENSOR_DATA] });
      await queryClient.invalidateQueries({ queryKey: [GET_GROUPS] });
    },
  });

  return (
    <AlertDialog
      trigger={<IconTrash className={styles.icon} />}
      title={t('components.DeleteGroupDialog.title')}
      cancelText={t('components.DeleteGroupDialog.cancel')}
      confirmText={t('components.DeleteGroupDialog.confirm')}
      onConfirm={mutateAsync}
      isLoading={isPending}
      danger
    >
      <p>{t('components.DeleteGroupDialog.message', { groupName: groupName })}</p>
      {error && <p className={styles.error}>{error.message}</p>}
    </AlertDialog>
  );
}
