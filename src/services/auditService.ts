import { DependencyAudit } from '../types';

interface AuditResponse {
  success: boolean;
  data?: DependencyAudit[];
  cached?: boolean;
  cachedCount?: number;
  newCount?: number;
  error?: string;
}

export const auditDependenciesWithBackend = async (
  dependencies: { name: string; version: string }[]
): Promise<DependencyAudit[]> => {
  if (dependencies.length === 0) return [];

  try {
    const response = await fetch('/api/audit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dependencies }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: AuditResponse = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to audit dependencies');
    }

    return result.data || [];
  } catch (error) {
    console.error('Audit error:', error);
    throw error;
  }
};
