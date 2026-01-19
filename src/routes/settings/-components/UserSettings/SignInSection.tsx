import LongButton from '@/components/LongButton';
import { useAuth } from '@/hooks/useAuth';
import Card from '@/layout/card';
import SectionLayout from '@/layout/section';
import { IconLogin } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

export default function SignInSection() {
  const { t } = useTranslation();
  const { login } = useAuth();

  return (
    <SectionLayout title={t('pages.settings.user.title')}>
      <Card>
        <LongButton onClick={() => void login()} icon={<IconLogin />}>
          {t('pages.settings.user.signUpOrLogIn')}
        </LongButton>
      </Card>
    </SectionLayout>
  );
}
