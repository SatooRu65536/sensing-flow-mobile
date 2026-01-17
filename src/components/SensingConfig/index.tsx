import styles from './index.module.scss';
import { useTranslation } from 'react-i18next';
import Card from '@/layout/card';
import Select, { type GroupedSelectItems, type SelectItems } from '@/components/Select';
import Input from '@/components/Input';
import Checkbox from '@/components/Checkbox';
import { useQuery } from '@tanstack/react-query';
import { getAvailableSensors, getGroups } from '@satooru65536/tauri-plugin-sensorkit';
import { entries } from '@/utils';

interface SensingConfigProps extends React.ComponentProps<'div'> {
  defaultSensor?: string;
  defaultGroup?: string;
  defaultSync?: boolean;
}

export default function SensingConfig({
  defaultSensor,
  defaultGroup,
  defaultSync = false,
  ...props
}: SensingConfigProps) {
  const { t } = useTranslation();
  const { data: sensors } = useQuery({
    queryKey: ['availableSensors'],
    queryFn: getAvailableSensors,
    staleTime: Infinity,
  });
  const { data: groups } = useQuery({
    queryKey: ['getGroups'],
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
      <Select items={sensorItems} defaultValue={defaultSensor} placeholder={t('pages.sensing.SelectSensors')} />
      <Select items={groupItems} defaultValue={defaultGroup} placeholder={t('pages.sensing.SelectGroup')} />
      <Input placeholder={t('pages.sensing.InputDataName')} className={styles.Input} />
      <Checkbox label={t('pages.sensing.AutoSyncToCloud')} defaultChecked={defaultSync} disabled />
      <Checkbox label={t('pages.sensing.RealTimeShare')} defaultChecked={defaultSync} disabled />
    </Card>
  );
}
