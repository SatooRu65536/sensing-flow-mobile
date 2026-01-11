import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { TanStackQueryProvider, getTanStackQueryContext } from './root-provider';
import { routeTree } from './routeTree.gen';
import './styles.css';
import './i18n';

const TanStackQueryProviderContext = getTanStackQueryContext();
const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,
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
        <RouterProvider router={router} />
      </TanStackQueryProvider>
    </StrictMode>,
  );
}
