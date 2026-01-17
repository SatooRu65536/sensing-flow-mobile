import { Store } from '@tanstack/store';
import { type SensorName } from '@satooru65536/tauri-plugin-sensorkit';
import { sensingSettingsStore } from './sensing-settings';

export type SensorListState = SensorName[];

export const sensorListStore = new Store<SensorListState>([]);

const updateSensorList = () => {
  const sensor = sensingSettingsStore.state.sensor;

  let newList: SensorListState = [];

  if (typeof sensor === 'number') {
    // TODO: センサーセット対応
    throw new Error('Sensor sets are not supported yet.');
  } else if (typeof sensor === 'string' && sensor.length > 0) {
    newList = [sensor];
  } else {
    newList = [];
  }

  sensorListStore.setState(() => newList);
};

sensingSettingsStore.subscribe(() => {
  updateSensorList();
});

updateSensorList();
