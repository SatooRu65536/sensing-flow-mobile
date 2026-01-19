import LongButton from '@/components/LongButton';
import Card from '@/layout/card';
import SectionLayout from '@/layout/section';
import { IconLogin } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { openAuth } from '@satooru65536/tauri-plugin-auth-cognito';
import { getOpenAuthPayload } from '@/utils/auth';

export default function SignInSection() {
  const { t } = useTranslation();

  return (
    <SectionLayout title={t('pages.settings.user.title')}>
      <Card>
        <LongButton onClick={() => void openAuth(getOpenAuthPayload({ codeChallenge: '12' }))} icon={<IconLogin />}>
          {t('pages.settings.user.signUpOrLogIn')}
        </LongButton>
      </Card>
    </SectionLayout>
  );
}
