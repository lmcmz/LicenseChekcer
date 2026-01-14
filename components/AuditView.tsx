
import React, { useState } from 'react';
import { 
  Loader2, 
  AlertTriangle, 
  ChevronRight, 
  LayoutGrid, 
  Network, 
  RefreshCw,
  Search,
  ArrowRight,
  Info
} from 'lucide-react';
import { DependencyAudit, RiskLevel } from '../types';
import { auditDependenciesWithGemini } from '../services/geminiService';
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

const AuditView: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [tasks, setTasks] = useState<DependencyTask[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const completedCount = tasks.filter(t => t.status === 'success' || t.status === 'error').length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const runAudit = async () => {
    if (!content.trim()) return;
    setIsAuditing(true);
    setError(null);
    setShowResults(false);
    
    const rawDeps = parseDependencies(content);
    if (rawDeps.length === 0) {
      setError("No valid dependencies found. Try pasting a package.json content.");
      setIsAuditing(false);
      return;
    }

    const initialTasks: DependencyTask[] = rawDeps.map(d => ({
      name: d.name,
      version: d.version,
      status: 'pending'
    }));
    setTasks(initialTasks);

    const CHUNK_SIZE = 5; 
    const unknownQueue: { name: string, version: string, index: number }[] = [];
    const updatedTasks = [...initialTasks];

    rawDeps.forEach((dep, idx) => {
      // 1. Check Hardcoded Database
      const known = KNOWN_PACKAGES[dep.name.toLowerCase()];
      if (known && known.license && COMMON_LICENSES[known.license]) {
        const licInfo = COMMON_LICENSES[known.license];
        const result: DependencyAudit = {
          name: dep.name,
          version: dep.version,
          license: known.license,
          repository: known.repository || '',
          riskLevel: licInfo.risk,
          isFriendly: licInfo.friendly,
          reason: `[系统库] ${licInfo.reason}`,
          sources: ['System Knowledge Base']
        };
        updatedTasks[idx] = { ...updatedTasks[idx], status: 'success', result };
        return;
      }

      // 2. Check Storage Cache
      const cached = getFromCache(dep.name, dep.version);
      if (cached) {
        updatedTasks[idx] = { 
          ...updatedTasks[idx], 
          status: 'success', 
          result: { ...cached, reason: `[已缓存] ${cached.reason}` } 
        };
        return;
      }

      // 3. Add to AI Audit Queue
      unknownQueue.push({ ...dep, index: idx });
    });

    setTasks([...updatedTasks]);

    for (let i = 0; i < unknownQueue.length; i += CHUNK_SIZE) {
      const chunk = unknownQueue.slice(i, i + CHUNK_SIZE);
      
      setTasks(prev => {
        const next = [...prev];
        chunk.forEach(item => { next[item.index].status = 'loading'; });
        return next;
      });

      try {
        const geminiBatch = await auditDependenciesWithGemini(chunk.map(c => ({ name: c.name, version: c.version })));
        
        setTasks(prev => {
          const next = [...prev];
          geminiBatch.forEach((res, batchIdx) => {
            const originalIdx = chunk[batchIdx].index;
            saveToCache(res); // 存入本地存储
            next[originalIdx] = { ...next[originalIdx], status: 'success', result: res };
          });
          return next;
        });
      } catch (err: any) {
        setTasks(prev => {
          const next = [...prev];
          chunk.forEach(item => {
            next[item.index].status = 'error';
            next[item.index].error = "Audit Failed";
          });
          return next;
        });
      }
    }
    setIsAuditing(false);
  };

  const clearResults = () => {
    setTasks([]);
    setContent('');
    setError(null);
    setShowResults(false);
  };

  const allDone = tasks.length > 0 && tasks.every(t => t.status === 'success' || t.status === 'error');

  return (
    <div className="max-w-5xl mx-auto px-6 pt-16 pb-24">
      {tasks.length === 0 ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-black dark:text-white tracking-tighter mb-4">
              Audit your dependencies.
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
              快速扫描项目依赖，识别潜在合规风险。
            </p>
          </div>

          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.12)] dark:shadow-none overflow-hidden group focus-within:border-black dark:focus-within:border-white/30 transition-all">
            <div className="p-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <Search className="w-3.5 h-3.5" /> Dependency Input
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setContent('{\n  "dependencies": {\n    "react": "latest",\n    "lodash": "4.17.21",\n    "mongoose": "8.0.0"\n  }\n}')}
                  className="text-[10px] font-bold text-blue-500 hover:text-blue-600 dark:text-blue-400"
                >
                  Load Example
                </button>
              </div>
            </div>
            <textarea
              className="w-full h-72 p-6 text-sm font-mono bg-transparent dark:text-slate-200 outline-none resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
              placeholder='Paste package.json or dependency list here...'
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="p-4 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/5">
              <div className="text-[10px] font-medium text-slate-400">
                支持持久化本地存储，重复扫描将瞬间完成
              </div>
              <button
                onClick={runAudit}
                disabled={isAuditing || !content.trim()}
                className={`px-6 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                  isAuditing || !content.trim() 
                  ? 'bg-slate-200 dark:bg-white/5 text-slate-400' 
                  : 'bg-black dark:bg-white text-white dark:text-black hover:opacity-90 active:scale-95'
                }`}
              >
                {isAuditing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Run Audit'}
                {!isAuditing && <ArrowRight className="w-4 h-4" />}
              </button>
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
              <h2 className="text-2xl font-black text-black dark:text-white tracking-tight">Audit Overview</h2>
              <div className="flex items-center gap-4 mt-1">
                 <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Safe
                 </div>
                 <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                   <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Caution
                 </div>
                 <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                   <div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> High Risk
                 </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={clearResults} className="px-4 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold transition-all flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5" /> Start Over
              </button>
              {allDone && (
                <button 
                  onClick={() => setShowResults(!showResults)}
                  className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-xs font-bold transition-all flex items-center gap-2"
                >
                  {showResults ? 'Grid View' : 'Full Report'}
                </button>
              )}
            </div>
          </div>

          {!allDone && (
            <div className="relative h-1 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-black dark:bg-white transition-all duration-1000 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}

          {!showResults ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task, i) => (
                <div 
                  key={`${task.name}-${i}`}
                  className={`p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
                    task.status === 'success' ? 'bg-white dark:bg-[#0A0A0A] border-slate-200 dark:border-white/10 shadow-sm' :
                    task.status === 'loading' ? 'bg-white dark:bg-[#0A0A0A] border-blue-500/50 shadow-[0_0_15px_-5px_rgba(59,130,246,0.3)]' :
                    task.status === 'error' ? 'bg-rose-50/50 dark:bg-rose-900/5 border-rose-200 dark:border-rose-900/30' :
                    'bg-slate-50/50 dark:bg-white/[0.02] border-slate-100 dark:border-white/5 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-sm text-black dark:text-white truncate">{task.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">v{task.version}</p>
                    </div>
                    {task.status === 'loading' && <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" />}
                    {task.status === 'error' && <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />}
                    {task.status === 'success' && (
                      <div className={`w-2 h-2 rounded-full ${
                        task.result?.riskLevel === RiskLevel.SAFE ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                        task.result?.riskLevel === RiskLevel.CAUTION ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 
                        'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'
                      }`} />
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex gap-1.5">
                      {task.status === 'success' && task.result && (
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 text-[9px] font-bold rounded uppercase">
                          {task.result.license}
                        </span>
                      )}
                    </div>
                    {task.status === 'loading' && <span className="text-[9px] font-bold text-blue-400 animate-pulse uppercase tracking-widest">Auditing...</span>}
                    {task.status === 'error' && <span className="text-[9px] font-bold text-rose-400 uppercase">Failed</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-500">
              <SummaryCards audits={tasks.filter(t => t.result).map(t => t.result!)} />
              
              <div className="flex items-center justify-between pt-6">
                <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-lg">
                  <button onClick={() => setViewMode('table')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'table' ? 'bg-white dark:bg-white/10 text-black dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                    <LayoutGrid className="w-3.5 h-3.5" /> Table
                  </button>
                  <button onClick={() => setViewMode('tree')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'tree' ? 'bg-white dark:bg-white/10 text-black dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                    <Network className="w-3.5 h-3.5" /> Graph
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
