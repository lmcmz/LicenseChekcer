import { createFileRoute } from '@tanstack/react-router';
import LicenseGuide from '@/components/LicenseGuide';

export const Route = createFileRoute('/guide')({
  component: Guide,
});

function Guide() {
  return <LicenseGuide />;
}
