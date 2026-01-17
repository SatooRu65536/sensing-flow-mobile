import styles from './index.module.scss';
import AlertDialog from '@/components/AlertDialog';
import { IconPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import Input from '@/components/Input';
import { createGroup } from '@satooru65536/tauri-plugin-sensorkit';
import { useState, type ChangeEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_GROUPED_SENSOR_DATA, GET_GROUPS } from '@/consts/query-key';

export default function AddNewGroupDialog() {
  const { t } = useTranslation();
  const [groupName, setGroupName] = useState('');

  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async () => {
      if (groupName.trim() === '') throw new Error(t('pages.files.components.AddNewGroupDialog.error.emptyGroupName'));
      try {
        await createGroup({ name: groupName.trim() });
      } catch (e) {
        console.error(e);
        throw new Error(t('pages.files.components.AddNewGroupDialog.error.failedToCreateGroup'));
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [GET_GROUPED_SENSOR_DATA] });
      await queryClient.invalidateQueries({ queryKey: [GET_GROUPS] });
    },
  });

  const changeGroupName = (e: ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value);
  };

  return (
    <AlertDialog
      trigger={
        <div className={styles.tigger}>
          <IconPlus className={styles.icon} />
        </div>
      }
      title={t('pages.files.components.AddNewGroupDialog.title')}
      cancelText={t('pages.files.components.AddNewGroupDialog.cancel')}
      confirmText={t('pages.files.components.AddNewGroupDialog.confirm')}
      onConfirm={mutateAsync}
      isLoading={isPending}
    >
      <Input
        placeholder={t('pages.files.components.AddNewGroupDialog.groupName')}
        value={groupName}
        onChange={changeGroupName}
      />
      {error && <p className={styles.error}>{error.message}</p>}
    </AlertDialog>
  );
}
