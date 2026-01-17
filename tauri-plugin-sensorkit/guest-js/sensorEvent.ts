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

export interface BarometerEvent {
  timestamp: number;
  pressure: number;
}

export interface MagnetometerEvent {
  timestamp: number;
  x: number;
  y: number;
  z: number;
}

export interface LocationEvent {
  timestamp: number;
  latitude: number;
  longitude: number;
}

export interface LightEvent {
  timestamp: number;
  lux: number;
}

export type SensorEvent<T extends SensorName = SensorName> = SensorEventMap[T];

export interface SensorEventMap {
  [SensorNameMap.Accelerometer]: AccelerometerEvent;
  [SensorNameMap.LinearAcceleration]: AccelerometerEvent;
  [SensorNameMap.Gyroscope]: GyroscopeEvent;
  [SensorNameMap.Barometer]: BarometerEvent;
  [SensorNameMap.Magnetometer]: MagnetometerEvent;
  [SensorNameMap.Location]: LocationEvent;
  [SensorNameMap.Light]: LightEvent;
}

export const SensorKeysMap = {
  [SensorNameMap.Accelerometer]: [{ x: 'm/s²' }, { y: 'm/s²' }, { z: 'm/s²' }],
  [SensorNameMap.LinearAcceleration]: [{ x: 'm/s²' }, { y: 'm/s²' }, { z: 'm/s²' }],
  [SensorNameMap.Gyroscope]: [{ x: 'rad/s' }, { y: 'rad/s' }, { z: 'rad/s' }],
  [SensorNameMap.Barometer]: [{ pressure: 'hPa' }],
  [SensorNameMap.Magnetometer]: [{ x: 'μT' }, { y: 'μT' }, { z: 'μT' }],
  [SensorNameMap.Location]: [{ latitude: '°' }, { longitude: '°' }],
  [SensorNameMap.Light]: [{ lux: 'lux' }],
} as const satisfies Record<SensorName, Record<string, string>[]>;
