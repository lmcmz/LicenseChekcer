import React from 'react';
import {
  HeadContent,
  Scripts,
  Outlet,
  createRootRoute,
} from '@tanstack/react-router';
import '@/styles.css';
import '@/i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from '@vercel/analytics/react';
import { Layout } from '@/components/Layout';

// Create a client for TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const Route = createRootRoute({
  head: () => {
    return {
      meta: [
        {
          charSet: 'utf-8',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          title: 'License Checker - Audit Open Source Dependencies',
        },
        {
          name: 'description',
          content: 'A tool to check and manage open source licenses for your dependencies',
        },
      ],
      links: [
        { rel: 'icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css' },
      ],
    };
  },
  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <Layout>
            <Outlet />
          </Layout>
          <Analytics />
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}
