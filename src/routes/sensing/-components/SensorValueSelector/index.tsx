import { useRef, useState } from 'react';
import styles from './index.module.scss';
import SensorValue from './SensorValue';
import { type SensorName } from '@satooru65536/tauri-plugin-sensorkit';
import { useStore } from '@tanstack/react-store';
import { sensorListStore } from '../../-stores/sensor-list';
import SensorSelector from './SensorSelector';

export default function SensorValueSelector() {
  const sensors = useStore(sensorListStore);
  const [sensor, setSensor] = useState<SensorName>(sensors[0]);

  const prevSensorsRef = useRef(sensors);

  if (prevSensorsRef.current !== sensors) {
    prevSensorsRef.current = sensors;
    if (sensors.length > 0) {
      setSensor(sensors[0]);
    }
  }

  return (
    <div className={styles.sensor_value_selector}>
      {sensors.length >= 2 && <SensorSelector sensors={sensors} onSelect={setSensor} select={sensor} />}
      {sensor && <SensorValue sensorName={sensor} key={sensor} />}
    </div>
  );
}
