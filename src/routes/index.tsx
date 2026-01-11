import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { getAvailableSensors, type GetAvailableSensorsResponse } from '@satooru65536/tauri-plugin-sensorkit';
import AccelerometerPanel from '@/components/Accelerometer';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  const [availableSensors, setAvailableSensors] = useState<GetAvailableSensorsResponse>({});

  useEffect(() => {
    void (async () => {
      if (Object.keys(availableSensors).length > 0) return;

      console.log('fetching available sensors...');
      const sensors = await getAvailableSensors().catch((err) => {
        console.error('Error fetching available sensors:', err);
        return {};
      });
      setAvailableSensors(sensors);
    })();
  }, []);

  return (
    <main className="container">
      <h1>Available Sensors</h1>

      <div>
        {Object.entries(availableSensors).map(([sensor, isAvailable]) => (
          <div key={sensor}>
            {sensor}: {isAvailable ? 'Available' : 'Not Available'}
          </div>
        ))}
      </div>

      {availableSensors.accelerometer && <AccelerometerPanel />}
    </main>
  );
}
