import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { SensorEventMap, SensorNameMap } from './sensorEvent';
import {
  CreateGroupRequest,
  CreateGroupResponse,
  GetAvailableSensorsResponse,
  GroupedSensorFiles,
  StartSensorsRequest,
} from './type';

export * from './type';
export * from './sensorEvent';
export { UnlistenFn } from '@tauri-apps/api/event';

export async function getAvailableSensors(): Promise<GetAvailableSensorsResponse> {
  const res = await invoke<GetAvailableSensorsResponse>('plugin:sensorkit|get_available_sensors');

  const orderedSensors = {} as GetAvailableSensorsResponse;
  Object.values(SensorNameMap).forEach((name) => {
    orderedSensors[name] = res[name] ?? false;
  });

  return orderedSensors;
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

export async function getGroupedSensorData(): Promise<GroupedSensorFiles[]> {
  return await invoke<GroupedSensorFiles[]>('plugin:sensorkit|get_grouped_sensor_data');
}

export async function createGroup(payload: CreateGroupRequest): Promise<CreateGroupResponse> {
  return await invoke<CreateGroupResponse>('plugin:sensorkit|create_group', { payload });
}

export async function getGroups(): Promise<CreateGroupResponse[]> {
  return await invoke<CreateGroupResponse[]>('plugin:sensorkit|get_groups');
}
