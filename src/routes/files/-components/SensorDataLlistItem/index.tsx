import styles from './index.module.scss';
import ListItem, { type ListItemProps } from '@/components/ListItem';
import { formatDate } from '@/utils/date';
import { type SensorData } from '@satooru65536/tauri-plugin-sensorkit';
import UnSyncIconButton from './UnSyncIconButton';
import SyncIconButton from './SyncIconButton';
import { useState } from 'react';

interface SensorDataLlistItemProps extends ListItemProps {
  data: SensorData;
}

const SyncStateEnum = {
  SYNCED: 'synced',
  SYNCING: 'syncing',
  UNSYNCED: 'unsynced',
  UNSYNCING: 'unsyncing',
} as const;
export type SyncState = (typeof SyncStateEnum)[keyof typeof SyncStateEnum];

export default function SensorDataLlistItem({ data, ...props }: SensorDataLlistItemProps) {
  const [state, setState] = useState<SyncState>(data.synced ? SyncStateEnum.SYNCED : SyncStateEnum.UNSYNCED);

  return (
    <ListItem className={styles.list_item} to={`/files/$dataId`} params={{ dataId: data.id.toString() }} {...props}>
      {data.synced ? (
        <UnSyncIconButton data={data} setState={setState} />
      ) : (
        <SyncIconButton data={data} setState={setState} />
      )}
      <span className={styles.data_name}>{data.name}</span>
      <span className={styles.created_at}>{formatDate(data.createdAt)}</span>
    </ListItem>
  );
}
