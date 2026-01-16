export const SensorNameMap = {
  Accelerometer: 'accelerometer',
  Gyroscope: 'gyroscope',
} as const;
export type SensorName = (typeof SensorNameMap)[keyof typeof SensorNameMap];
export interface AccelerometerEvent {
  timestamp: number;
  x: number;
  y: number;
  z: number;
}

export interface GyroscopeEvent {
  timestamp: number;
  x: number;
  y: number;
  z: number;
}

export interface SensorEventMap {
  [SensorNameMap.Accelerometer]: AccelerometerEvent;
  [SensorNameMap.Gyroscope]: GyroscopeEvent;
}
