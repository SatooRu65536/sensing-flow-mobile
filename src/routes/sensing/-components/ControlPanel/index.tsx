import { useRef, useState } from 'react';
import styles from './index.module.scss';
import Timer, { type TimerHandle } from './Time';
import { IconPlayerStopFilled, IconPlayerPlayFilled, IconCheck, IconArrowBack } from '@tabler/icons-react';
import FloatButton from './FloatButton';
import { useStore } from '@tanstack/react-store';
import { resetSensingSettings } from '../../-stores/sensing-settings';
import { valiedSensingSettings, type SensingSettingsSchema } from '../../-stores/valid-sensing-settings';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { startSensors } from '@satooru65536/tauri-plugin-sensorkit';
import { GET_GROUPED_SENSOR_DATA } from '@/consts/query-key';
import { sensorListStore } from '../../-stores/sensor-list';

export default function ControlPanel() {
  const [status, setStatus] = useState<'ready' | 'running' | 'paused'>('ready');
  const timerRef = useRef<TimerHandle>(null);
  const settings = useStore(valiedSensingSettings);
  const sensors = useStore(sensorListStore);

  const queryClient = useQueryClient();
  const { mutateAsync: startSensing } = useMutation({
    mutationFn: async (settings: SensingSettingsSchema) => {
      await startSensors({
        dataName: settings.dataName,
        groupId: settings.groupId,
        // TODO: 仮に 200Hz 固定
        sensors: Object.fromEntries(sensors.map((sensor) => [sensor, 200])),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [GET_GROUPED_SENSOR_DATA] });
    },
  });

  const start = async () => {
    if (!settings.isValid) return;
    await startSensing(settings.data);
    setStatus('running');
    timerRef.current?.start();
  };

  const pause = () => {
    timerRef.current?.pause();
    setStatus('paused');
  };

  const complete = () => {
    timerRef.current?.reset();
    setStatus('ready');
  };

  const reset = () => {
    timerRef.current?.reset();
    setStatus('ready');
    resetSensingSettings();
  };

  return (
    <div className={styles.control_panel}>
      <Timer ref={timerRef} className={styles.timer} />

      <div className={styles.buttons}>
        <FloatButton onClick={pause} disabled={status !== 'running'}>
          <IconPlayerStopFilled />
        </FloatButton>

        <FloatButton onClick={() => void start()} disabled={status === 'running' || !settings.isValid}>
          <IconPlayerPlayFilled />
        </FloatButton>

        <FloatButton onClick={complete} disabled={status === 'ready'}>
          <IconCheck />
        </FloatButton>

        <FloatButton onClick={reset} className={styles.reset} disabled={status !== 'paused'}>
          <IconArrowBack />
        </FloatButton>
      </div>
    </div>
  );
}
