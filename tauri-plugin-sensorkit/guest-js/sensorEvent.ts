export const SensorNameMap = {
  Accelerometer: 'accelerometer',
  LinearAcceleration: 'linear_acceleration',
  Gyroscope: 'gyroscope',
  Barometer: 'barometer',
  Magnetometer: 'magnetometer',
  Location: 'location',
  Light: 'light',
} as const;
export const SensorNames = Object.values(SensorNameMap);
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
