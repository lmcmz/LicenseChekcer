
import React, { useState } from 'react';
import { 
  Check, 
  X, 
  BarChart3, 
  Scale, 
  Shield,
  FileText
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LICENSE_DETAILS } from '../services/localDatabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const LicenseGuide: React.FC = () => {
  const { t, i18n: i18nInstance } = useTranslation();
  const [activeTab, setActiveTab] = useState<'details' | 'comparison' | 'stats'>('details');

  const chartData = LICENSE_DETAILS.map(l => ({
    name: l.id,
    score: l.permissiveness,
    color: l.permissiveness > 80 ? '#3b82f6' : l.permissiveness > 60 ? '#8b5cf6' : l.permissiveness > 40 ? '#ec4899' : '#ef4444'
  }));

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 animate-in fade-in duration-500">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-black dark:text-white mb-3 tracking-tighter">{t('guide.title')}</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-xl">
          {t('guide.desc')}
        </p>
      </div>

      {/* Tabs - Resend Style */}
      <div className="flex border-b border-slate-200 dark:border-white/10 mb-10 overflow-x-auto no-scrollbar">
        {[
          { id: 'details', label: t('guide.tabs.details'), icon: <FileText className="w-3.5 h-3.5" /> },
          { id: 'comparison', label: t('guide.tabs.comparison'), icon: <Scale className="w-3.5 h-3.5" /> },
          { id: 'stats', label: t('guide.tabs.stats'), icon: <BarChart3 className="w-3.5 h-3.5" /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 text-xs font-bold flex items-center gap-2 transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.id 
              ? 'border-black dark:border-white text-black dark:text-white' 
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'details' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LICENSE_DETAILS.map(lic => (
            <div key={lic.id} className="bg-white dark:bg-[#0A0A0A] p-6 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-black dark:hover:border-white/40 transition-all flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-black dark:text-white">{lic.name}</h3>
                <div
                  className={`w-2 h-2 rounded-full`}
                  style={{
                    backgroundColor: lic.permissiveness > 80 ? '#3b82f6' : lic.permissiveness > 60 ? '#8b5cf6' : lic.permissiveness > 40 ? '#ec4899' : '#ef4444'
                  }}
                />
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs mb-6 leading-relaxed flex-grow font-medium">
                {lic.description[i18nInstance.language as 'en' | 'zh']}
              </p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <span className="text-[9px] font-black text-slate-400 uppercase block mb-1.5">{t('guide.details.canDo')}</span>
                     <div className="space-y-1">
                        {lic.permissions.commercial && <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">{t('guide.details.commercial')}</div>}
                        {lic.permissions.modification && <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">{t('guide.details.modification')}</div>}
                     </div>
                   </div>
                   <div>
                     <span className="text-[9px] font-black text-slate-400 uppercase block mb-1.5">{t('guide.details.mustDo')}</span>
                     <div className="space-y-1">
                        {lic.conditions.notice && <div className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">{t('guide.details.notice')}</div>}
                        {lic.conditions.sameLicense && <div className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">{t('guide.details.shareSource')}</div>}
                     </div>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'comparison' && (
        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-white/[0.02] border-b border-slate-200 dark:border-white/10">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">{t('guide.table.license')}</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">{t('guide.table.comm')}</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">{t('guide.table.modify')}</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">{t('guide.table.copyleft')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {LICENSE_DETAILS.map(lic => (
                <tr key={lic.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.01] transition-colors">
                  <td className="px-6 py-4 font-bold text-black dark:text-white text-xs">{lic.id}</td>
                  <td className="px-6 py-4">{lic.permissions.commercial ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-rose-500" />}</td>
                  <td className="px-6 py-4">{lic.permissions.modification ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-rose-500" />}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${lic.conditions.sameLicense ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' : 'text-slate-400'}`}>
                      {lic.conditions.sameLicense ? t('guide.table.required') : t('guide.table.none')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="bg-white dark:bg-[#0A0A0A] p-8 rounded-2xl border border-slate-200 dark:border-white/10 h-[500px]">
          <div className="mb-8">
            <h3 className="text-lg font-bold text-black dark:text-white mb-1">{t('guide.stats.title')}</h3>
            <p className="text-xs text-slate-500 font-medium">{t('guide.stats.desc')}</p>
          </div>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={chartData} layout="vertical">
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '10px' }}
              />
              <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default LicenseGuide;
