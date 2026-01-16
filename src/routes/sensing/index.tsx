import { TabSelect } from '@/components/TabBar';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/sensing/')({
  staticData: {
    selectTab: TabSelect.Sensing,
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <main>Not implemented yet</main>;
}
