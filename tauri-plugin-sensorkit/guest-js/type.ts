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
  dataName: string;
  filePath: string;
  synced: boolean;
  activeSensors: SensorName[];
  groupId: number;
  createdAt: Date;
}

export interface GroupedSensorFiles {
  groupId: number;
  groupName: string;
  createdAt: Date;
  sensorData: SensorData[];
}

export interface CreateGroupRequest {
  groupName: string;
}

interface Group {
  id: number;
  name: string;
  sorted: number;
  createdAt: Date;
}

export type CreateGroupResponse = Group;

export interface GetGroupsResponse {
  groups: Group[];
}
