import styles from './index.module.scss';
import { useEffect } from 'react';
import { listenTo, SensorKeysMap, type SensorName, type UnlistenFn } from '@satooru65536/tauri-plugin-sensorkit';
import { splitEntry } from '@/utils';
import { useStore } from '@tanstack/react-store';
import { sensorDataStore, setSensorData } from '@/routes/sensing/-stores/sensor-data';

interface SensorValueProps {
  sensorName: SensorName;
}

export default function SensorValue({ sensorName }: SensorValueProps) {
  const data = useStore(sensorDataStore);

  useEffect(() => {
    let unlisten: UnlistenFn | null = null;

    const listenStart = async () => {
      unlisten = await listenTo(sensorName, (event) => setSensorData(event));
    };

    void listenStart();

    return () => {
      if (unlisten) void unlisten();
    };
  }, [sensorName]);

  return (
    <div className={styles.sensor_values}>
      {SensorKeysMap[sensorName].map((keyUnit) => {
        const { key, value: unit } = splitEntry(keyUnit);
        const rawValue = data ? (data[key] as number) : undefined;
        return (
          <div key={key} className={styles.sensor_value}>
            <span className={styles.key}>{key}</span>
            <span className={styles.separator}> : </span>
            <span className={styles.value}>{rawValue?.toFixed(3) ?? '-'}</span>
            <span className={styles.unit}>({unit})</span>
          </div>
        );
      })}
    </div>
  );
}
