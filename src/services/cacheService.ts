
import { DependencyAudit } from "../types";

const CACHE_KEY = 'licenseguard_audit_cache_v1';

export const getAuditCache = (): Record<string, DependencyAudit> => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : {};
  } catch (e) {
    console.error("Failed to load audit cache", e);
    return {};
  }
};

export const saveToCache = (audit: DependencyAudit) => {
  try {
    const cache = getAuditCache();
    const key = `${audit.name.toLowerCase()}@${audit.version}`;
    cache[key] = audit;
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error("Failed to save to audit cache", e);
  }
};

export const getFromCache = (name: string, version: string): DependencyAudit | null => {
  const cache = getAuditCache();
  const key = `${name.toLowerCase()}@${version}`;
  return cache[key] || null;
};
