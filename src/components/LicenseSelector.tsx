
import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  Info,
  ShieldCheck,
  Zap,
  Lock,
  Globe,
  Settings2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LICENSE_DETAILS } from '../services/localDatabase';

interface Criterion {
  id: string;
  labelKey: string;
  descKey: string;
  icon: React.ReactNode;
}

const CRITERIA: Criterion[] = [
  { 
    id: 'permissive', 
    labelKey: 'selector.criteria.permissive.label', 
    descKey: 'selector.criteria.permissive.desc', 
    icon: <Globe className="w-4 h-4" /> 
  },
  { 
    id: 'copyleft', 
    labelKey: 'selector.criteria.copyleft.label', 
    descKey: 'selector.criteria.copyleft.desc', 
    icon: <Lock className="w-4 h-4" /> 
  },
  { 
    id: 'patent', 
    labelKey: 'selector.criteria.patent.label', 
    descKey: 'selector.criteria.patent.desc', 
    icon: <ShieldCheck className="w-4 h-4" /> 
  },
  { 
    id: 'saas', 
    labelKey: 'selector.criteria.saas.label', 
    descKey: 'selector.criteria.saas.desc', 
    icon: <Zap className="w-4 h-4" /> 
  },
  { 
    id: 'attribution', 
    labelKey: 'selector.criteria.attribution.label', 
    descKey: 'selector.criteria.attribution.desc', 
    icon: <Info className="w-4 h-4" /> 
  }
];

const LicenseSelector: React.FC = () => {
  const { t } = useTranslation();
  const [selectedCriteria, setSelectedCriteria] = useState<string[]>([]);

  const toggleCriterion = (id: string) => {
    setSelectedCriteria(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const recommendations = useMemo(() => {
    return LICENSE_DETAILS.map(lic => {
      let score = 0;
      let reasonKeys: string[] = [];

      if (selectedCriteria.includes('permissive')) {
        if (!lic.conditions.sameLicense) {
          score += 40;
          reasonKeys.push("selector.reasons.proprietary");
        }
      }

      if (selectedCriteria.includes('copyleft')) {
        if (lic.conditions.sameLicense) {
          score += 40;
          reasonKeys.push("selector.reasons.stayFree");
        }
      }

      if (selectedCriteria.includes('patent')) {
        if (lic.id === 'Apache-2.0' || lic.id === 'MPL-2.0' || lic.id === 'EPL-2.0') {
          score += 30;
          reasonKeys.push("selector.reasons.patentGrant");
        }
      }

      if (selectedCriteria.includes('saas')) {
        if (lic.id === 'AGPL-3.0') {
          score += 50;
          reasonKeys.push("selector.reasons.saasEnforce");
        }
      }

      if (selectedCriteria.includes('attribution')) {
        if (lic.conditions.notice) {
          score += 20;
          reasonKeys.push("selector.reasons.keepNotice");
        }
      }

      return { ...lic, score, reasonKeys };
    })
    .filter(lic => lic.score > 0)
    .sort((a, b) => b.score - a.score);
  }, [selectedCriteria]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 animate-in fade-in duration-500">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-black dark:text-white mb-3 tracking-tighter">{t('selector.title')}</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-xl">
          {t('selector.desc')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Criteria List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center gap-2 mb-6">
            <Settings2 className="w-4 h-4 text-black dark:text-white" />
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">{t('selector.priorities')}</h2>
          </div>
          {CRITERIA.map(item => (
            <button
              key={item.id}
              onClick={() => toggleCriterion(item.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedCriteria.includes(item.id)
                ? 'bg-black dark:bg-white border-black dark:border-white text-white dark:text-black shadow-lg scale-[1.02]'
                : 'bg-white dark:bg-[#0A0A0A] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {item.icon}
                <span className="font-bold text-sm">{t(item.labelKey)}</span>
              </div>
              <p className={`text-[10px] leading-relaxed ${selectedCriteria.includes(item.id) ? 'text-white/80 dark:text-black/80' : 'text-slate-500'}`}>
                {t(item.descKey)}
              </p>
            </button>
          ))}
          {selectedCriteria.length > 0 && (
            <button 
              onClick={() => setSelectedCriteria([])}
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-black dark:hover:text-white pt-4"
            >
              {t('selector.clear')}
            </button>
          )}
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">{t('selector.recommendations')}</h2>
            <span className="text-[10px] font-bold text-slate-400">
              {t('selector.matches', { count: recommendations.length })}
            </span>
          </div>

          {selectedCriteria.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 dark:border-white/5 rounded-3xl text-center p-8">
              <HelpCircle className="w-8 h-8 text-slate-200 dark:text-white/10 mb-4" />
              <p className="text-sm font-medium text-slate-400">{t('selector.empty')}</p>
            </div>
          ) : recommendations.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-rose-100 dark:border-rose-900/10 rounded-3xl text-center p-8">
              <p className="text-sm font-medium text-rose-500">{t('selector.noMatches')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map((lic, idx) => (
                <div 
                  key={lic.id} 
                  className={`bg-white dark:bg-[#0A0A0A] p-6 rounded-2xl border transition-all duration-300 ${
                    idx === 0 ? 'border-black dark:border-white shadow-xl scale-[1.01]' : 'border-slate-200 dark:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-black dark:text-white">{lic.name}</h3>
                      {idx === 0 && (
                        <span className="px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-black uppercase rounded tracking-widest">{t('selector.topPick')}</span>
                      )}
                    </div>
                    <span className="text-xs font-black text-slate-400">{lic.id}</span>
                  </div>
                  
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium leading-relaxed">
                    {lic.description}
                  </p>

                  <div className="space-y-3">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('selector.whyMatch')}</p>
                    <div className="space-y-2">
                      {lic.reasonKeys.map((rKey, i) => (
                        <div key={i} className="flex items-start gap-2 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5" />
                          {t(rKey)}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                     <div className="flex gap-4">
                        <div className="text-center">
                          <p className="text-[9px] font-black text-slate-400 uppercase">{t('selector.freedom')}</p>
                          <p className={`text-sm font-black ${lic.permissiveness > 80 ? 'text-emerald-500' : 'text-amber-500'}`}>{lic.permissiveness}%</p>
                        </div>
                     </div>
                     <button className="flex items-center gap-2 text-xs font-bold text-black dark:text-white group">
                       {t('selector.viewHandbook')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                     </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LicenseSelector;
