import { SensorName } from './sensorEvent';

export type GetAvailableSensorsResponse = {
  [key in SensorName]: boolean;
};

export interface StartSensorsRequest {
  groupId: number;
  dataName: string;
  sensors: { [key in SensorName]?: number };
}

export interface SensorData {
  id: number;
  name: string;
  filePath: string;
  synced: boolean;
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

export type GetGroupsResponse = Group[];
