import React from 'react';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

export const getRouter = () =>
  createRouter({
    routeTree,
    defaultPreload: 'intent',
  });

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}

export const AppRouterProvider: React.FC = () => {
  const router = React.useMemo(() => getRouter(), []);
  return <RouterProvider router={router} />;
};
