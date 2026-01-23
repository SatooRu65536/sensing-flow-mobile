import styles from './index.module.scss';
import type { SyncStateData } from '.';
import { IconCloudUp } from '@tabler/icons-react';
import { type SensorData } from '@satooru65536/tauri-plugin-sensorkit';
import { type GetTokenFunction } from '@/hooks/useUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DELETE_SENSOR_DATA, GET_GROUPED_SENSOR_DATA, GET_SYNC_STATE } from '@/consts/query-key';
import { client } from '@/api';
import { authHeader } from '@/utils/auth-header';
import { useState } from 'react';

interface UnSyncIconButtonProps {
  data: SensorData;
  syncStateData: SyncStateData;
  getToken: GetTokenFunction;
}

export default function SyncedIconButton({ data, syncStateData, getToken, ...props }: UnSyncIconButtonProps) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: deleteSensorData } = useMutation({
    mutationKey: [DELETE_SENSOR_DATA, data.id],
    mutationFn: async (uploadId: string) => {
      const token = await getToken();
      if (!token) throw new Error('No token available');

      const res = await client.DELETE('/sensor-data/{id}', {
        params: { path: { id: uploadId } },
        headers: authHeader(token),
      });

      if (res.data == undefined) throw new Error('Failed to get presigned URLs');

      return res.data;
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: async () => {
      // TODO: DBから削除コマンドの呼び出し
      await queryClient.invalidateQueries({ queryKey: [GET_GROUPED_SENSOR_DATA] });
    },
    onSettled: async () => {
      setIsLoading(false);
      await queryClient.invalidateQueries({ queryKey: [GET_SYNC_STATE, data.id] });
    },
    gcTime: 1000 * 60 * 55, // 55分(presigned URL 有効期限内)
  });

  const unsync = async (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.preventDefault();
    try {
      await deleteSensorData(syncStateData.uploadId);
      // TODO
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <IconCloudUp className={styles.icon_button} onClick={(e) => void unsync(e)} data-loading={isLoading} {...props} />
  );
}
