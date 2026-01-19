import { Outlet, createRootRouteWithContext, useMatches } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import { Amplify } from 'aws-amplify';
import type { AuthResult } from '@/hooks/useAuth';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID,
      loginWith: {
        oauth: {
          domain: import.meta.env.VITE_AWS_LOGIN_DOMAIN,
          scopes: ['openid'],
          redirectSignIn: [import.meta.env.VITE_REDIRECT_URI],
          redirectSignOut: [import.meta.env.VITE_REDIRECT_URI],
          responseType: 'code',
        },
      },
    },
  },
});

interface MyRouterContext {
  queryClient: QueryClient;
  auth: AuthResult;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => {
    const matches = useMatches();
    const selectTab = matches.find((m) => m.staticData?.selectTab !== undefined)?.staticData.selectTab;

    return (
      <>
        <Header />
        <Outlet />
        <TabBar select={selectTab} />
      </>
    );
  },
});
