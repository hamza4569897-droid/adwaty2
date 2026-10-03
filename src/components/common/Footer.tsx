import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TOOLS } from '../../data/toolsData';
import { CALCULATORS } from '../../data/calculatorsData';

export const Footer: React.FC = () => {
  const { language, t } = useApp();
  const year = new Date().getFullYear();

  const pdfTools = TOOLS.filter((tool) => tool.category === 'pdf').slice(0, 4);
  const imageTools = TOOLS.filter((tool) => tool.category === 'image').slice(0, 3);
  const popularCalcs = CALCULATORS.slice(0, 4);

  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Brand info */}
          <div className="lg:col-span-1 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                {t.appName}
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              {t.footer.aboutText}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>{t.privacyBadge}</span>
            </div>
          </div>

          {/* PDF Tools */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              {language === 'ar' ? 'أدوات PDF' : 'PDF Tools'}
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              {pdfTools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    to={`/tools/${tool.slug}`}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {language === 'ar' ? tool.titleAr : tool.titleEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Image & Text Tools */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              {language === 'ar' ? 'أدوات الصور والنصوص' : 'Image & Text Tools'}
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              {imageTools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    to={`/tools/${tool.slug}`}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {language === 'ar' ? tool.titleAr : tool.titleEn}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/tools/number-to-words"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {language === 'ar' ? 'تفقيط الأرقام' : 'Tafqeet (Numbers)'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Calculators */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              <Link to="/calculators" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {language === 'ar' ? 'حاسبات مالية' : 'Calculators'}
              </Link>
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              {popularCalcs.map((calc) => (
                <li key={calc.slug}>
                  <Link
                    to={`/calculators/${calc.slug}`}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {language === 'ar' ? calc.titleAr : calc.titleEn}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/calculators"
                  className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline"
                >
                  {language === 'ar' ? 'عرض كل الحاسبات (13+) ←' : 'View all calculators (13+) →'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Static & Legal Pages */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              {t.footer.pagesTitle}
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/pricing" className="inline-flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <span>{language === 'ar' ? 'باقة برو (Pro)' : 'Pro Plan'}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300/60 dark:border-amber-700/60">
                    {language === 'ar' ? 'قريباً' : 'Soon'}
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.nav.privacy}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.nav.terms}
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {language === 'ar' ? 'إخلاء المسؤولية' : 'Disclaimer'}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom row */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>{t.footer.copyright.replace('{year}', year.toString())}</p>
          <div className="flex items-center gap-1">
            <span>{language === 'ar' ? 'صنع بكل' : 'Crafted with'}</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>{language === 'ar' ? 'لخصوصية وسرعة المستخدم' : 'for user privacy & speed'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
