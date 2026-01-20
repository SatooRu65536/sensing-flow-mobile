import styles from './index.module.scss';
import type { UserProfile } from '@/routes/settings/-hooks/useUserProfile';
import Card from '@/layout/card';
import SectionLayout from '@/layout/section';
import { useTranslation } from 'react-i18next';
import Item from '../Item';
import { formatDateFull } from '@/utils/date';
import LongButton from '@/components/LongButton';
import { useAuth } from '@/hooks/useAuth';
import { IconLogout } from '@tabler/icons-react';

interface UserProfileSectionProps {
  userProfile: UserProfile;
}

export default function UserProfileSection({ userProfile }: UserProfileSectionProps) {
  const { t } = useTranslation();
  const { logout } = useAuth();

  return (
    <SectionLayout title={t('pages.settings.user.title')}>
      <Card>
        <Item label={t('pages.settings.user.userId')} value={userProfile.id} />
        <Item label={t('pages.settings.user.userName')} value={userProfile.name} />
        <Item label={t('pages.settings.user.plan')} value={userProfile.plan} />
        <Item label={t('pages.settings.user.registeredAt')} value={formatDateFull(userProfile.createdAt)} />

        <div className={styles.logout}>
          <LongButton onClick={() => void logout()} icon={<IconLogout />}>
            {t('pages.settings.user.signOut')}
          </LongButton>
        </div>
      </Card>
    </SectionLayout>
  );
}
