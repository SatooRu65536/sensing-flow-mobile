import Card from '@/layout/card';
import SectionLayout from '@/layout/section';
import { useTranslation } from 'react-i18next';

export default function RegisterUserSection() {
  const { t } = useTranslation();

  return (
    <SectionLayout title={t('pages.settings.user.title')}>
      <Card>{/* TODO: ユーザー登録フォーム */}</Card>
    </SectionLayout>
  );
}
