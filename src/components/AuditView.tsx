
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Loader2, 
  AlertTriangle, 
  LayoutGrid, 
  Network, 
  RefreshCw,
  Search,
  ArrowRight,
  Globe,
  Link2,
  ChevronDown,
  Github,
  CloudDownload,
  X,
  ChevronRight,
  Info,
  Layers,
  Code2,
  Database,
  Cpu,
  Boxes,
  Package
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DependencyAudit, RiskLevel } from '../types';
import { auditDependenciesWithBackend } from '../services/auditService';
import { parseDependencies } from '../services/dependencyParser';
import { KNOWN_PACKAGES, COMMON_LICENSES } from '../services/localDatabase';
import { getFromCache, saveToCache } from '../services/cacheService';
import AuditTable from './AuditTable';
import SummaryCards from './SummaryCards';
import VisualTree from './VisualTree';

type ViewMode = 'table' | 'tree';
type AuditStatus = 'pending' | 'loading' | 'success' | 'error';

interface DependencyTask {
  name: string;
  version: string;
  status: AuditStatus;
  result?: DependencyAudit;
  error?: string;
}

const RISK_PRIORITY = {
  [RiskLevel.HIGH]: 3,
  [RiskLevel.CAUTION]: 2,
  [RiskLevel.SAFE]: 1,
  [RiskLevel.UNKNOWN]: 0
};

// Internal Settings2 placeholder since it wasn't imported
const Settings2 = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
);

const EcosystemIcon: React.FC<{ type: string; size?: string }> = ({ type, size = "w-5 h-5" }) => {
  switch (type) {
    case 'npm': return <div className="p-1.5 rounded-lg bg-[#CB3837]/10 text-[#CB3837]"><Boxes className={size} /></div>;
    case 'python': return <div className="p-1.5 rounded-lg bg-[#3776AB]/10 text-[#3776AB]"><Code2 className={size} /></div>;
    case 'go': return <div className="p-1.5 rounded-lg bg-[#00ADD8]/10 text-[#00ADD8]"><Database className={size} /></div>;
    case 'rust': return <div className="p-1.5 rounded-lg bg-[#000000]/10 dark:bg-white/10 text-black dark:text-white"><Cpu className={size} /></div>;
    case 'maven': return <div className="p-1.5 rounded-lg bg-[#C71A36]/10 text-[#C71A36]"><Package className={size} /></div>;
    case 'gradle': return <div className="p-1.5 rounded-lg bg-[#02303A]/10 text-[#02303A] dark:text-[#00DE7A]"><Settings2 className={size} /></div>;
    case 'swift': return <div className="p-1.5 rounded-lg bg-[#F05138]/10 text-[#F05138]"><Layers className={size} /></div>;
    default: return <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-400"><Search className={size} /></div>;
  }
};

