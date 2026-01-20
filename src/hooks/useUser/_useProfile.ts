import { useQuery } from '@tanstack/react-query';
import { USER_PROFILE } from '@/consts/query-key';
import { authHeader } from '@/utils/auth-header';
import { client } from '@/api';
import type { AuthStore } from './types/auth';

interface UseProfileProps {
  auth: AuthStore;
}

export function useProfile({ auth }: UseProfileProps) {
  return useQuery({
    queryKey: [USER_PROFILE, auth.tokens],
    queryFn: async () => {
      const token = auth.tokens?.access_token;
      if (!token) throw new Error('No JWT token found');

      try {
        const res = await client.GET('/users/me', {
          headers: authHeader(token),
        });
        if (res.data == undefined) throw new Error('User profile not found');
        return res.data;
      } catch (e) {
        console.error(e);
        throw e;
      }
    },
    staleTime: 1000 * 60 * 5, // 5分間
    retry: false,
  });
}
