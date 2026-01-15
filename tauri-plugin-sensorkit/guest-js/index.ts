import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { SensorEventMap } from './sensorEvent';

export * from './sensorEvent';
export { UnlistenFn } from '@tauri-apps/api/event';

export interface GetAvailableSensorsResponse {
  [key: string]: boolean;
}

export async function getAvailableSensors(): Promise<GetAvailableSensorsResponse> {
  return await invoke<GetAvailableSensorsResponse>('plugin:sensorkit|get_available_sensors');
}

interface StartSensorsRequest {
  [key: string]: number;
}

export async function startSensors(payload: StartSensorsRequest): Promise<void> {
  await invoke('plugin:sensorkit|start_sensors', { payload });
}

export async function stopSensors(): Promise<void> {
  await invoke('plugin:sensorkit|stop_sensors');
}

export async function listenTo<K extends keyof SensorEventMap>(
  sensorName: K,
  handler: (event: SensorEventMap[K]) => void,
) {
  const eventname = `sensorkit://${sensorName}/update`;
  return await listen<SensorEventMap[K]>(eventname, (e) => handler(e.payload));
}

export interface SensorData {
  id: number;
  dataName: string;
  filePath: string;
  synced: boolean;
  activeSensors: string[];
  groupId: number;
  createdAt: Date;
}

export interface GroupedSensorFiles {
  groupId: number;
  groupName: string;
  createdAt: Date;
  sensorData: SensorData[];
}

export async function getGroupedSensorData(): Promise<GroupedSensorFiles[]> {
  return await invoke<GroupedSensorFiles[]>('plugin:sensorkit|get_grouped_sensor_data');
}
