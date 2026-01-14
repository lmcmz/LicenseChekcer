
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DependencyAudit, RiskLevel } from '../types';
import { Globe, ArrowUp, ArrowDown, Github } from 'lucide-react';

interface AuditTableProps {
  audits: DependencyAudit[];
}

type SortKey = 'name' | 'license' | 'risk';
type SortOrder = 'asc' | 'desc';

const RISK_SCORE = {
  [RiskLevel.HIGH]: 3,
  [RiskLevel.CAUTION]: 2,
  [RiskLevel.SAFE]: 1,
  [RiskLevel.UNKNOWN]: 0
};

const AuditTable: React.FC<AuditTableProps> = ({ audits }) => {
  const { t } = useTranslation();
  const [sortKey, setSortKey] = useState<SortKey>('risk');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const sortedAudits = useMemo(() => {
    return [...audits].sort((a, b) => {
      let comparison = 0;
      if (sortKey === 'name') comparison = a.name.localeCompare(b.name);
      if (sortKey === 'license') comparison = a.license.localeCompare(b.license);
      if (sortKey === 'risk') comparison = RISK_SCORE[a.riskLevel] - RISK_SCORE[b.riskLevel];
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [audits, sortKey, sortOrder]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const isGitHub = (url: string) => url.toLowerCase().includes('github.com');

  const getSafeHostname = (urlString: string) => {
    try {
      const url = new URL(urlString);
      return url.hostname.replace('www.', '');
    } catch (e) {
      return urlString;
    }
  };

  const getRiskLabel = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.SAFE: return t('risks.safe');
      case RiskLevel.CAUTION: return t('risks.caution');
      case RiskLevel.HIGH: return t('risks.high');
      default: return t('risks.unknown');
    }
  };

  if (audits.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0A0A] shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 dark:bg-white/[0.02] border-b border-slate-200 dark:border-white/10">
          <tr>
            <th 
              className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-black dark:hover:text-white transition-colors"
              onClick={() => toggleSort('name')}
            >
              <div className="flex items-center gap-1">
                {t('table.dependency')} {sortKey === 'name' && (sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
              </div>
            </th>
            <th 
              className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-black dark:hover:text-white transition-colors"
              onClick={() => toggleSort('license')}
            >
              <div className="flex items-center gap-1">
                {t('table.license')} {sortKey === 'license' && (sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
              </div>
            </th>
            <th 
              className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-black dark:hover:text-white transition-colors"
              onClick={() => toggleSort('risk')}
            >
              <div className="flex items-center gap-1">
                {t('table.risk')} {sortKey === 'risk' && (sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
              </div>
            </th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('table.assessment')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
          {sortedAudits.map((item, idx) => (
            <tr key={`${item.name}-${idx}`} className="group hover:bg-slate-50 dark:hover:bg-white/[0.01] transition-colors">
              <td className="px-6 py-5">
                <div className="font-bold text-xs text-black dark:text-white">{item.name}</div>
                <div className="text-[9px] text-slate-400 font-mono mt-0.5">v{item.version}</div>
              </td>
              <td className="px-6 py-5">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5">
                  {item.license}
                </span>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${
                     item.riskLevel === RiskLevel.SAFE ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' :
                     item.riskLevel === RiskLevel.CAUTION ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]'
                   }`} />
                   <span className={`text-[10px] font-black uppercase tracking-tight ${
                     item.riskLevel === RiskLevel.SAFE ? 'text-emerald-600 dark:text-emerald-400' :
                     item.riskLevel === RiskLevel.CAUTION ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
                   }`}>{getRiskLabel(item.riskLevel)}</span>
                </div>
              </td>
              <td className="px-6 py-5">
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mb-3">
                  {item.reason}
                </p>
                <div className="flex flex-wrap gap-3">
                  {item.repository && (
                    <a 
                      href={item.repository} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[10px] font-bold text-blue-500 hover:text-blue-600 transition-colors uppercase"
                    >
                      {isGitHub(item.repository) ? <Github className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
                      {getSafeHostname(item.repository)}
                    </a>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditTable;
