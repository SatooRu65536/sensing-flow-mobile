import styles from './index.module.scss';
import type { Dispatch, SetStateAction } from 'react';
import type { SyncState } from '.';
import { IconCloudOff } from '@tabler/icons-react';
import { syncSensorData, type SensorData } from '@satooru65536/tauri-plugin-sensorkit';
import { useJwtToken } from '@/hooks/useJwtToken';

interface SyncIconButtonProps {
  data: SensorData;
  isLoading: boolean;
  setState: Dispatch<SetStateAction<SyncState>>;
}

export default function SyncedIconButton({ data, setState, isLoading, ...props }: SyncIconButtonProps) {
  const [getToken, alertDialog] = useJwtToken({ from: '/files/' });

  const sync = async (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.preventDefault();

    if (isLoading) return;

    const token = getToken();
    // token がない場合は getToken が alertDialog を表示するので何もしない
    if (token) {
      setState('syncing');

      try {
        await syncSensorData(data.id, token, import.meta.env.VITE_API_URL);
        setState('synced');
      } catch (e) {
        console.error(e);
        setState('unsynced');
      }
    }
  };

  return (
    <>
      <IconCloudOff className={styles.icon_button} onClick={(e) => void sync(e)} data-loading={isLoading} {...props} />
      {alertDialog}
    </>
  );
}
