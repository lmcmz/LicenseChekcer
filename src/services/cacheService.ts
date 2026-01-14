
import { DependencyAudit } from "../types";

// TODO: Implement database-backed caching
// localStorage has been removed to support SSR and use database instead

export const getAuditCache = (): Record<string, DependencyAudit> => {
  // Return empty cache for now - will be replaced with database query
  return {};
};

export const saveToCache = (audit: DependencyAudit) => {
  // No-op for now - will be replaced with database insert
  console.log('Cache save disabled - TODO: implement database storage');
};

export const getFromCache = (name: string, version: string): DependencyAudit | null => {
  // Return null for now - will be replaced with database query
  return null;
};
