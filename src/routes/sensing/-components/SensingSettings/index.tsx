import styles from './index.module.scss';
import { useTranslation } from 'react-i18next';
import Card from '@/layout/card';
import Select, { type GroupedSelectItems, type SelectItems } from '@/components/Select';
import Input from '@/components/Input';
import Checkbox from '@/components/Checkbox';
import { useQuery } from '@tanstack/react-query';
import { getAvailableSensors, getGroups, type SensorName } from '@satooru65536/tauri-plugin-sensorkit';
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
  defaultSensor?: SensorName | number;
  defaultGroupId?: number;
  defaultSync?: boolean;
  defaultRealTime?: boolean;
}

export default function SensingSettings({
  defaultSensor,
  defaultGroupId,
  defaultSync = false,
  defaultRealTime = false,
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
      <Select<SensorName | number> // string: sensorId, number: sensorSetId
        items={sensorItems}
        defaultValue={defaultSensor}
        placeholder={t('pages.sensing.SelectSensors')}
        onChange={(value) => {
          setSensor(value);
        }}
        value={state.sensor}
      />
      <Select<number>
        items={groupItems}
        defaultValue={defaultGroupId}
        placeholder={t('pages.sensing.SelectGroup')}
        onChange={(value) => setGroupId(value)}
        value={state.groupId}
      />
      <Input
        placeholder={t('pages.sensing.InputDataName')}
        className={styles.Input}
        onChange={(e) => setDataName(e.target.value)}
        value={state.dataName}
      />
      <Checkbox
        label={t('pages.sensing.AutoSyncToCloud')}
        defaultChecked={defaultSync}
        disabled
        onCheckedChange={(checked) => setAutoSync(checked)}
        checked={state.autoSync}
      />
      <Checkbox
        label={t('pages.sensing.RealTimeShare')}
        defaultChecked={defaultRealTime}
        disabled
        onCheckedChange={(checked) => setRealTimeShare(checked)}
        checked={state.realTimeShare}
      />
    </Card>
  );
}
