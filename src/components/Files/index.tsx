import { getSensorFiles, type SensorFile } from '@satooru65536/tauri-plugin-sensorkit';
import { useEffect, useState } from 'react';

export default function Files() {
  const [files, setFiles] = useState<SensorFile[]>([]);

  useEffect(() => {
    void (async () => {
      const sensorFiles = await getSensorFiles().catch((err) => {
        console.error('Error fetching sensor files:', err);
        return [];
      });
      setFiles(sensorFiles);
    })();
  }, []);

  return (
    <section>
      <h1>Sensor Files</h1>
      <div>
        {files.map((file) => (
          <div key={file.id}>{file.dataName}</div>
        ))}
      </div>
    </section>
  );
}
