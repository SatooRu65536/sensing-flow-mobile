import { Store } from '@tanstack/store';
import { type SensorName } from '@satooru65536/tauri-plugin-sensorkit';

export interface SensingSettingsState {
  save: boolean;
  sensor: SensorName | number | null;
  groupId: number | null;
  dataName: string;
  autoSync: boolean;
  realTimeShare: boolean;
}

const initValue: SensingSettingsState = {
  save: true,
  sensor: null,
  groupId: null,
  dataName: '',
  autoSync: false,
  realTimeShare: false,
};

export const sensingSettingsStore = new Store<SensingSettingsState>(initValue);

export const setSave = (save: boolean) => {
  sensingSettingsStore.setState((state) => ({
    ...state,
    save,
  }));
};

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
  sensingSettingsStore.setState((state) => ({ ...initValue, save: state.save }));
};

export const resetAllSensingSettings = () => {
  sensingSettingsStore.setState({ ...initValue });
};

export const setSensingSettings = (settings: Partial<SensingSettingsState>) => {
  sensingSettingsStore.setState((state) => ({
    ...state,
    ...settings,
  }));
};
