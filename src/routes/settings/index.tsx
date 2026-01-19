import { TabSelect } from '@/components/TabBar';
import PageLayout from '@/layout/page';
import { createFileRoute } from '@tanstack/react-router';
import UserSettings from './-components/UserSettings';

export const Route = createFileRoute('/settings/')({
  staticData: {
    selectTab: TabSelect.Settings,
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageLayout>
      <UserSettings />
    </PageLayout>
  );
}
