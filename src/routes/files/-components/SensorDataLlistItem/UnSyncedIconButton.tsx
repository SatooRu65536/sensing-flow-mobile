import styles from './index.module.scss';
import { useState } from 'react';
import { IconCloudOff } from '@tabler/icons-react';
import { type SensorData, type SensorName } from '@satooru65536/tauri-plugin-sensorkit';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_GROUPED_SENSOR_DATA, GET_SYNC_STATE, GET_UPLOAD_PRESIGNED_URLS } from '@/consts/query-key';
import { type GetTokenFunction } from '@/hooks/useUser';
import { authHeader } from '@/utils/auth-header';
import { client } from '@/api';
import { readSensorDataFile } from '@/utils/file';

interface SyncIconButtonProps {
  data: SensorData;
  getToken: GetTokenFunction;
}

export default function UnSyncedIconButton({ data, getToken, ...props }: SyncIconButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();
  const { mutateAsync: putToS3 } = useMutation({
    mutationFn: async ({
      presignedUrl,
      folderPath,
      sensor,
    }: {
      presignedUrl: string;
      folderPath: string;
      sensor: SensorName;
    }) => {
      const file = await readSensorDataFile(folderPath, sensor);
      try {
        const res = await fetch(presignedUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'text/csv',
          },
          body: file.data,
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Upload failed: ${res.status} ${text}`);
        }
        return { sensor };
      } catch (e) {
        console.error(`Failed to upload sensor data for sensor ${sensor} to S3:`, e);
        throw e;
      }
    },
    retry: 1, // 1回リトライ
  });
  const { mutateAsync: getPresignedUrls } = useMutation({
    mutationKey: [GET_UPLOAD_PRESIGNED_URLS, data.id],
    mutationFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No token available');

      const res = await client.POST('/sensor-data/presigned-urls', {
        body: {
          createdAt: data.createdAt,
          dataName: data.name,
          sensors: data.activeSensors,
        },
        headers: authHeader(token),
      });

      if (res.data == undefined) throw new Error('Failed to get presigned URLs');

      return res.data;
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: async (presignedUrlsRes) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const results = await Promise.allSettled(
        presignedUrlsRes.urls.map(async ({ sensor, presignedUrl }) =>
          putToS3({ sensor, presignedUrl, folderPath: data.folderPath }),
        ),
      );

      // TODO: results を DB に反映するコマンドの呼び出し

      await queryClient.invalidateQueries({ queryKey: [GET_GROUPED_SENSOR_DATA] });
    },
    onSettled: async () => {
      setIsLoading(false);
      await queryClient.invalidateQueries({ queryKey: [GET_SYNC_STATE, data.id] });
    },
    gcTime: 1000 * 60 * 55, // 55分(presigned URL 有効期限内)
  });

  const sync = async (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.preventDefault();
    await getPresignedUrls();
  };

  return (
    <IconCloudOff className={styles.icon_button} onClick={(e) => void sync(e)} data-loading={isLoading} {...props} />
  );
}
