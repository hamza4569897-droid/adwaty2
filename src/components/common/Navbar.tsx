import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe, Moon, Sun, Menu, X, ShieldCheck, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar: React.FC = () => {
  const { language, toggleLanguage, theme, toggleTheme, t } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: t.nav.home, path: '/' },
    { label: language === 'ar' ? 'حاسبات' : 'Calculators', path: '/calculators' },
    { label: t.nav.pdfTools, path: '/#pdf-tools' },
    { label: t.nav.imageTools, path: '/#image-tools' },
    { label: t.nav.textTools, path: '/#text-tools' },
    { label: language === 'ar' ? 'برو' : 'Pro', path: '/pricing', badge: language === 'ar' ? 'قريباً' : 'Soon' },
    { label: t.nav.about, path: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Brand Wordmark */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-slate-900 dark:text-white group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-1"
          aria-label={t.appName}
        >
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-600/20 group-hover:bg-blue-700 transition-colors">
            <Layers className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-blue-600 dark:text-blue-400 font-sans">
              {t.appName}
            </span>
          </div>
        </Link>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path && !link.path.includes('#');
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors py-1 flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 ${
                  isActive ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300/60 dark:border-amber-700/60 leading-none">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Actions (Language, Theme, Mobile toggle) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Privacy Indicator Badge (Quiet Trust Marker) */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'معالجة محلية 100%' : '100% Client-side'}</span>
          </div>

          {/* Language Toggle Button */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="min-h-[44px] min-w-[44px] px-2.5 py-1.5 flex items-center gap-1.5 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            title={language === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
            aria-label={language === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
          >
            <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{language === 'ar' ? 'English' : 'عربي'}</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="min-h-[44px] min-w-[44px] p-2 flex items-center justify-center rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            title={theme === 'dark' ? (language === 'ar' ? 'الوضع المضيء' : 'Light Mode') : (language === 'ar' ? 'الوضع الليلي' : 'Dark Mode')}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden min-h-[44px] min-w-[44px] p-2 flex items-center justify-center rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            aria-label="Open Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span>{link.label}</span>
              {link.badge && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300/60 dark:border-amber-700/60">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
          {/* Mobile Theme Toggle Row */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between px-3 py-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {language === 'ar' ? 'المظهر' : 'Appearance'}
            </span>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>{language === 'ar' ? 'الوضع المضيء' : 'Light'}</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-600" />
                  <span>{language === 'ar' ? 'الوضع الليلي' : 'Dark'}</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-3">
            <span>{language === 'ar' ? 'الخصوصية محمية بالكامل' : 'Absolute Privacy Guaranteed'}</span>
            <span className="text-emerald-600 font-medium">100% Offline</span>
          </div>
        </div>
      )}
    </header>
  );
};
