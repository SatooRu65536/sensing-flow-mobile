import { TabSelect } from '@/components/TabBar';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/logging/')({
  staticData: {
    selectTab: TabSelect.Logging,
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <main>Not implemented yet</main>;
}
