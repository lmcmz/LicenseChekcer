import { createFileRoute } from '@tanstack/react-router';
import { ApiReferenceReact } from '@scalar/api-reference-react';
import '@scalar/api-reference-react/style.css';

export const Route = createFileRoute('/api')({
  component: ApiDocsPage,
});

function ApiDocsPage() {
  return (
    <div className="min-h-screen">
      <ApiReferenceReact
        configuration={{
          spec: {
            url: '/openapi.json',
          },
          darkMode: true,
          theme: 'purple',
          layout: 'modern',
          showSidebar: true,
        }}
      />
    </div>
  );
}
