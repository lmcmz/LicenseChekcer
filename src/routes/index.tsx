import { createFileRoute } from '@tanstack/react-router';
import AuditView from '@/components/AuditView';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return <AuditView />;
}
