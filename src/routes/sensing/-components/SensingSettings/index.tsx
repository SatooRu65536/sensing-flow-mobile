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
import { sensingStateStore } from '@/stores/sensing-state';

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
  const settings = useStore(sensingSettingsStore);
  const state = useStore(sensingStateStore);

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
        value={settings.sensor}
        disabled={state !== 'ready'}
      />
      <Select<number>
        items={groupItems}
        placeholder={t('pages.sensing.SelectGroup')}
        onChange={(value) => setGroupId(value)}
        defaultValue={defaultGroupId}
        value={settings.groupId}
        disabled={state !== 'ready'}
      />
      <Input
        placeholder={t('pages.sensing.InputDataName')}
        onChange={(e) => setDataName(e.target.value)}
        value={settings.dataName}
        disabled={state !== 'ready'}
      />
      <Checkbox
        label={t('pages.sensing.AutoSyncToCloud')}
        defaultChecked={defaultSync}
        onCheckedChange={(checked) => setAutoSync(checked)}
        // disabled={state !== 'ready'} // TODO: 未実装
        disabled={true}
      />
      <Checkbox
        label={t('pages.sensing.RealTimeShare')}
        defaultChecked={defaultRealTime}
        onCheckedChange={(checked) => setRealTimeShare(checked)}
        checked={settings.realTimeShare}
        // disabled={state !== 'ready'} // TODO: 未実装
        disabled={true}
      />
    </Card>
  );
}
