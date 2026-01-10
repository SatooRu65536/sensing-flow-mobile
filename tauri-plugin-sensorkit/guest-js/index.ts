import { invoke, PluginListener } from '@tauri-apps/api/core';
import { addPluginListener } from '@tauri-apps/api/core';

export async function ping(value: string): Promise<string | null> {
  return await invoke<{ value?: string }>('plugin:sensorkit|ping', {
    payload: {
      value,
    },
  }).then((r) => (r.value ? r.value : null));
}

export async function startAccelerometer(delayMs?: number): Promise<void> {
  await invoke('plugin:sensorkit|start_accelerometer', {
    payload: {
      delayMs,
    },
  });
}

export async function stopAccelerometer(): Promise<void> {
  await invoke('plugin:sensorkit|stop_accelerometer');
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
