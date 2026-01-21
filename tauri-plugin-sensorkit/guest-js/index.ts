import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { type SensorEventMap, SensorNameMap } from './sensorEvent';
import type {
  CreateGroupRequest,
  CreateGroupResponse,
  CreateSensorDataRequest,
  CreateSensorDataResponse,
  GetAvailableSensorsResponse,
  GetGroupedSensorDataResponse,
  GetGroupResponse,
  GetGroupsResponse,
  StartSensorsRequest,
} from './type';

export * from './type';
export * from './sensorEvent';
export type { UnlistenFn } from '@tauri-apps/api/event';

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

export async function createSensorData(payload: CreateSensorDataRequest): Promise<CreateSensorDataResponse> {
  return await invoke<CreateSensorDataResponse>('plugin:sensorkit|create_sensor_data', { payload });
}

export async function deleteSensorData(id: number): Promise<void> {
  await invoke('plugin:sensorkit|delete_sensor_data', { id });
}

export async function listenTo<K extends keyof SensorEventMap>(
  sensorName: K,
  handler: (event: SensorEventMap[K]) => void,
) {
  const eventname = `sensorkit://${sensorName}/update`;
  return await listen<SensorEventMap[K]>(eventname, (e) => handler(e.payload));
}

export async function getGroupedSensorData(): Promise<GetGroupedSensorDataResponse> {
  return await invoke<GetGroupedSensorDataResponse>('plugin:sensorkit|get_grouped_sensor_data');
}

export async function createGroup(payload: CreateGroupRequest): Promise<CreateGroupResponse> {
  return await invoke<CreateGroupResponse>('plugin:sensorkit|create_group', { payload });
}

export async function getGroup(id: number): Promise<GetGroupResponse> {
  return (await invoke<{ group: GetGroupResponse }>('plugin:sensorkit|get_group', { payload: { id } })).group;
}

export async function getGroups(): Promise<GetGroupsResponse> {
  return (await invoke<{ groups: GetGroupsResponse }>('plugin:sensorkit|get_groups')).groups;
}

export async function deleteGroup(id: number): Promise<void> {
  await invoke('plugin:sensorkit|delete_group', { payload: { id } });
}

export async function syncSensorData(id: number, jwtToken: string, apiUrl: string): Promise<void> {
  await invoke('plugin:sensorkit|sync_sensor_data', { payload: { id, jwtToken, apiUrl } });
}

export async function unsyncSensorData(id: number, jwtToken: string, apiUrl: string): Promise<void> {
  await invoke('plugin:sensorkit|unsync_sensor_data', { payload: { id, jwtToken, apiUrl } });
}
