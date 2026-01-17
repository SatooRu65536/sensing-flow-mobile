import { TabSelect } from '@/components/TabBar';
import { createFileRoute, useSearch } from '@tanstack/react-router';
import { SensorNames } from '@satooru65536/tauri-plugin-sensorkit';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod';
import PageLayout from '@/layout/page';
import SectionLayout from '@/layout/section';
import { useTranslation } from 'react-i18next';
import SensingSettings from './-components/SensingSettings';
import ControlPanel from './-components/ControlPanel';
import SensorValueSelector from './-components/SensorValueSelector';

const SearchSchema = z.object({
  sensor: z.enum(SensorNames).or(z.number()).optional().catch(undefined),
  groupId: z.coerce.number().optional().catch(undefined),
  sync: z.coerce.boolean().optional().catch(undefined),
  realTime: z.coerce.boolean().optional().catch(undefined),
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
  const { sensor, groupId, sync, realTime } = useSearch({ from: '/sensing/' });

  return (
    <PageLayout>
      <SectionLayout title={t('pages.sensing.Sensing')} center>
        <SensingSettings
          defaultSensor={sensor}
          defaultGroupId={groupId}
          defaultSync={sync}
          defaultRealTime={realTime}
        />
        <ControlPanel />
        <SensorValueSelector />
      </SectionLayout>
    </PageLayout>
  );
}
