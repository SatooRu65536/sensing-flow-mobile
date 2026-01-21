import { TabSelect } from '@/components/TabBar';
import { createFileRoute } from '@tanstack/react-router';
import { SensorNames } from '@satooru65536/tauri-plugin-sensorkit';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod';
import PageLayout from '@/layout/page';
import SectionLayout from '@/layout/section';
import { useTranslation } from 'react-i18next';
import SensingSettings from './-components/SensingSettings';
import ControlPanel from './-components/ControlPanel';
import SensorValueSelector from './-components/SensorValueSelector';
import { setSensingSettings } from './-stores/sensing-settings';

const SearchSchema = z.object({
  sensor: z.enum(SensorNames).or(z.number()).optional().catch(undefined),
  groupId: z.coerce.number().optional().catch(undefined),
  autoSync: z.coerce.boolean().optional().catch(undefined),
  realTimeShare: z.coerce.boolean().optional().catch(undefined),
});

export const Route = createFileRoute('/sensing/')({
  staticData: {
    selectTab: TabSelect.Sensing,
  },
  validateSearch: zodValidator(SearchSchema),
  beforeLoad: ({ search }) => setSensingSettings(search),
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <PageLayout>
      <SectionLayout title={t('pages.sensing.Sensing')} center>
        <SensingSettings />
        <ControlPanel />
        <SensorValueSelector />
      </SectionLayout>
    </PageLayout>
  );
}
