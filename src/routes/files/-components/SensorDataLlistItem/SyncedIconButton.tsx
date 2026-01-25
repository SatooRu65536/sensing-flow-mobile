import styles from './index.module.scss';
import { IconCloudOff, IconCloudUp } from '@tabler/icons-react';
import { unsyncSensorData, type SensorData, type SensorDataSyncState } from '@satooru65536/tauri-plugin-sensorkit';
import { type GetTokenFunction } from '@/hooks/useUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DELETE_SENSOR_DATA, GET_SYNC_STATE } from '@/consts/query-key';
import { client } from '@/api';
import { authHeader } from '@/utils/auth-header';

interface SyncIconButtonProps {
  data: SensorData;
  syncState: SensorDataSyncState;
  getToken: GetTokenFunction;
}

export default function SyncedIconButton({ data, syncState, getToken, ...props }: SyncIconButtonProps) {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteSensorData, isPending } = useMutation({
    mutationKey: [DELETE_SENSOR_DATA, data.id],
    mutationFn: async (uploadId: string) => {
      const token = await getToken();
      if (!token) throw new Error('No token available');

      const res = await client.DELETE('/sensor-data/{id}', {
        params: { path: { id: uploadId } },
        headers: authHeader(token),
      });

      if (res.response.status === 404) return null; // 既に削除されている場合も成功とみなす
      if (!res.response.ok) throw new Error('Failed to delete sensor data on server');

      return null;
    },
    onSuccess: async () => {
      await unsyncSensorData(data.id);
      await queryClient.invalidateQueries({ queryKey: [GET_SYNC_STATE, data.id] });
    },
    onError: async () => {
      await queryClient.invalidateQueries({ queryKey: [GET_SYNC_STATE, data.id] });
    },
  });

  const unsync = async (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.preventDefault();
    await deleteSensorData(syncState.uploadId);
  };

  return isPending ? (
    <IconCloudOff className={styles.icon_button} {...props} data-loading />
  ) : (
    <IconCloudUp className={styles.icon_button} onClick={(e) => void unsync(e)} {...props} />
  );
}
