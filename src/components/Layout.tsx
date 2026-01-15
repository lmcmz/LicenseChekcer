import React, { useState, useEffect } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import {
  Sun,
  Moon,
  Github,
  Menu,
  X as CloseIcon,
  Languages
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Theme = 'light' | 'dark';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark';
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
    if (typeof window !== 'undefined') {
      localStorage.setItem('licensechecker_theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('licensechecker_lang', newLang);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-white dark:bg-[#000] text-slate-900 dark:text-slate-100 transition-colors duration-200 font-sans selection:bg-blue-500/30">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-md border-b border-slate-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => {
                if (window.location.pathname === '/') {
                  window.location.reload();
                }
              }}
            >
              <img src="/logo.svg" alt="License Checker" className="w-7 h-7" />
              <span className="font-bold text-sm tracking-tight uppercase">License Checker</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className={`text-xs font-medium transition-colors ${isActive('/') ? 'text-black dark:text-white' : 'text-slate-500 hover:text-black dark:hover:text-white'}`}
              >
                {t('nav.auditor')}
              </Link>
              <Link
                to="/guide"
                className={`text-xs font-medium transition-colors ${isActive('/guide') ? 'text-black dark:text-white' : 'text-slate-500 hover:text-black dark:hover:text-white'}`}
              >
                {t('nav.guide')}
              </Link>
              <Link
                to="/selector"
                className={`text-xs font-medium transition-colors ${isActive('/selector') ? 'text-black dark:text-white' : 'text-slate-500 hover:text-black dark:hover:text-white'}`}
              >
                {t('nav.selector')}
              </Link>
              <Link
                to="/api"
                className={`text-xs font-medium transition-colors ${isActive('/api') ? 'text-black dark:text-white' : 'text-slate-500 hover:text-black dark:hover:text-white'}`}
              >
                {t('nav.api')}
              </Link>
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
            <a href="https://github.com/lmcmz/LicenseChekcer" target="_blank" rel="noopener noreferrer" className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 rounded transition-all">
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
            <Link to="/" onClick={() => setIsMenuOpen(false)}>{t('nav.auditor')}</Link>
            <Link to="/guide" onClick={() => setIsMenuOpen(false)}>{t('nav.guide')}</Link>
            <Link to="/selector" onClick={() => setIsMenuOpen(false)}>{t('nav.selector')}</Link>
            <button onClick={() => { toggleLanguage(); setIsMenuOpen(false); }} className="flex items-center gap-2 text-left">{t('nav.lang')}</button>
          </div>
        </div>
      )}

      <main>
        {children}
      </main>

      <footer className="border-t border-slate-200 dark:border-white/10 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
            © 2024 License Checker — {t('footer.built')}
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <span className="text-xs font-medium text-slate-500">{t('footer.moreProjects')}</span>
            <div className="flex gap-4 text-xs font-medium text-slate-500">
              <a href="https://outblock.io" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors">
                Outblock
              </a>
              <a href="https://xportrait.ai" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors">
                XPortrait
              </a>
              <a href="https://github.com/lmcmz/LicenseChekcer" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-1">
                <Github className="w-3.5 h-3.5" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
