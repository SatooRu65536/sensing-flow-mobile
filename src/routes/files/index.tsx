import styles from './index.module.scss';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { TabSelect } from '@/components/TabBar';
import PageLayout from '@/layout/page';
import { useQuery } from '@tanstack/react-query';
import { getGroupedSensorData } from '@satooru65536/tauri-plugin-sensorkit';
import SectionLayout from '@/layout/section';
import { AccordionRoot, AccordionItem } from '@/components/Accordion';
import ListItem from '@/components/ListItem';
import { IconCloudUp, IconCloudOff } from '@tabler/icons-react';
import { formatDate } from '@/utils/date';
import AddNewGroupDialog from '@/routes/files/-components/AddNewGroupDialog';
import { GET_GROUPED_SENSOR_DATA } from '@/consts/query-key';
import DeleteGroupDialog from '@/routes/files/-components/DeleteGroupDialog';

export const Route = createFileRoute('/files/')({
  staticData: {
    selectTab: TabSelect.Files,
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const { data: groupedSensorData } = useQuery({
    queryKey: [GET_GROUPED_SENSOR_DATA],
    queryFn: getGroupedSensorData,
    staleTime: Infinity,
  });

  return (
    <PageLayout className={styles.files}>
      <SectionLayout title={t('pages.files.SavedData')}>
        <AccordionRoot multiple>
          {groupedSensorData?.map((group) => (
            <AccordionItem
              key={group.groupId}
              header={<span>{group.groupName}</span>}
              delete={<DeleteGroupDialog groupId={group.groupId} groupName={group.groupName} />}
            >
              {group.sensorData.map((data) => (
                <ListItem
                  key={data.id}
                  className={styles.list_item}
                  to={`/files/$dataId`}
                  params={{ dataId: data.id.toString() }}
                >
                  {data.synced ? <IconCloudUp /> : <IconCloudOff />}
                  <span className={styles.data_name}>{data.name}</span>
                  <span className={styles.created_at}>{formatDate(data.createdAt)}</span>
                </ListItem>
              ))}
            </AccordionItem>
          ))}
          <AddNewGroupDialog />
        </AccordionRoot>
      </SectionLayout>
    </PageLayout>
  );
}
