import { TabSelect } from '@/components/TabBar';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/settings/')({
  staticData: {
    selectTab: TabSelect.Settings,
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <main>Not implemented yet</main>;
}
