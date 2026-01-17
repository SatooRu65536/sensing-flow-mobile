import styles from './index.module.scss';
import { useTranslation } from 'react-i18next';
import Card from '@/layout/card';
import Select from '@/components/Select';
import Input from '@/components/Input';
import Checkbox from '@/components/Checkbox';

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
  // TODO
  const sensors = [
    { label: t('sensors.accelerometer'), value: 'accelerometer' },
    { label: t('sensors.linear_acceleration'), value: 'linear_acceleration' },
    { label: t('sensors.gyroscope'), value: 'gyroscope' },
    { label: t('sensors.magnetometer'), value: 'magnetometer' },
    { label: t('sensors.barometer'), value: 'barometer' },
    { label: t('sensors.location'), value: 'location' },
    { label: t('sensors.light'), value: 'light' },
  ];
  const groups = [
    { label: 'Group 1', value: 'group_1' },
    { label: 'Group 2', value: 'group_2' },
    { label: 'Group 3', value: 'group_3' },
  ];

  return (
    <Card className={styles.sensing_config} {...props}>
      <Select items={sensors} defaultValue={defaultSensor} placeholder={t('pages.sensing.SelectSensors')} />
      <Select items={groups} defaultValue={defaultGroup} placeholder={t('pages.sensing.SelectGroup')} />
      <Input placeholder={t('pages.sensing.InputDataName')} className={styles.Input} />
      <Checkbox label={t('pages.sensing.AutoSyncToCloud')} defaultChecked={defaultSync} />
      <Checkbox label={t('pages.sensing.RealTimeShare')} defaultChecked={defaultSync} disabled />
    </Card>
  );
}
