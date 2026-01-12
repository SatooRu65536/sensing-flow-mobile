import { useEffect, useState } from 'react';
import {
  startSensors,
  stopSensors,
  listenTo,
  type AccelerometerEvent,
  type UnlistenFn,
} from '@satooru65536/tauri-plugin-sensorkit';

export default function AccelerometerPanel() {
  const [data, setData] = useState<AccelerometerEvent | null>(null);

  const stop = () => {
    stopSensors().catch(console.error);
  };

  useEffect(() => {
    let unlisten: UnlistenFn | null = null;

    const start = async () => {
      await startSensors({ accelerometer: 1 });
      unlisten = await listenTo('accelerometer', (event) => setData(event));
    };

    void start();

    return () => {
      if (unlisten) void unlisten();
      stopSensors().catch(console.error);
    };
  }, []);

  return (
    <section style={{ marginTop: 16 }}>
      <h2>Accelerometer</h2>
      {data ? (
        <div style={{ display: 'flex', gap: 12 }}>
          <div>X: {data.x.toFixed(3)}</div>
          <div>Y: {data.y.toFixed(3)}</div>
          <div>Z: {data.z.toFixed(3)}</div>

          <button onClick={stop}>Stop</button>
        </div>
      ) : (
        <div>Waiting for sensor...</div>
      )}
    </section>
  );
}
