import styles from './index.module.scss';
import { useTranslation } from 'react-i18next';
import Card from '@/layout/card';
import Select, { type GroupedSelectItems, type SelectItems } from '@/components/Select';
import Input from '@/components/Input';
import Checkbox from '@/components/Checkbox';
import { useQuery } from '@tanstack/react-query';
import { getAvailableSensors, getGroups } from '@satooru65536/tauri-plugin-sensorkit';
import { entries } from '@/utils';
import { AVAILABLE_SENSORS, GET_GROUPS } from '@/consts/query-key';
import { useStore } from '@tanstack/react-store';
import {
  sensingSettingsStore,
  setSensor,
  setGroupId,
  setDataName,
  setAutoSync,
  setRealTimeShare,
} from '@/routes/sensing/-stores/sensing-settings';

interface SensingConfigProps extends React.ComponentProps<'div'> {
  defaultSensor?: string;
  defaultGroupId?: number;
  defaultSync?: boolean;
}

export default function SensingSettings({
  defaultSensor,
  defaultGroupId,
  defaultSync = false,
  ...props
}: SensingConfigProps) {
  const { t } = useTranslation();
  const state = useStore(sensingSettingsStore);

  const { data: sensors } = useQuery({
    queryKey: [AVAILABLE_SENSORS],
    queryFn: getAvailableSensors,
    staleTime: Infinity,
  });
  const { data: groups } = useQuery({
    queryKey: [GET_GROUPS],
    queryFn: getGroups,
    staleTime: Infinity,
  });

  const sensorItems: GroupedSelectItems = [
    {
      label: t('pages.sensing.Sensors'),
      items:
        sensors &&
        entries(sensors)
          .filter(([, isAvailable]) => isAvailable)
          .map(([sensor]) => ({
            label: t(`sensors.${sensor}`),
            value: sensor,
          })),
    },
    {
      label: t('pages.sensing.SensorSets'),
      items: [],
    },
  ];
  const groupItems: SelectItems = groups?.map((g) => ({ label: g.name, value: g.id }));

  return (
    <Card className={styles.sensing_config} {...props}>
      <Select<string>
        items={sensorItems}
        defaultValue={defaultSensor}
        placeholder={t('pages.sensing.SelectSensors')}
        onChange={(value) => {
          setSensor(value);
        }}
      />
      <Select<number>
        items={groupItems}
        defaultValue={defaultGroupId}
        placeholder={t('pages.sensing.SelectGroup')}
        onChange={(value) => setGroupId(value)}
      />
      <Input
        placeholder={t('pages.sensing.InputDataName')}
        className={styles.Input}
        value={state.dataName}
        onChange={(e) => setDataName(e.target.value)}
      />
      <Checkbox
        label={t('pages.sensing.AutoSyncToCloud')}
        defaultChecked={defaultSync || state.autoSync}
        disabled
        onCheckedChange={(checked) => setAutoSync(checked)}
      />
      <Checkbox
        label={t('pages.sensing.RealTimeShare')}
        defaultChecked={defaultSync || state.realTimeShare}
        disabled
        onCheckedChange={(checked) => setRealTimeShare(checked)}
      />
    </Card>
  );
}
