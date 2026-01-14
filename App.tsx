
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Sun, 
  Moon, 
  BookOpen, 
  Github, 
  Menu,
  X as CloseIcon,
  Search,
  Command,
  Settings2
} from 'lucide-react';
import AuditView from './components/AuditView';
import LicenseGuide from './components/LicenseGuide';
import LicenseSelector from './components/LicenseSelector';

type Page = 'audit' | 'guide' | 'selector';
type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('audit');
  // Load initial theme from localStorage or default to dark
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('licenseguard_theme');
    return (saved as Theme) || 'dark';
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('licenseguard_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <div className="min-h-screen bg-white dark:bg-[#000] text-slate-900 dark:text-slate-100 transition-colors duration-200 font-sans selection:bg-blue-500/30">
      {/* Navbar - Vercel Style */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-md border-b border-slate-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => setPage('audit')}
            >
              <div className="w-6 h-6 bg-black dark:bg-white rounded flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-white dark:text-black" />
              </div>
              <span className="font-bold text-sm tracking-tight uppercase">LicenseGuard</span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => setPage('audit')} 
                className={`text-xs font-medium transition-colors ${page === 'audit' ? 'text-black dark:text-white' : 'text-slate-500 hover:text-black dark:hover:text-white'}`}
              >
                Auditor
              </button>
              <button 
                onClick={() => setPage('guide')} 
                className={`text-xs font-medium transition-colors ${page === 'guide' ? 'text-black dark:text-white' : 'text-slate-500 hover:text-black dark:hover:text-white'}`}
              >
                License Guide
              </button>
              <button 
                onClick={() => setPage('selector')} 
                className={`text-xs font-medium transition-colors ${page === 'selector' ? 'text-black dark:text-white' : 'text-slate-500 hover:text-black dark:hover:text-white'}`}
              >
                License Selector
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
             <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded text-[10px] font-medium text-slate-500">
               <Command className="w-3 h-3" /> K
             </div>
            <button 
              onClick={toggleTheme}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 rounded transition-all"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <a href="https://github.com" target="_blank" className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 rounded transition-all">
              <Github className="w-4 h-4" />
            </a>
            <button 
              className="md:hidden p-1.5 text-slate-500 dark:text-slate-400"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <CloseIcon className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white dark:bg-black pt-20 px-6 md:hidden">
          <div className="flex flex-col gap-6 text-xl font-bold">
            <button onClick={() => { setPage('audit'); setIsMenuOpen(false); }}>Auditor</button>
            <button onClick={() => { setPage('guide'); setIsMenuOpen(false); }}>License Guide</button>
            <button onClick={() => { setPage('selector'); setIsMenuOpen(false); }}>License Selector</button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main>
        {page === 'audit' && <AuditView />}
        {page === 'guide' && <LicenseGuide />}
        {page === 'selector' && <LicenseSelector />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-white/10 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
             © 2024 LicenseGuard — Built for compliance.
          </div>
          <div className="flex gap-6 text-xs font-medium text-slate-500">
            <button className="hover:text-black dark:hover:text-white">Privacy</button>
            <button className="hover:text-black dark:hover:text-white">Terms</button>
            <button className="hover:text-black dark:hover:text-white">Status</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
