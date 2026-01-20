import styles from './index.module.scss';
import ListItem, { type ListItemProps } from '@/components/ListItem';
import { formatDateSimple } from '@/utils/date';
import { type SensorData } from '@satooru65536/tauri-plugin-sensorkit';
import SyncedIconButton from './SyncedIconButton';
import UnSyncedIconButton from './UnSyncedIconButton';
import { useState } from 'react';

interface SensorDataLlistItemProps extends Omit<ListItemProps, 'children'> {
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
  const [state, setState] = useState<SyncState>(data.uploadId ? SyncStateEnum.SYNCED : SyncStateEnum.UNSYNCED);
  const showSyncedIcon = state === 'synced' || state === 'syncing';
  const isLoading = state === 'syncing' || state === 'unsyncing';

  return (
    <ListItem className={styles.list_item} to={`/files/$dataId`} params={{ dataId: data.id.toString() }} {...props}>
      {showSyncedIcon ? (
        <SyncedIconButton data={data} setState={setState} isLoading={isLoading} />
      ) : (
        <UnSyncedIconButton data={data} setState={setState} isLoading={isLoading} />
      )}
      <span className={styles.data_name}>{data.name}</span>
      <span className={styles.created_at}>{formatDateSimple(data.createdAt)}</span>
    </ListItem>
  );
}
