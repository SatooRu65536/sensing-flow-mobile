import { TabSelect } from '@/components/TabBar';
import { createFileRoute, useSearch } from '@tanstack/react-router';
import { SensorNames } from '@satooru65536/tauri-plugin-sensorkit';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod';

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
  const { sensor } = useSearch({ from: '/sensing/' });
  return <main>Not implemented yet. use sensor: {sensor}</main>;
}
