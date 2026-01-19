import { AUTH_SESSION } from '@/consts/query-key';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

export const useAuth = () => {
  return useQuery({
    queryKey: [AUTH_SESSION],
    queryFn: async () => {
      const user = await getCurrentUser();
      const session = await fetchAuthSession();

      return {
        user,
        session,
        idToken: session.tokens?.idToken?.toString(),
      };
    },
    staleTime: 1000 * 60 * 5, // 5分間
    retry: false,
  });
};
export type AuthResult = ReturnType<typeof useAuth>;
