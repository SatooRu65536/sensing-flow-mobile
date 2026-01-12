export const SensorName = {
  Accelerometer: 'accelerometer',
  Gyroscope: 'gyroscope',
} as const;

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
  [SensorName.Accelerometer]: AccelerometerEvent;
  [SensorName.Gyroscope]: GyroscopeEvent;
}
