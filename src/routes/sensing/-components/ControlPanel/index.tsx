import { useRef } from 'react';
import styles from './index.module.scss';
import Timer, { type TimerHandle } from './Time';
import { IconPlayerStopFilled, IconPlayerPlayFilled, IconCheck, IconArrowBack } from '@tabler/icons-react';
import FloatButton from './FloatButton';
import { useStore } from '@tanstack/react-store';
import { resetSensingSettings } from '../../-stores/sensing-settings';
import { valiedSensingSettings, type SensingSettingsSchema } from '../../-stores/valid-sensing-settings';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { startSensors, createSensorData, deleteSensorData, stopSensors } from '@satooru65536/tauri-plugin-sensorkit';
import { GET_GROUPED_SENSOR_DATA } from '@/consts/query-key';
import { sensorListStore } from '../../-stores/sensor-list';
import AlertDialog from '@/components/AlertDialog';
import { useTranslation } from 'react-i18next';
import { sensingStateStore, setState } from '@/stores/sensing-state';
import { setSensorData } from '../../-stores/sensor-data';

export default function ControlPanel() {
  const { t } = useTranslation();
  const state = useStore(sensingStateStore);
  const timerRef = useRef<TimerHandle>(null);
  const settings = useStore(valiedSensingSettings);
  const sensors = useStore(sensorListStore);

  const queryClient = useQueryClient();
  const { mutateAsync: startSensing, data: sensorData } = useMutation({
    mutationFn: async (settings: SensingSettingsSchema) => {
      return await createSensorData({
        dataName: settings.dataName,
        groupId: settings.groupId,
        sensors: sensors,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [GET_GROUPED_SENSOR_DATA] });
    },
  });

  const start = async () => {
    if (!settings.isValid) return;

    // 開始前にセンサーデータを作成
    if (state === 'ready') await startSensing(settings.data);

    // TODO: 仮に 200Hz 固定
    await startSensors({ sensors: Object.fromEntries(sensors.map((sensor) => [sensor, 200])) });
    setState('running');
    timerRef.current?.start();
  };

  const pause = () => {
    timerRef.current?.pause();
    setState('paused');
    void stopSensors();
  };

  const complete = () => {
    timerRef.current?.reset();
    setState('ready');
    resetSensingSettings();
    setSensorData(null);
    void stopSensors();
  };

  const reset = () => {
    timerRef.current?.reset();
    setState('ready');
    setSensorData(null);
    void stopSensors();
    if (sensorData) void deleteSensorData(sensorData.id);
  };

  return (
    <div className={styles.control_panel}>
      <Timer ref={timerRef} className={styles.timer} />

      <div className={styles.buttons}>
        <FloatButton onClick={pause} disabled={state !== 'running'}>
          <IconPlayerStopFilled />
        </FloatButton>

        <FloatButton onClick={() => void start()} disabled={state === 'running' || !settings.isValid}>
          <IconPlayerPlayFilled />
        </FloatButton>

        <FloatButton onClick={complete} disabled={state === 'ready'}>
          <IconCheck />
        </FloatButton>

        <AlertDialog
          title={t('pages.sensing.Reset')}
          trigger={
            <FloatButton disabled={state !== 'paused'} as="div">
              <IconArrowBack />
            </FloatButton>
          }
          triggerClassName={styles.trigger}
          danger
          confirmText={t('pages.sensing.Reset')}
          cancelText={t('pages.sensing.Cancel')}
          onConfirm={reset}
        >
          <p>{t('pages.sensing.ResetSensingData')}</p>
        </AlertDialog>
      </div>
    </div>
  );
}
