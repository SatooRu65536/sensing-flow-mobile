import styles from './index.module.scss';
import ListItem, { type ListItemProps } from '@/components/ListItem';
import { formatDateSimple } from '@/utils/date';
import { getSensorDataSyncState, type SensorData } from '@satooru65536/tauri-plugin-sensorkit';
import SyncedIconButton from './SyncedIconButton';
import UnSyncedIconButton from './UnSyncedIconButton';
import { useUser } from '@/hooks/useUser';
import { useQuery } from '@tanstack/react-query';
import { GET_SYNC_STATE } from '@/consts/query-key';

interface SensorDataLlistItemProps extends Omit<ListItemProps, 'children'> {
  data: SensorData;
}

export default function SensorDataLlistItem({ data, ...props }: SensorDataLlistItemProps) {
  const { getToken, alertDialog } = useUser();
  const { data: syncState } = useQuery({
    queryKey: [GET_SYNC_STATE, data.id],
    queryFn: async () => {
      try {
        return await getSensorDataSyncState(data.id);
      } catch {
        return null;
      }
    },
  });

  return (
    <ListItem className={styles.list_item} to={`/files/$dataId`} params={{ dataId: data.id.toString() }} {...props}>
      {syncState ? (
        <SyncedIconButton data={data} syncState={syncState} getToken={getToken} />
      ) : (
        <UnSyncedIconButton data={data} getToken={getToken} />
      )}
      <span className={styles.data_name}>{data.name}</span>
      <span className={styles.created_at}>{formatDateSimple(data.createdAt)}</span>
      {alertDialog}
    </ListItem>
  );
}
