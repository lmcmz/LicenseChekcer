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
          title: 'License Checker - Audit Open Source Dependencies | Free Compliance Tool',
        },
        {
          name: 'description',
          content: 'Free open source license compliance tool. Scan dependencies, verify licenses, and flag risks automatically. Supports npm, Python, Go, Rust, Maven, and more.',
        },
        {
          name: 'keywords',
          content: 'license checker, open source compliance, dependency audit, license audit, MIT license, Apache license, GPL license, software compliance, npm audit, package audit',
        },
        {
          name: 'author',
          content: 'Outblock',
        },
        {
          name: 'robots',
          content: 'index, follow',
        },
        {
          name: 'googlebot',
          content: 'index, follow',
        },
        // Open Graph tags
        {
          property: 'og:type',
          content: 'website',
        },
        {
          property: 'og:site_name',
          content: 'License Checker',
        },
        {
          property: 'og:title',
          content: 'License Checker - Audit Open Source Dependencies',
        },
        {
          property: 'og:description',
          content: 'Smart license compliance tool that scans dependencies and flags risks automatically. Supports multiple languages and package managers.',
        },
        {
          property: 'og:image',
          content: '/logo.svg',
        },
        {
          property: 'og:image:alt',
          content: 'License Checker Logo',
        },
        {
          property: 'og:url',
          content: 'https://licensecheck.dev',
        },
        // Twitter Card tags
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          name: 'twitter:title',
          content: 'License Checker - Audit Open Source Dependencies',
        },
        {
          name: 'twitter:description',
          content: 'Smart license compliance tool that scans dependencies and flags risks automatically.',
        },
        {
          name: 'twitter:image',
          content: '/logo.svg',
        },
        // Additional meta tags
        {
          name: 'theme-color',
          content: '#000000',
        },
        {
          name: 'application-name',
          content: 'License Checker',
        },
      ],
      links: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/logo.svg' },
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'canonical', href: 'https://licensecheck.dev' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css' },
      ],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'License Checker',
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Web',
            description: 'Free open source license compliance tool. Scan dependencies, verify licenses, and flag risks automatically.',
            url: 'https://licensecheck.dev',
            author: {
              '@type': 'Organization',
              name: 'Outblock',
              url: 'https://outblock.io',
            },
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            featureList: [
              'Dependency scanning',
              'License verification',
              'Risk assessment',
              'Multiple language support',
              'GitHub repository scanning',
            ],
          }),
        },
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
