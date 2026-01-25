import styles from './index.module.scss';
import { IconCloudOff, IconCloudUp } from '@tabler/icons-react';
import { syncSensorData, type SensorData, type SensorName } from '@satooru65536/tauri-plugin-sensorkit';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_SYNC_STATE, GET_UPLOAD_PRESIGNED_URLS } from '@/consts/query-key';
import { type GetTokenFunction } from '@/hooks/useUser';
import { authHeader } from '@/utils/auth-header';
import { client } from '@/api';
import { readSensorDataFile } from '@/utils/file';
import { fetch } from '@tauri-apps/plugin-http';

interface UnSyncIconButtonProps {
  data: SensorData;
  getToken: GetTokenFunction;
}

export default function UnSyncedIconButton({ data, getToken, ...props }: UnSyncIconButtonProps) {
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
        return { sensor, success: true };
      } catch (e) {
        console.error(`Failed to upload sensor data for sensor ${sensor} to S3:`, e);
        return { sensor, success: false };
      }
    },
    retry: 1, // 1回リトライ
  });
  const { mutateAsync: getPresignedUrls, isPending } = useMutation({
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
    onSuccess: async (presignedUrlsRes) => {
      const results = await Promise.all(
        presignedUrlsRes.urls.map(async ({ sensor, presignedUrl }) =>
          putToS3({ sensor, presignedUrl, folderPath: data.folderPath }),
        ),
      );

      const syncedSensorNames = results.filter(({ success }) => success).map(({ sensor }) => sensor);
      const failedSensorNames = results.filter(({ success }) => !success).map(({ sensor }) => sensor);

      await syncSensorData({
        dataId: data.id,
        uploadId: presignedUrlsRes.id,
        syncedSensorNames,
        failedSensorNames,
      });

      await queryClient.invalidateQueries({ queryKey: [GET_SYNC_STATE, data.id] });
    },
    onError: async () => {
      await queryClient.invalidateQueries({ queryKey: [GET_SYNC_STATE, data.id] });
    },
    gcTime: 1000 * 60 * 55, // 55分(presigned URL 有効期限内)
  });

  const sync = async (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.preventDefault();
    await getPresignedUrls();
  };

  return isPending ? (
    <IconCloudUp className={styles.icon_button} {...props} data-loading />
  ) : (
    <IconCloudOff className={styles.icon_button} onClick={(e) => void sync(e)} {...props} />
  );
}
