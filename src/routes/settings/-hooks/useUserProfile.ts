import { USER_PROFILE } from '@/consts/query-key';
import { useQuery } from '@tanstack/react-query';
import { useJwtToken } from '../../../hooks/useJwtToken';
import { client } from '@/api';
import type { components } from '@/api.types.gen';
import { useAuth } from '../../../hooks/useAuth';

export type UserProfile = components['schemas']['GetUserResponse'];

export function useUserProfile() {
  const [getToken, alertDialog] = useJwtToken();
  const { auth } = useAuth();

  const {
    data: userProfile,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [USER_PROFILE, auth.tokens],
    queryFn: async () => {
      const token = getToken(false);
      if (!token) throw new Error('No JWT token found');

      try {
        const res = await client.GET('/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  const isLoggedIn = auth.isAuthSuccess;
  return { userProfile, isLoggedIn, isLoading, refetchUser: refetch, alertDialog };
}
