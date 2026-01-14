
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Sun, 
  Moon, 
  Github, 
  Menu,
  X as CloseIcon,
  Command,
  Languages
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AuditView from './components/AuditView';
import LicenseGuide from './components/LicenseGuide';
import LicenseSelector from './components/LicenseSelector';

type Page = 'audit' | 'guide' | 'selector';
type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [page, setPage] = useState<Page>('audit');
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('licensechecker_theme');
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
    localStorage.setItem('licensechecker_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('licensechecker_lang', newLang);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#000] text-slate-900 dark:text-slate-100 transition-colors duration-200 font-sans selection:bg-blue-500/30">
      {/* Navbar */}
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
              <span className="font-bold text-sm tracking-tight uppercase">License Checker</span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => setPage('audit')} 
                className={`text-xs font-medium transition-colors ${page === 'audit' ? 'text-black dark:text-white' : 'text-slate-500 hover:text-black dark:hover:text-white'}`}
              >
                {t('nav.auditor')}
              </button>
              <button 
                onClick={() => setPage('guide')} 
                className={`text-xs font-medium transition-colors ${page === 'guide' ? 'text-black dark:text-white' : 'text-slate-500 hover:text-black dark:hover:text-white'}`}
              >
                {t('nav.guide')}
              </button>
              <button 
                onClick={() => setPage('selector')} 
                className={`text-xs font-medium transition-colors ${page === 'selector' ? 'text-black dark:text-white' : 'text-slate-500 hover:text-black dark:hover:text-white'}`}
              >
                {t('nav.selector')}
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
             <button 
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2 py-1 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 rounded transition-all text-[10px] font-bold"
            >
              <Languages className="w-3.5 h-3.5" />
              {t('nav.lang')}
            </button>
            
            <button 
              onClick={toggleTheme}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 rounded transition-all"
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
            <button onClick={() => { setPage('audit'); setIsMenuOpen(false); }}>{t('nav.auditor')}</button>
            <button onClick={() => { setPage('guide'); setIsMenuOpen(false); }}>{t('nav.guide')}</button>
            <button onClick={() => { setPage('selector'); setIsMenuOpen(false); }}>{t('nav.selector')}</button>
            <button onClick={() => { toggleLanguage(); setIsMenuOpen(false); }} className="flex items-center gap-2">{t('nav.lang')}</button>
          </div>
        </div>
      )}

      <main>
        {page === 'audit' && <AuditView />}
        {page === 'guide' && <LicenseGuide />}
        {page === 'selector' && <LicenseSelector />}
      </main>

      <footer className="border-t border-slate-200 dark:border-white/10 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
             © 2024 License Checker — {t('footer.built')}
          </div>
          <div className="flex gap-6 text-xs font-medium text-slate-500">
            <button className="hover:text-black dark:hover:text-white">{t('footer.privacy')}</button>
            <button className="hover:text-black dark:hover:text-white">{t('footer.terms')}</button>
            <button className="hover:text-black dark:hover:text-white">{t('footer.status')}</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
