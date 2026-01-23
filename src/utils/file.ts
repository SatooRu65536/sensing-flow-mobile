import { BaseDirectory, readFile } from '@tauri-apps/plugin-fs';
import type { SensorName } from '@satooru65536/tauri-plugin-sensorkit';

export interface SensorDataFile {
  path: string;
  sensor: SensorName;
  data: Uint8Array<ArrayBuffer>;
}

export async function readSensorDataFile(folderPath: string, sensor: SensorName): Promise<SensorDataFile> {
  try {
    const path = `${folderPath}/${sensor}.csv`;
    try {
      const data = await readFile(path, {
        baseDir: BaseDirectory.AppLocalData,
      });
      return {
        data,
        path: path,
        sensor,
      } satisfies SensorDataFile;
    } catch (e) {
      console.warn(`Could not read file for sensor ${sensor} at path ${path}:`, e);
      throw e;
    }
  } catch (e) {
    console.error(`Error reading sensor data file for sensor ${sensor} in folder ${folderPath}:`, e);
    throw new Error(`Failed to read sensor data file for sensor ${sensor} in folder ${folderPath}`);
  }
}
