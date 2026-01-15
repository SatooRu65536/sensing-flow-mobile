import { getGroupedSensorData, type GroupedSensorFiles } from '@satooru65536/tauri-plugin-sensorkit';
import { useEffect, useState } from 'react';

export default function Files() {
  const [sensorData, setSensorData] = useState<GroupedSensorFiles[]>([]);

  useEffect(() => {
    void (async () => {
      try {
        const groupedSensorData: GroupedSensorFiles[] = await getGroupedSensorData();
        console.log(groupedSensorData);
        setSensorData(groupedSensorData);
      } catch (error) {
        console.error('Error fetching grouped sensor data:', error);
      }
    })();
  }, []);

  return (
    <section>
      <h1>Sensor Files</h1>
      <div>
        {sensorData.map((group) => (
          <div key={group.groupId}>
            <h2>{group.groupName}</h2>
            <p>Created At: {new Date(group.createdAt).toLocaleString()}</p>
            <ul>
              {group.sensorData.map((file) => (
                <li key={file.id}>
                  <p>Data Name: {file.dataName}</p>
                  <p>File Path: {file.filePath}</p>
                  <p>Synced: {file.synced ? 'Yes' : 'No'}</p>
                  <p>Active Sensors: {file.activeSensors.join(', ')}</p>
                  <p>Created At: {new Date(file.createdAt).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
