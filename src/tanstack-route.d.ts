import type { TabSelect } from './components/TabBar';

declare module '@tanstack/react-router' {
  interface StaticDataRouteOption {
    selectTab?: TabSelect;
  }
}
