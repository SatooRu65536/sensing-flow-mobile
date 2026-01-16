import { Outlet, createRootRouteWithContext, useMatches } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';

interface MyRouterContext {
  queryClient: QueryClient;
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
