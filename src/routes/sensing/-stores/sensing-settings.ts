import { Store } from '@tanstack/store';
import { type SensorName } from '@satooru65536/tauri-plugin-sensorkit';

export interface SensingSettingsState {
  sensor?: SensorName | number;
  groupId?: number;
  dataName: string;
  autoSync: boolean;
  realTimeShare: boolean;
}

export const sensingSettingsStore = new Store<SensingSettingsState>({
  sensor: undefined,
  groupId: undefined,
  dataName: '',
  autoSync: false,
  realTimeShare: false,
});

export const setSensor = (sensor: SensorName | number | undefined) => {
  sensingSettingsStore.setState((state) => ({
    ...state,
    sensor,
  }));
};

export const setGroupId = (groupId: number | undefined) => {
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
  sensingSettingsStore.setState({
    sensor: undefined,
    groupId: undefined,
    dataName: '',
    autoSync: false,
    realTimeShare: false,
  });
};
