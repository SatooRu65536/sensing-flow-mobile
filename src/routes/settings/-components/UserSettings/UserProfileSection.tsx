import type { UserProfile } from '@/hooks/useUserProfile';
import Card from '@/layout/card';
import SectionLayout from '@/layout/section';
import { useTranslation } from 'react-i18next';
import Item from '../Item';
import { formatDateFull } from '@/utils/date';
import LongButton from '@/components/LongButton';
import { signOut } from 'aws-amplify/auth';

interface UserProfileSectionProps {
  userProfile: UserProfile;
}

export default function UserProfileSection({ userProfile }: UserProfileSectionProps) {
  const { t } = useTranslation();

  return (
    <SectionLayout title={t('pages.settings.user.title')}>
      <Card>
        <Item label={t('pages.settings.user.userId')} value={userProfile.id} />
        <Item label={t('pages.settings.user.userName')} value={userProfile.name} />
        <Item label={t('pages.settings.user.plan')} value={userProfile.plan} />
        <Item label={t('pages.settings.user.registeredAt')} value={formatDateFull(userProfile.createdAt)} />
        <LongButton onClick={() => void signOut()}>{t('pages.settings.user.signOut')}</LongButton>
      </Card>
    </SectionLayout>
  );
}
