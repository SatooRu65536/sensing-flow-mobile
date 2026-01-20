import LongButton from '@/components/LongButton';
import { useUser } from '@/hooks/useUser';
import Card from '@/layout/card';
import SectionLayout from '@/layout/section';
import { IconLogin } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

export default function SignInSection() {
  const { t } = useTranslation();
  const { login } = useUser();

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
