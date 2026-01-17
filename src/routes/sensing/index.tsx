import { TabSelect } from '@/components/TabBar';
import { createFileRoute, useSearch } from '@tanstack/react-router';
import { SensorNames } from '@satooru65536/tauri-plugin-sensorkit';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod';
import PageLayout from '@/layout/page';
import SectionLayout from '@/layout/section';
import { useTranslation } from 'react-i18next';
import SensingConfig from '@/components/SensingConfig';

const SearchSchema = z.object({
  sensor: z.enum(SensorNames).optional().catch(undefined),
});

export const Route = createFileRoute('/sensing/')({
  staticData: {
    selectTab: TabSelect.Sensing,
  },
  validateSearch: zodValidator(SearchSchema),
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const { sensor } = useSearch({ from: '/sensing/' });

  return (
    <PageLayout>
      <SectionLayout title={t('pages.sensing.Sensing')} center>
        <SensingConfig defaultSensor={sensor} />
      </SectionLayout>
    </PageLayout>
  );
}
