import { Outlet, createRootRouteWithContext, useMatches } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import { tokenManager } from '@/lib/tokenManager';
import { setTokens } from '@/hooks/useUser/stores/auth';

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    const storedTokens = await tokenManager.getTokens();
    if (storedTokens) setTokens(storedTokens);
  },
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
