import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, type AnyRouter } from '@tanstack/react-router';
import { useAuth } from './hooks/useAuth';

export function getTanStackQueryContext() {
  const queryClient = new QueryClient();
  return {
    queryClient,
  };
}

export function TanStackQueryProvider({
  children,
  queryClient,
}: {
  children: React.ReactNode;
  queryClient: QueryClient;
}) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

interface AuthProviderProps {
  router: AnyRouter;
  queryClient: QueryClient;
}

export function AuthProvider({ router, queryClient }: AuthProviderProps) {
  const auth = useAuth();

  if (auth.isLoading) {
    return null;
  }

  return (
    <RouterProvider
      router={router}
      context={{
        queryClient,
        auth,
      }}
    />
  );
}
