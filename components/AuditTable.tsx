
import React from 'react';
import { DependencyAudit, RiskLevel } from '../types';
import { Globe, ArrowUpRight } from 'lucide-react';

interface AuditTableProps {
  audits: DependencyAudit[];
}

const getRiskColor = (level: RiskLevel) => {
  switch (level) {
    case RiskLevel.SAFE: return 'text-emerald-500 bg-emerald-500/10';
    case RiskLevel.CAUTION: return 'text-amber-500 bg-amber-500/10';
    case RiskLevel.HIGH: return 'text-rose-500 bg-rose-500/10';
    default: return 'text-slate-500 bg-slate-500/10';
  }
};

const getSafeHostname = (urlString: string) => {
  try {
    const url = new URL(urlString);
    return url.hostname;
  } catch (e) {
    return urlString;
  }
};

const AuditTable: React.FC<AuditTableProps> = ({ audits }) => {
  if (audits.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0A0A]">
      <table className="w-full text-left">
        <thead className="bg-slate-50 dark:bg-white/[0.02] border-b border-slate-200 dark:border-white/10">
          <tr>
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dependency</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">License</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Assessment</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
          {audits.map((item, idx) => (
            <tr key={`${item.name}-${idx}`} className="group hover:bg-slate-50 dark:hover:bg-white/[0.01] transition-colors">
              <td className="px-6 py-5">
                <div className="font-bold text-xs text-black dark:text-white">{item.name}</div>
                <div className="text-[9px] text-slate-400 font-mono mt-0.5">v{item.version}</div>
              </td>
              <td className="px-6 py-5">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400">
                  {item.license}
                </span>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-2">
                   <div className={`w-1.5 h-1.5 rounded-full ${
                     item.riskLevel === RiskLevel.SAFE ? 'bg-emerald-500' :
                     item.riskLevel === RiskLevel.CAUTION ? 'bg-amber-500' : 'bg-rose-500'
                   }`} />
                   <span className="text-[10px] font-bold text-slate-500 uppercase">{item.riskLevel}</span>
                </div>
              </td>
              <td className="px-6 py-5">
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mb-2">
                  {item.reason}
                </p>
                {item.sources && item.sources.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.sources.slice(0, 2).map((url, i) => {
                      const isUrl = url.startsWith('http');
                      return (
                        <a 
                          key={i} 
                          href={isUrl ? url : '#'} 
                          target={isUrl ? "_blank" : undefined}
                          className="flex items-center gap-1 text-[9px] text-blue-500 hover:underline"
                        >
                          <Globe className="w-3 h-3" /> {getSafeHostname(url)}
                        </a>
                      );
                    })}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditTable;
