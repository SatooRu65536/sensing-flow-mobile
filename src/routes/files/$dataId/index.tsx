import { TabSelect } from '@/components/TabBar';
import PageLayout from '@/layout/page';
import { createFileRoute, useParams } from '@tanstack/react-router';

export const Route = createFileRoute('/files/$dataId/')({
  staticData: {
    selectTab: TabSelect.Files,
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { dataId } = useParams({ from: '/files/$dataId/' });
  return <PageLayout>dataId: {dataId}</PageLayout>;
}
