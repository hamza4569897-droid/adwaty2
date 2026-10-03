import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  ArrowLeft,
  ArrowRight,
  Search,
  FileStack,
  Scissors,
  Minimize2,
  TrendingUp,
  Type,
  AlignLeft,
  Calculator,
  Compass,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TOOLS } from '../data/toolsData';
import { CALCULATORS } from '../data/calculatorsData';

export const NotFoundPage: React.FC = () => {
  const { language, dir, t } = useApp();
  const [search, setSearch] = useState('');
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const popularSlugs = [
    'merge-pdf',
    'split-pdf',
    'compress-image',
    'compound-interest',
    'word-counter',
    'number-to-words',
  ];

  const allRegistry = useMemo(() => [...TOOLS, ...CALCULATORS], []);

  const popularTools = useMemo(
    () => allRegistry.filter((item) => popularSlugs.includes(item.slug)),
    [allRegistry]
  );

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const query = search.trim().toLowerCase();
    return allRegistry.filter((item) => {
      const title = language === 'ar' ? item.titleAr : item.titleEn;
      const desc = language === 'ar' ? item.descAr : item.descEn;
      return (
        title.toLowerCase().includes(query) ||
        desc.toLowerCase().includes(query) ||
        item.slug.includes(query)
      );
    }).slice(0, 6);
  }, [allRegistry, search, language]);

  const renderIcon = (slug: string) => {
    switch (slug) {
      case 'merge-pdf':
        return <FileStack className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
      case 'split-pdf':
        return <Scissors className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
      case 'compress-image':
        return <Minimize2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'compound-interest':
        return <TrendingUp className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
      case 'word-counter':
        return <AlignLeft className="w-6 h-6 text-teal-600 dark:text-teal-400" />;
      case 'number-to-words':
        return <Type className="w-6 h-6 text-purple-600 dark:text-purple-400" />;
      default:
        return <Calculator className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getHref = (item: (typeof allRegistry)[0]) => {
    return item.category === 'calculator'
      ? `/calculators/${item.slug}`
      : `/tools/${item.slug}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center space-y-10">
      <div className="space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shadow-xs mb-2">
          <Compass className="w-8 h-8 animate-pulse" />
        </div>
        <h1 className="text-6xl sm:text-8xl font-black text-blue-600 dark:text-blue-500 tracking-tight">
          404
        </h1>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {language === 'ar' ? 'الصفحة غير موجودة' : 'Page Not Found'}
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
          {language === 'ar'
            ? 'عفواً، الصفحة أو الأداة التي تبحث عنها غير متوفرة أو ربما تم تغيير مسارها. يمكنك البحث أدناه أو اختيار أداة من الأدوات الشائعة.'
            : 'Sorry, the page or tool you are looking for does not exist. You can search below or pick from our most popular utilities.'}
        </p>
      </div>

      {/* Search box */}
      <div className="max-w-md mx-auto relative">
        <Search className="w-5 h-5 text-slate-400 absolute start-4 top-3.5 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={
            language === 'ar'
              ? 'ابحث عن أداة أو حاسبة...'
              : 'Search for a tool or calculator...'
          }
          className="w-full h-12 ps-12 pe-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        />

        {searchResults.length > 0 && (
          <div className="absolute top-full start-0 end-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden z-20 text-start">
            {searchResults.map((tool) => (
              <Link
                key={tool.id}
                to={getHref(tool)}
                className="flex items-center gap-3 p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800/50 last:border-0 transition-colors"
              >
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                  {renderIcon(tool.slug)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {language === 'ar' ? tool.titleAr : tool.titleEn}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {language === 'ar' ? tool.descAr : tool.descEn}
                  </div>
                </div>
                <ArrowIcon className="w-4 h-4 text-slate-400 shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Suggested Popular Tools Grid */}
      <div className="text-start space-y-4 pt-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white text-center">
          {language === 'ar' ? 'أدوات شائعة قد تهمك' : 'Popular Tools You Might Need'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {popularTools.map((tool) => (
            <Link
              key={tool.id}
              to={getHref(tool)}
              className="flex items-start gap-3.5 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 shadow-xs hover:shadow-md transition-all group"
            >
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 group-hover:scale-105 transition-transform shrink-0">
                {renderIcon(tool.slug)}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {language === 'ar' ? tool.titleAr : tool.titleEn}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {language === 'ar' ? tool.descAr : tool.descEn}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all"
        >
          <Home className="w-4 h-4" />
          <span>{t.nav.home}</span>
          <ArrowIcon className="w-4 h-4" />
        </Link>
        <Link
          to="/calculators"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-all"
        >
          <Calculator className="w-4 h-4" />
          <span>{language === 'ar' ? 'تصفح جميع الحاسبات' : 'Browse All Calculators'}</span>
        </Link>
      </div>
    </div>
  );
};
