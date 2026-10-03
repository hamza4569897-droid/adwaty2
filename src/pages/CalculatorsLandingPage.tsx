import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Calculator,
  Coins,
  Briefcase,
  Gem,
  HeartPulse,
  GraduationCap,
  Home,
  Car,
  Utensils,
  Moon,
  Cpu,
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  Percent,
  PiggyBank,
  PieChart,
  LineChart,
  Flame,
  DollarSign,
  Target,
  CalendarClock,
  BadgePercent,
  Receipt,
  CreditCard,
  Layers,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CALCULATORS, CALCULATOR_SUBCATEGORIES } from '../data/calculatorsData';
import { CalculatorSubCategory, ToolDefinition } from '../types';

export const CalculatorsLandingPage: React.FC = () => {
  const { language, dir, t } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubCategory, setActiveSubCategory] = useState<CalculatorSubCategory | 'all'>('all');

  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  useEffect(() => {
    document.title =
      language === 'ar'
        ? `حاسبات ذكية دقيقة مجانية 100% | ${t.appName}`
        : `Free Online Calculators | ${t.appName}`;
    window.scrollTo(0, 0);
  }, [language, t.appName]);

  const filteredCalculators = useMemo(() => {
    return CALCULATORS.filter((calc) => {
      const matchesSub = activeSubCategory === 'all' || calc.subCategory === activeSubCategory;
      const title = language === 'ar' ? calc.titleAr : calc.titleEn;
      const desc = language === 'ar' ? calc.descAr : calc.descEn;
      const query = searchQuery.trim().toLowerCase();

      const matchesSearch =
        !query ||
        title.toLowerCase().includes(query) ||
        desc.toLowerCase().includes(query) ||
        calc.slug.includes(query);

      return matchesSub && matchesSearch;
    });
  }, [searchQuery, activeSubCategory, language]);

  // Group by subcategory
  const groupedCalculators = useMemo(() => {
    const map = new Map<CalculatorSubCategory, ToolDefinition[]>();
    filteredCalculators.forEach((calc) => {
      const sub = calc.subCategory || 'financial';
      if (!map.has(sub)) map.set(sub, []);
      map.get(sub)!.push(calc);
    });
    return map;
  }, [filteredCalculators]);

  const renderIcon = (name: string, className = 'w-6 h-6') => {
    switch (name) {
      case 'TrendingUp':
        return <TrendingUp className={className} />;
      case 'Percent':
        return <Percent className={className} />;
      case 'PiggyBank':
        return <PiggyBank className={className} />;
      case 'PieChart':
        return <PieChart className={className} />;
      case 'LineChart':
        return <LineChart className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      case 'DollarSign':
        return <DollarSign className={className} />;
      case 'Target':
        return <Target className={className} />;
      case 'CalendarClock':
        return <CalendarClock className={className} />;
      case 'Car':
        return <Car className={className} />;
      case 'BadgePercent':
        return <BadgePercent className={className} />;
      case 'Receipt':
        return <Receipt className={className} />;
      case 'CreditCard':
        return <CreditCard className={className} />;
      default:
        return <Calculator className={className} />;
    }
  };

  const getSubcategoryIcon = (id: string) => {
    switch (id) {
      case 'financial':
        return <Coins className="w-4 h-4" />;
      case 'salary':
        return <Briefcase className="w-4 h-4" />;
      case 'gold':
        return <Gem className="w-4 h-4" />;
      case 'health':
        return <HeartPulse className="w-4 h-4" />;
      case 'math':
        return <GraduationCap className="w-4 h-4" />;
      case 'home':
        return <Home className="w-4 h-4" />;
      case 'travel':
        return <Car className="w-4 h-4" />;
      case 'cooking':
        return <Utensils className="w-4 h-4" />;
      case 'religious':
        return <Moon className="w-4 h-4" />;
      case 'tech':
        return <Cpu className="w-4 h-4" />;
      default:
        return <Calculator className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16 py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/40 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-semibold">
          <Calculator className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>{language === 'ar' ? 'حاسبات دقيقة وتفاعلية 100% محلية' : 'Accurate In-Browser Calculators'}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          {language === 'ar' ? 'حاسبات أدواتي الذكية' : 'Adawaty Calculators Suite'}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          {language === 'ar'
            ? 'مجموعة شاملة من الحاسبات المالية والمهنية واليومية الدقيقة التي تعمل بالكامل داخل جهازك دون رفع أي أرقام لخوادم خارجية وبخصوصية مطلقة.'
            : 'Comprehensive suite of financial, professional, and lifestyle calculators running 100% locally in your browser.'}
        </p>

        {/* Search input */}
        <div className="relative max-w-xl mx-auto pt-2">
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'ar'
                ? 'ابحث عن حاسبة (مثال: فائدة مركبة، قسط سيارة، تضخم، ROI...)'
                : 'Search calculators (e.g. compound interest, car loan, inflation...)'
            }
            className="w-full ps-11 pe-4 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm transition-all"
          />
        </div>
      </section>

      {/* Subcategory Filter Chips */}
      <section className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
        <button
          type="button"
          onClick={() => setActiveSubCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeSubCategory === 'all'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'جميع الحاسبات' : 'All Calculators'}</span>
        </button>

        {CALCULATOR_SUBCATEGORIES.map((sub) => {
          const isActive = activeSubCategory === sub.id;
          const count = CALCULATORS.filter((c) => c.subCategory === sub.id).length;

          return (
            <button
              key={sub.id}
              type="button"
              onClick={() => setActiveSubCategory(sub.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {getSubcategoryIcon(sub.id)}
              <span>{language === 'ar' ? sub.nameAr : sub.nameEn}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </section>

      {/* Calculators Grid */}
      {filteredCalculators.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <Calculator className="w-12 h-12 text-slate-400 mx-auto" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            {language === 'ar' ? 'لم يتم العثور على أي حاسبة مطابقة لبحثك' : 'No matching calculators found'}
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {CALCULATOR_SUBCATEGORIES.map((sub) => {
            const list = groupedCalculators.get(sub.id as CalculatorSubCategory);
            if (!list || list.length === 0) return null;

            return (
              <div key={sub.id} className="space-y-5">
                <div className="flex items-center gap-2.5 border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    {getSubcategoryIcon(sub.id)}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {language === 'ar' ? sub.nameAr : sub.nameEn}
                  </h2>
                  <span className="text-xs text-slate-500 font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                    {list.length} {language === 'ar' ? 'حاسبة' : 'tools'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {list.map((calc) => {
                    const title = language === 'ar' ? calc.titleAr : calc.titleEn;
                    const desc = language === 'ar' ? calc.descAr : calc.descEn;
                    const badge = language === 'ar' ? calc.badgeAr : calc.badgeEn;

                    return (
                      <Link
                        key={calc.slug}
                        to={`/calculators/${calc.slug}`}
                        className="group flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 shadow-xs hover:shadow-md transition-all space-y-4"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xs">
                              {renderIcon(calc.iconName)}
                            </div>

                            {badge && (
                              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                                {badge}
                              </span>
                            )}
                          </div>

                          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {title}
                          </h3>

                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                            {desc}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                          <span>{language === 'ar' ? 'افتح الحاسبة' : 'Open Calculator'}</span>
                          <ArrowIcon className="w-4 h-4 transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
