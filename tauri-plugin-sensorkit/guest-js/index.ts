import { invoke, PluginListener } from '@tauri-apps/api/core';
import { addPluginListener } from '@tauri-apps/api/core';

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

export interface AccelerometerEvent {
  x: number;
  y: number;
  z: number;
  timestamp?: number;
}

export async function listenAccelerometer(
  handler: (event: { x: number; y: number; z: number; timestamp?: number }) => void,
): Promise<PluginListener> {
  return await addPluginListener('sensorkit', 'accelerometer', (e: AccelerometerEvent) => {
    handler(e);
  });
}
