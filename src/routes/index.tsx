import { createFileRoute } from '@tanstack/react-router';
import { TabSelect } from '@/components/TabBar';
import SensorsRouteComponent from './sensors';

export const Route = createFileRoute('/')({
  staticData: {
    selectTab: TabSelect.Sensors,
  },
  component: SensorsRouteComponent,
});
