import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { getAvailableSensors, type GetAvailableSensorsResponse } from '@satooru65536/tauri-plugin-sensorkit';
import AccelerometerPanel from '@/components/Accelerometer';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  const { t } = useTranslation();
  const [availableSensors, setAvailableSensors] = useState<GetAvailableSensorsResponse>({});

  useEffect(() => {
    void (async () => {
      if (Object.keys(availableSensors).length > 0) return;

      const sensors = await getAvailableSensors().catch((err) => {
        console.error('Error fetching available sensors:', err);
        return {};
      });
      setAvailableSensors(sensors);
    })();
  }, []);

  return (
    <main className="container">
      <h1>{t('titles.AvailableSensors')}</h1>

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
