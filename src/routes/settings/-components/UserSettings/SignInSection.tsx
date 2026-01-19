import LongButton from '@/components/LongButton';
import Card from '@/layout/card';
import SectionLayout from '@/layout/section';
import { IconLogin } from '@tabler/icons-react';
import { signInWithRedirect } from 'aws-amplify/auth';
import { useTranslation } from 'react-i18next';

export default function SignInSection() {
  const { t } = useTranslation();

  return (
    <SectionLayout title={t('pages.settings.user.title')}>
      <Card>
        <LongButton onClick={() => void signInWithRedirect()} icon={<IconLogin />}>
          {t('pages.settings.user.signUpOrLogIn')}
        </LongButton>
      </Card>
    </SectionLayout>
  );
}
