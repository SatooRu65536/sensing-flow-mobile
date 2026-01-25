import type { SensorName } from './sensorEvent';

export type GetAvailableSensorsResponse = {
  [key in SensorName]: boolean;
};

export interface StartSensorsRequest {
  sensors: { [key in SensorName]?: number };
}

export interface CreateSensorDataRequest {
  groupId: number;
  dataName: string;
  sensors: SensorName[];
}

export interface CreateSensorDataResponse {
  id: number;
  name: string;
  folderPath: string;
  synced: boolean;
  activeSensors: SensorName[];
  groupId: number;
  createdAt: string;
}

export interface SensorData {
  id: number;
  name: string;
  folderPath: string;
  activeSensors: SensorName[];
  groupId: number;
  createdAt: string;
}

export interface GroupedSensorData {
  groupId: number;
  groupName: string;
  createdAt: string;
  sensorData: SensorData[];
}

export type GetGroupedSensorDataResponse = GroupedSensorData[];

export interface CreateGroupRequest {
  name: string;
}

interface Group {
  id: number;
  name: string;
  sorted: number;
  createdAt: string;
}

export type CreateGroupResponse = Group;

export type GetGroupResponse = Group;

export type GetGroupsResponse = Group[];

export interface SensorDataSyncState {
  syncId: number;
  dataId: number;
  uploadId: string;
  syncedSensorNames: SensorName[];
  failedSensorNames: SensorName[];
}

export type SyncStateRequest = Omit<SensorDataSyncState, 'syncId'>;

export const SyncStates = ['synced', 'unsynced', 'partially_synced'] as const;
export type SyncState = (typeof SyncStates)[number];

export interface SyncStateResponse extends SensorDataSyncState {
  state: SyncState;
}

export interface GetSensorDataSyncStateRequest {
  dataId: number;
}

export interface GetSensorDataSyncStateResponse extends SensorDataSyncState {
  state: SyncState;
}
