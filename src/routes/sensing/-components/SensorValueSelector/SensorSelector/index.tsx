import { useTranslation } from 'react-i18next';
import styles from './index.module.scss';
import { type SensorName } from '@satooru65536/tauri-plugin-sensorkit';

interface SensorSelectorProps {
  sensors: SensorName[];
  select: SensorName;
  onSelect?: (sensor: SensorName) => void;
}

export default function SensorSelector({ sensors, select, onSelect }: SensorSelectorProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.sensor_names}>
      <div className={styles.sensor_names_inner}>
        {sensors.map((sensor) => (
          <button
            key={sensor}
            className={styles.sensor_name}
            onClick={() => onSelect?.(sensor)}
            disabled={sensor === select}
          >
            {t(`sensors.${sensor}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
