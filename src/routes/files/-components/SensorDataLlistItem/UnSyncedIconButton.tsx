import styles from './index.module.scss';
import type { Dispatch, SetStateAction } from 'react';
import type { SyncState } from '.';
import { IconCloudUp } from '@tabler/icons-react';
import { unsyncSensorData, type SensorData } from '@satooru65536/tauri-plugin-sensorkit';
import { useJwtToken } from '@/hooks/useJwtToken';

interface UnSyncIconButtonProps {
  data: SensorData;
  isLoading: boolean;
  setState: Dispatch<SetStateAction<SyncState>>;
}

export default function UnSyncedIconButton({ data, setState, isLoading, ...props }: UnSyncIconButtonProps) {
  const [getToken, alertDialog] = useJwtToken({ from: '/files/' });

  const unsync = async (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.preventDefault();

    const token = getToken();
    // token がない場合は getToken が alertDialog を表示するので何もしない
    if (token) {
      setState('unsyncing');

      try {
        await unsyncSensorData(data.id, token, import.meta.env.VITE_API_URL);
        setState('unsynced');
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
