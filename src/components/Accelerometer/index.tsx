import { useEffect, useState } from 'react';
import { startAccelerometer, stopAccelerometer, listenAccelerometer } from '@satooru65536/tauri-plugin-sensorkit';

export default function AccelerometerPanel() {
  const [acc, setAcc] = useState<{ x: number; y: number; z: number } | null>(null);

  useEffect(() => {
    let mounted = true;

    startAccelerometer(1).catch(console.error);
    listenAccelerometer((e) => {
      if (!mounted) return;
      setAcc(e);
    }).catch(console.error);

    return () => {
      mounted = false;
      stopAccelerometer().catch(console.error);
    };
  }, []);

  return (
    <section style={{ marginTop: 16 }}>
      <h2>Accelerometer</h2>
      {acc ? (
        <div style={{ display: 'flex', gap: 12 }}>
          <div>X: {acc.x.toFixed(3)}</div>
          <div>Y: {acc.y.toFixed(3)}</div>
          <div>Z: {acc.z.toFixed(3)}</div>
        </div>
      ) : (
        <div>Waiting for sensor...</div>
      )}
    </section>
  );
}
