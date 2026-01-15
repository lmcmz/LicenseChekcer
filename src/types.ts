
export enum RiskLevel {
  SAFE = 'Safe',
  CAUTION = 'Caution',
  HIGH = 'High Risk',
  UNKNOWN = 'Unknown'
}

export interface DependencyAudit {
  name: string;
  version: string;
  license: string;
  repository: string;
  riskLevel: RiskLevel;
  reason: string;
  isFriendly: boolean;
  sources?: string[];
  children?: DependencyAudit[];
}

export interface LicenseDetail {
  id: string;
  name: string;
  permissiveness: number; // 0-100
  description: { en: string; zh: string };
  bestFor: { en: string; zh: string };
  permissions: {
    commercial: boolean;
    modification: boolean;
    distribution: boolean;
    sublicense: boolean;
  };
  conditions: {
    notice: boolean;
    sameLicense: boolean;
  };
  limitations: {
    liability: boolean;
    warranty: boolean;
  };
}

export interface AuditSummary {
  total: number;
  safe: number;
  caution: number;
  highRisk: number;
  unknown: number;
}
