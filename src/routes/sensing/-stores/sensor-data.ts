import { Store } from '@tanstack/store';
import { type SensorEvent } from '@satooru65536/tauri-plugin-sensorkit';

export const sensorDataStore = new Store<SensorEvent | null>(null);

export const setSensorData = (data: SensorEvent | null) => {
  sensorDataStore.setState(data);
};
