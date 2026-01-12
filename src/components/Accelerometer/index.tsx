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
  const [isRunning, setIsRunning] = useState(false);

  const stop = async () => {
    await stopSensors();
    setIsRunning(false);
  };

  const start = async () => {
    await startSensors({ accelerometer: 1 });
    setIsRunning(true);
  };

  useEffect(() => {
    let unlisten: UnlistenFn | null = null;

    const listenStart = async () => {
      unlisten = await listenTo('accelerometer', (event) => setData(event));
    };

    void listenStart();

    return () => {
      if (unlisten) void unlisten();
      stopSensors().catch(console.error);
    };
  }, [setData]);

  return (
    <section>
      <h2>Accelerometer</h2>
      <div>
        <div>
          {isRunning ? (
            <button onClick={() => void stop()}>Stop</button>
          ) : (
            <button onClick={() => void start()}>Start</button>
          )}
        </div>

        <div>
          <div>X: {data?.x.toFixed(3) ?? 0}</div>
          <div>Y: {data?.y.toFixed(3) ?? 0}</div>
          <div>Z: {data?.z.toFixed(3) ?? 0}</div>
        </div>
      </div>
    </section>
  );
}
