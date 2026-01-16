import { SensorName } from './sensorEvent';

export interface GetAvailableSensorsResponse {
  [key: string]: boolean;
}

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

export interface CreateGroupRequest {
  groupName: string;
}

export interface CreateGroupResponse {
  id: number;
  name: string;
  sorted: number;
  createdAt: Date;
}
