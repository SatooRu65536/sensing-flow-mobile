import styles from './index.module.scss';
import { TabSelect } from '@/components/TabBar';
import { createFileRoute } from '@tanstack/react-router';
import { getAvailableSensors } from '@satooru65536/tauri-plugin-sensorkit';
import { useTranslation } from 'react-i18next';
import PageLayout from '@/layout/page';
import SectionLayout from '@/layout/section';
import { useQuery } from '@tanstack/react-query';
import ListItem from '@/components/ListItem';
import { entries } from '@/utils';

export const Route = createFileRoute('/sensors/')({
  staticData: {
    selectTab: TabSelect.Sensors,
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const { data: sensors } = useQuery({
    queryKey: ['availableSensors'],
    queryFn: getAvailableSensors,
    staleTime: Infinity,
  });

  return (
    <PageLayout>
      <SectionLayout title={t('titles.BaseSensors')}>
        <div className={styles.sensor_list}>
          {sensors &&
            entries(sensors).map(([sensor, isAvailable]) => (
              <ListItem key={sensor} disabled={!isAvailable} to={`/sensing`} search={{ sensor }}>
                {t(`sensors.${sensor}`)}
              </ListItem>
            ))}
        </div>
      </SectionLayout>
    </PageLayout>
  );
}

export default RouteComponent;
