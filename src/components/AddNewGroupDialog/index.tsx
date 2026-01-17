import styles from './index.module.scss';
import AlertDialog from '@/components/AlertDialog';
import { IconPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import Input from '@/components/Input';
import { createGroup } from '@satooru65536/tauri-plugin-sensorkit';
import { useState, type ChangeEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function AddNewGroupDialog() {
  const { t } = useTranslation();
  const [groupName, setGroupName] = useState('');

  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async () => {
      if (groupName.trim() === '') throw new Error(t('components.AddNewGroupDialog.error.emptyGroupName'));
      try {
        await createGroup({ name: groupName.trim() });
      } catch (e) {
        console.error(e);
        throw new Error(t('components.AddNewGroupDialog.error.failedToCreateGroup'));
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['getGroups', 'getGroupedSensorData'] });
    },
  });

  const changeGroupName = (e: ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value);
  };

  return (
    <AlertDialog
      trigger={<IconPlus className={styles.icon} />}
      title={t('components.AddNewGroupDialog.title')}
      cancelText={t('components.AddNewGroupDialog.cancel')}
      confirmText={t('components.AddNewGroupDialog.confirm')}
      onConfirm={mutateAsync}
      isLoading={isPending}
    >
      <Input placeholder={t('components.AddNewGroupDialog.groupName')} value={groupName} onChange={changeGroupName} />
      {error && <p className={styles.error}>{error.message}</p>}
    </AlertDialog>
  );
}
