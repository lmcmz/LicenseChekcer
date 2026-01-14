
import React from 'react';
import { DependencyAudit, RiskLevel } from '../types';

interface SummaryCardsProps {
  audits: DependencyAudit[];
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ audits }) => {
  const stats = audits.reduce((acc, curr) => {
    if (curr.riskLevel === RiskLevel.SAFE) acc.safe++;
    else if (curr.riskLevel === RiskLevel.CAUTION) acc.caution++;
    else if (curr.riskLevel === RiskLevel.HIGH) acc.high++;
    else acc.unknown++;
    return acc;
  }, { safe: 0, caution: 0, high: 0, unknown: 0 });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: "Total Inspected", val: audits.length, color: "text-black dark:text-white" },
        { label: "Safe", val: stats.safe, color: "text-emerald-500", border: "border-emerald-500/20" },
        { label: "At Risk", val: stats.high + stats.caution, color: "text-rose-500", border: "border-rose-500/20" },
        { label: "Compliance Rate", val: audits.length ? `${Math.round((stats.safe / audits.length) * 100)}%` : '0%', color: "text-blue-500", border: "border-blue-500/20" }
      ].map((card, i) => (
        <div key={i} className={`bg-white dark:bg-[#0A0A0A] p-5 rounded-xl border border-slate-200 dark:border-white/10`}>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{card.label}</p>
          <p className={`text-2xl font-black ${card.color} tracking-tighter`}>{card.val}</p>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
