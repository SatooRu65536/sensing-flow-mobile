import type { Dispatch, SetStateAction } from 'react';
import styles from './index.module.scss';
import { IconCloudUp } from '@tabler/icons-react';
import type { SyncState } from '.';
import { unsyncSensorData, type SensorData } from '@satooru65536/tauri-plugin-sensorkit';

interface UnSyncIconButtonProps {
  data: SensorData;
  setState: Dispatch<SetStateAction<SyncState>>;
}

export default function UnSyncIconButton({ data, setState }: UnSyncIconButtonProps) {
  const unsync = async (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.preventDefault();
    setState('unsyncing');
    await unsyncSensorData(data.id);
  };

  return <IconCloudUp className={styles.icon_button} onClick={(e) => void unsync(e)} />;
}
