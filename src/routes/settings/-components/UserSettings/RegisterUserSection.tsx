import styles from './index.module.scss';
import { useStore } from '@tanstack/react-store';
import type { components } from '@/api.types.gen';
import Card from '@/layout/card';
import SectionLayout from '@/layout/section';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Store } from '@tanstack/store';
import { useTranslation } from 'react-i18next';
import { client } from '@/api';
import { USER_PROFILE } from '@/consts/query-key';
import Input from '@/components/Input';
import LongButton from '@/components/LongButton';
import { authHeader } from '@/utils/auth-header';
import { useJwtToken } from '@/hooks/useJwtToken';

type CreateUserRequest = components['schemas']['CreateUserRequest'];
const initValue: CreateUserRequest = {
  name: '',
  plan: 'guest',
};
const formStore = new Store<CreateUserRequest>(initValue);
const setFormValue = (value: Partial<CreateUserRequest>) => {
  formStore.setState((old) => ({ ...old, ...value }));
};

export default function RegisterUserSection() {
  const { t } = useTranslation();
  const formValue = useStore(formStore);
  const [getToken] = useJwtToken();

  const queryClient = useQueryClient();
  const {
    mutateAsync: createUser,
    isPending,
    error,
  } = useMutation({
    mutationFn: async () => {
      try {
        if (formValue.name === '') throw new Error(t('pages.settings.user.pleaseInputUserName'));
        const token = await getToken(true);
        if (!token) throw new Error('No JWT token found');

        const res = await client.POST('/users', {
          body: {
            name: formValue.name,
            plan: formValue.plan,
          },
          headers: authHeader(token),
        });
        if (res.response.status !== 201) throw new Error(t('pages.settings.user.failedToRegisterUser'));
      } catch (error) {
        console.error('ユーザー登録エラー:', error);
        throw error;
      }
    },
    onSuccess: async () => {
      formStore.setState(() => initValue);
      await queryClient.invalidateQueries({ queryKey: [USER_PROFILE] });
    },
  });

  return (
    <SectionLayout title={t('pages.settings.user.title')}>
      <Card className={styles.card}>
        <p>{t('pages.settings.user.pleaseRegister')}</p>
        <Input
          onChange={(e) => {
            setFormValue({ name: e.target.value });
          }}
          placeholder={t('pages.settings.user.userName')}
          required
          value={formValue.name}
        />
        {error && <p className={styles.error}>{error.message}</p>}
        <LongButton onClick={() => void createUser()} disabled={isPending}>
          {t('pages.settings.user.register')}
        </LongButton>
      </Card>
    </SectionLayout>
  );
}
