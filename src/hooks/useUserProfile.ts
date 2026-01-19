import { USER_PROFILE } from '@/consts/query-key';
import { useQuery } from '@tanstack/react-query';
import { useJwtToken } from './useJwtToken';
import { client } from '@/api';
import type { FileRouteTypes } from '@/routeTree.gen';
import type { components } from '@/api.types.gen';
import { useRouteContext } from '@tanstack/react-router';

interface UseUserInfoProps {
  from: FileRouteTypes['id'];
}

export type UserProfile = components['schemas']['GetUserResponse'];

export function useUserProfile({ from }: UseUserInfoProps) {
  const [getToken, alertDialog] = useJwtToken({ from });
  const { auth } = useRouteContext({ from });

  const isLoggedIn = auth.data !== undefined;

  const {
    data: userProfile,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [USER_PROFILE],
    queryFn: async () => {
      const token = getToken();
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

  return { userProfile, isLoggedIn, isLoading, refetchUser: refetch, alertDialog };
}
