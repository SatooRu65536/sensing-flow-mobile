import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { createRouter } from '@tanstack/react-router';
import { AuthProvider, TanStackQueryProvider, getTanStackQueryContext } from './root-provider';
import { routeTree } from './routeTree.gen';
import './styles/globals.scss';
import './i18n';

const TanStackQueryProviderContext = getTanStackQueryContext();
const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,
    auth: undefined!,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('app');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <TanStackQueryProvider {...TanStackQueryProviderContext}>
        <AuthProvider router={router} queryClient={TanStackQueryProviderContext.queryClient} />
      </TanStackQueryProvider>
    </StrictMode>,
  );
}
