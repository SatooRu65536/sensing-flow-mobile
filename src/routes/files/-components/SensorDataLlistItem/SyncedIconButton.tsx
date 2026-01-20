import styles from './index.module.scss';
import type { Dispatch, SetStateAction } from 'react';
import type { SyncState } from '.';
import { IconCloudUp } from '@tabler/icons-react';
import { unsyncSensorData, type SensorData } from '@satooru65536/tauri-plugin-sensorkit';
import { useQueryClient } from '@tanstack/react-query';
import { GET_GROUPED_SENSOR_DATA } from '@/consts/query-key';
import { useUser } from '@/hooks/useUser';

interface UnSyncIconButtonProps {
  data: SensorData;
  isLoading: boolean;
  setState: Dispatch<SetStateAction<SyncState>>;
}

export default function SyncedIconButton({ data, setState, isLoading, ...props }: UnSyncIconButtonProps) {
  const { getToken, alertDialog } = useUser();

  const queryClient = useQueryClient();
  const unsync = async (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.preventDefault();

    const token = await getToken();
    // token がない場合は getToken が alertDialog を表示するので何もしない
    if (token) {
      setState('unsyncing');

      try {
        await unsyncSensorData(data.id, token, import.meta.env.VITE_API_URL);
        setState('unsynced');
        await queryClient.invalidateQueries({ queryKey: [GET_GROUPED_SENSOR_DATA] });
      } catch (e) {
        console.error(e);
        setState('synced');
      }
    }
  };

  return (
    <>
      <IconCloudUp className={styles.icon_button} onClick={(e) => void unsync(e)} data-loading={isLoading} {...props} />
      {alertDialog}
    </>
  );
}
