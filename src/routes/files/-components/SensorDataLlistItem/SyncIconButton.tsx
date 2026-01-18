import type { Dispatch, SetStateAction } from 'react';
import type { SyncState } from '.';
import styles from './index.module.scss';
import { IconCloudOff } from '@tabler/icons-react';
import { syncSensorData, type SensorData } from '@satooru65536/tauri-plugin-sensorkit';

interface SyncIconButtonProps {
  data: SensorData;
  setState: Dispatch<SetStateAction<SyncState>>;
}

export default function SyncIconButton({ data, setState }: SyncIconButtonProps) {
  const sync = async (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.preventDefault();
    setState('syncing');
    await syncSensorData(data.id);
  };

  return <IconCloudOff className={styles.icon_button} onClick={(e) => void sync(e)} />;
}
