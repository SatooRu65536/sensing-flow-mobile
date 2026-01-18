import { Store } from '@tanstack/store';
import { type SensorName } from '@satooru65536/tauri-plugin-sensorkit';

export interface SensingSettingsState {
  sensor: SensorName | number | null;
  groupId: number | null;
  dataName: string;
  autoSync: boolean;
  realTimeShare: boolean;
}

const initValue: SensingSettingsState = {
  sensor: null,
  groupId: null,
  dataName: '',
  autoSync: false,
  realTimeShare: false,
};

export const sensingSettingsStore = new Store<SensingSettingsState>(initValue);

export const setSensor = (sensor: SensorName | number | null) => {
  sensingSettingsStore.setState((state) => ({
    ...state,
    sensor,
  }));
};

export const setGroupId = (groupId: number | null) => {
  sensingSettingsStore.setState((state) => ({
    ...state,
    groupId,
  }));
};

export const setDataName = (dataName: string) => {
  sensingSettingsStore.setState((state) => ({
    ...state,
    dataName,
  }));
};

export const setAutoSync = (autoSync: boolean) => {
  sensingSettingsStore.setState((state) => ({
    ...state,
    autoSync,
  }));
};

export const setRealTimeShare = (realTimeShare: boolean) => {
  sensingSettingsStore.setState((state) => ({
    ...state,
    realTimeShare,
  }));
};

export const resetSensingSettings = () => {
  sensingSettingsStore.setState(initValue);
};