const AuditView: React.FC = () => {
  const { t } = useTranslation();
  const [content, setContent] = useState<string>('');
  const [urlInput, setUrlInput] = useState<string>('');
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [tasks, setTasks] = useState<DependencyTask[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showFormats, setShowFormats] = useState(false);

  const allDone = tasks.length > 0 && tasks.every(t => t.status === 'success' || t.status === 'error');

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      const scoreA = a.result ? RISK_PRIORITY[a.result.riskLevel] : -1;
      const scoreB = b.result ? RISK_PRIORITY[b.result.riskLevel] : -1;
      if (scoreB !== scoreA) return scoreB - scoreA;
      return a.name.localeCompare(b.name);
    });
  }, [tasks]);

  useEffect(() => {
    if (allDone && tasks.length > 0 && !isAuditing) {
      const timer = setTimeout(() => {
        setShowResults(true);
        window.scrollTo({ top: 100, behavior: 'smooth' });
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [allDone, tasks.length, isAuditing]);

  const handleFetchUrl = async () => {
    if (!urlInput.trim()) return;
    setIsFetchingUrl(true);
    setError(null);
    try {
      let targetUrl = urlInput.trim();
      if (targetUrl.includes('github.com') && !targetUrl.includes('raw.githubusercontent.com') && !targetUrl.includes('/raw/')) {
        targetUrl = targetUrl.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
      }
      const response = await fetch(targetUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const text = await response.text();
      setContent(text);
    } catch (err: any) {
      setError(`Failed to fetch URL: ${err.message}`);
    } finally {
      setIsFetchingUrl(false);
    }
  };

  const normalizeResult = (res: DependencyAudit): DependencyAudit => {
    const lic = res.license?.toUpperCase() || 'UNKNOWN';
    const safeKeywords = ['MIT', 'ISC', 'BSD', 'APACHE', 'UNLICENSE', 'ZLIB', 'WTFPL', 'PUBLIC DOMAIN'];
    const isSafe = safeKeywords.some(k => lic.includes(k));
    let finalRisk = res.riskLevel;
    let finalFriendly = res.isFriendly;
    let finalReason = res.reason;
    if (isSafe) {
      finalRisk = RiskLevel.SAFE;
      finalFriendly = true;
      if (res.riskLevel !== RiskLevel.SAFE) {
        finalReason = `[Auto-Correction] ${res.license} is a permissive and safe license. Original check suggested: ${res.reason}`;
      }
    }
    const repository = res.repository || (res.name.includes('/') ? `https://github.com/${res.name}` : `https://www.google.com/search?q=${res.name}+repo`);
    return { ...res, repository, riskLevel: finalRisk, isFriendly: finalFriendly, reason: finalReason };
  };

  const runAudit = async () => {
    if (!content.trim()) return;
    setIsAuditing(true);
    setError(null);
    setShowResults(false);
    const rawDeps = parseDependencies(content);
    if (rawDeps.length === 0) {
      setError(t('audit.noDeps'));
      setIsAuditing(false);
      return;
    }
    const initialTasks: DependencyTask[] = rawDeps.map(d => ({ name: d.name, version: d.version, status: 'pending' }));
    const unknownQueue: { name: string, version: string, index: number }[] = [];
    const updatedTasks = [...initialTasks];
    rawDeps.forEach((dep, idx) => {
      const nameKey = dep.name.toLowerCase();
      const known = KNOWN_PACKAGES[nameKey];
      if (known && known.license && COMMON_LICENSES[known.license]) {
        const licInfo = COMMON_LICENSES[known.license];
        const result: DependencyAudit = {
          name: dep.name, version: dep.version, license: known.license,
          repository: known.repository || `https://www.npmjs.com/package/${dep.name}`,
          riskLevel: licInfo.risk, isFriendly: licInfo.friendly,
          reason: `[Internal DB] ${licInfo.reason}`, sources: ['System Database']
        };
        updatedTasks[idx] = { ...updatedTasks[idx], status: 'success', result: normalizeResult(result) };
        return;
      }
      const cached = getFromCache(dep.name, dep.version);
      if (cached) {
        updatedTasks[idx] = { ...updatedTasks[idx], status: 'success', result: normalizeResult(cached) };
        return;
      }
      unknownQueue.push({ ...dep, index: idx });
      updatedTasks[idx].status = 'loading';
    });
    setTasks(updatedTasks);
    if (unknownQueue.length === 0) {
      setIsAuditing(false);
      return;
    }
    try {
      const results = await auditDependenciesWithBackend(unknownQueue.map(q => ({ name: q.name, version: q.version })));
      setTasks(prev => {
        const next = [...prev];
        results.forEach((res) => {
          const matchedItem = unknownQueue.find(q => q.name.toLowerCase() === res.name.toLowerCase());
          if (matchedItem) {
            const finalRes = normalizeResult(res);
            saveToCache(finalRes);
            next[matchedItem.index] = { ...next[matchedItem.index], status: 'success', result: finalRes };
          }
        });
        next.forEach((t) => { if (t.status === 'loading') { t.status = 'error'; t.error = 'No response'; } });
        return next;
      });
    } catch (err) {
      setTasks(prev => {
        const next = [...prev];
        unknownQueue.forEach(q => { if (next[q.index].status === 'loading') { next[q.index].status = 'error'; next[q.index].error = 'Batch scan failed'; } });
        return next;
      });
    } finally {
      setIsAuditing(false);
    }
  };

  const clearResults = () => {
    setTasks([]); setContent(''); setUrlInput(''); setError(null); setShowResults(false);
  };

  const isGitHub = (url?: string) => url?.toLowerCase().includes('github.com');

  const ecosystems = ['npm', 'python', 'go', 'rust', 'maven', 'gradle', 'swift'];

  return (
    <div className="max-w-5xl mx-auto px-6 pt-16 pb-24">
      {tasks.length === 0 ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-black dark:text-white tracking-tighter mb-4">
              {t('audit.title')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
              {t('audit.desc')}
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {/* URL Input Bar */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <CloudDownload className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFetchUrl()}
                placeholder={t('audit.urlPlaceholder')}
                className="block w-full pl-10 pr-24 py-3 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 rounded-2xl text-sm outline-none focus:border-black dark:focus:border-white/30 transition-all placeholder:text-slate-400 font-medium"
              />
              <div className="absolute inset-y-0 right-1.5 flex items-center gap-1">
                {urlInput && (
                   <button onClick={() => setUrlInput('')} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                     <X className="w-3.5 h-3.5" />
                   </button>
                )}
                <button
                  onClick={handleFetchUrl}
                  disabled={isFetchingUrl || !urlInput}
                  className="px-4 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded-xl text-xs font-bold disabled:opacity-50 transition-all active:scale-95"
                >
                  {isFetchingUrl ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : t('audit.fetchBtn')}
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.12)] dark:shadow-none overflow-hidden group focus-within:border-black dark:focus-within:border-white/30 transition-all">
              <div className="p-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <Search className="w-3.5 h-3.5" /> {t('audit.inputLabel')}
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setContent('module github.com/user/project\n\ngo 1.18\n\nrequire (\n  github.com/gin-gonic/gin v1.8.1\n  github.com/sirupsen/logrus v1.9.0\n)')} className="text-[10px] font-bold text-blue-500 hover:text-blue-600 dark:text-blue-400">Go Mod</button>
                  <button onClick={() => setContent('[dependencies]\nserde = "1.0"\ntokio = { version = "1.0", features = ["full"] }')} className="text-[10px] font-bold text-blue-500 hover:text-blue-600 dark:text-blue-400">Cargo</button>
                  <button onClick={() => setContent('{\n  "dependencies": {\n    "react": "^19.0.0",\n    "next": "latest"\n  }\n}')} className="text-[10px] font-bold text-blue-500 hover:text-blue-600 dark:text-blue-400">NPM</button>
                </div>
              </div>
              <textarea
                className="w-full h-72 p-6 text-sm font-mono bg-transparent dark:text-slate-200 outline-none resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
                placeholder={t('audit.placeholder')}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="p-4 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/5">
                <div className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">
                  Support: NPM, Maven, Go, Rust, Gradle, Swift
                </div>
                <button
                  onClick={runAudit}
                  disabled={isAuditing || !content.trim()}
                  className={`px-6 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                    isAuditing || !content.trim() 
                    ? 'bg-slate-200 dark:bg-white/5 text-slate-400' 
                    : 'bg-black dark:bg-white text-white dark:text-black hover:opacity-90 active:scale-95 shadow-lg'
                  }`}
                >
                  {isAuditing ? <Loader2 className="w-4 h-4 animate-spin" /> : t('audit.run')}
                  {!isAuditing && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Expandable Formats List - Now BELOW the input area */}
            <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden transition-all shadow-sm">
              <button 
                onClick={() => setShowFormats(!showFormats)}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50/50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors"
              >
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <Info className="w-3.5 h-3.5" /> {t('audit.supportedTitle')}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-1.5">
                    {ecosystems.slice(0, 4).map(eco => (
                      <div key={eco} className="w-5 h-5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center">
                        <EcosystemIcon type={eco} size="w-2.5 h-2.5" />
                      </div>
                    ))}
                    <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-white/10 flex items-center justify-center text-[8px] font-bold">
                      +{ecosystems.length - 4}
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${showFormats ? 'rotate-90' : ''}`} />
                </div>
              </button>
              
              {showFormats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-6 border-t border-slate-100 dark:border-white/5 animate-in slide-in-from-top-2 duration-300">
                  {ecosystems.map(eco => (
                    <div key={eco} className="p-4 bg-slate-50/50 dark:bg-white/[0.02] rounded-xl border border-slate-100 dark:border-white/5 group hover:border-black/10 dark:hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <EcosystemIcon type={eco} />
                        <span className="text-[11px] font-black text-black dark:text-white uppercase tracking-tight">{t(`audit.formats.${eco}.name`)}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target File</span>
                        <code className="text-[10px] font-mono text-blue-500 dark:text-blue-400 bg-blue-500/5 px-2 py-1 rounded inline-block w-fit">
                          {t(`audit.formats.${eco}.file`)}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {error && (
            <div className="mt-6 p-4 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 rounded-xl flex items-center gap-3 text-rose-600 dark:text-rose-400 text-xs font-medium">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-white/10">
            <div>
              <h2 className="text-2xl font-black text-black dark:text-white tracking-tight">
                {allDone ? t('audit.completed') : t('audit.scanning')}
              </h2>
              <div className="flex items-center gap-4 mt-1">
                 <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                   <div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> {t('audit.riskHigh')}
                 </div>
                 <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {t('audit.riskSafe')}
                 </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={clearResults} className="px-4 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold transition-all flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5" /> {t('audit.startOver')}
              </button>
              {allDone && (
                <button 
                  onClick={() => setShowResults(!showResults)}
                  className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-xs font-bold transition-all flex items-center gap-2 shadow-xl hover:scale-105"
                >
                  {showResults ? t('audit.showQueue') : t('audit.showReport')}
                </button>
              )}
            </div>
          </div>

          {!showResults ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedTasks.map((task, i) => (
                <div 
                  key={`${task.name}-${i}`}
                  className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between group h-full ${
                    task.status === 'success' ? 'bg-white dark:bg-[#0A0A0A] border-slate-200 dark:border-white/10 shadow-sm' :
                    task.status === 'loading' ? 'bg-white dark:bg-[#0A0A0A] border-blue-500 ring-4 ring-blue-500/5' :
                    task.status === 'error' ? 'bg-rose-50/50 dark:bg-rose-900/5 border-rose-200 dark:border-rose-900/30' :
                    'bg-slate-50/50 dark:bg-white/[0.02] border-slate-100 dark:border-white/5 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-sm text-black dark:text-white truncate">{task.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">v{task.version}</p>
                    </div>
                    {task.status === 'loading' && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
                    {task.status === 'success' && (
                      <div className={`w-2.5 h-2.5 rounded-full ring-4 ${
                        task.result?.riskLevel === RiskLevel.SAFE ? 'bg-emerald-500 ring-emerald-500/10' :
                        task.result?.riskLevel === RiskLevel.CAUTION ? 'bg-amber-500 ring-amber-500/10' : 
                        'bg-rose-500 ring-rose-500/10'
                      }`} />
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                       <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                         task.result?.riskLevel === RiskLevel.HIGH ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400'
                       }`}>
                        {task.result?.license || (task.status === 'loading' ? '...' : '?')}
                      </span>
                      {task.result?.repository && (
                        <a 
                          href={task.result.repository} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-[9px] font-bold text-blue-500 hover:text-blue-600 transition-colors uppercase"
                        >
                          {isGitHub(task.result.repository) ? <Github className="w-3 h-3" /> : <Link2 className="w-3 h-3" />}
                          Source
                        </a>
                      )}
                    </div>
                    {task.result?.reason && (
                       <p className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-2 leading-relaxed italic">
                         {task.result.reason}
                       </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-700">
              <SummaryCards audits={tasks.filter(t => t.result).map(t => t.result!)} />
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   {t('audit.resultsTitle')} <ChevronDown className="w-3 h-3" />
                 </h3>
                 <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-lg">
                    <button onClick={() => setViewMode('table')} className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase transition-all flex items-center gap-2 ${viewMode === 'table' ? 'bg-white dark:bg-white/10 text-black dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                      <LayoutGrid className="w-3 h-3" /> Table
                    </button>
                    <button onClick={() => setViewMode('tree')} className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase transition-all flex items-center gap-2 ${viewMode === 'tree' ? 'bg-white dark:bg-white/10 text-black dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                      <Network className="w-3 h-3" /> Graph
                    </button>
                  </div>
              </div>
              {viewMode === 'table' ? (
                <AuditTable audits={tasks.filter(t => t.result).map(t => t.result!)} />
              ) : (
                <VisualTree audits={tasks.filter(t => t.result).map(t => t.result!)} />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuditView;
