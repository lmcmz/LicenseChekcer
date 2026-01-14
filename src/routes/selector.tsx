import { createFileRoute } from '@tanstack/react-router';
import LicenseSelector from '@/components/LicenseSelector';

export const Route = createFileRoute('/selector')({
  component: Selector,
});

function Selector() {
  return <LicenseSelector />;
}
