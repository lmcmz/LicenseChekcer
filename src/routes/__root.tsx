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
        {
          property: 'og:title',
          content: 'License Checker - Audit Open Source Dependencies',
        },
        {
          property: 'og:description',
          content: 'Smart license compliance tool that scans dependencies and flags risks automatically',
        },
        {
          property: 'og:image',
          content: '/logo.svg',
        },
      ],
      links: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/logo.svg' },
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css' },
      ],
    };
  },
  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('licensechecker_theme') || 'dark';
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                  document.body.classList.add('dark');
                }
              })();
            `,
          }}
        />
        <HeadContent />
      </head>
      <body className="dark">
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
