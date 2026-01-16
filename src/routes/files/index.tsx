import { createFileRoute } from '@tanstack/react-router';
// import { useTranslation } from 'react-i18next';
import Files from '@/components/Files';
import { TabSelect } from '@/components/TabBar';

export const Route = createFileRoute('/files/')({
  staticData: {
    selectTab: TabSelect.Files,
  },
  component: App,
});

function App() {
  // const { t } = useTranslation();

  return (
    <main className="container">
      <Files />
    </main>
  );
}
