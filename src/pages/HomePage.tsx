import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search,
  ShieldCheck,
  Zap,
  Gift,
  UserCheck,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  FileStack,
  Scissors,
  Images,
  Minimize2,
  Scaling,
  RefreshCw,
  RotateCw,
  Trash2,
  FileImage,
  AlignLeft,
  Calculator,
  ArrowRightLeft,
  Filter,
  ArrowDownAZ,
  Type,
  GitCompare,
  FileText,
  Link2,
  Trophy,
  Sparkles,
  Layers,
  TrendingUp,
  Percent,
  PiggyBank,
  PieChart,
  LineChart,
  Flame,
  DollarSign,
  Target,
  CalendarClock,
  Car,
  BadgePercent,
  Receipt,
  CreditCard,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TOOLS } from '../data/toolsData';
import { CALCULATORS } from '../data/calculatorsData';
import { ToolCategory } from '../types';
import { AdSlot } from '../components/common/AdSlot';

export const HomePage: React.FC = () => {
  const { language, dir, t } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#pdf-tools') {
      setActiveCategory('pdf');
      const el = document.getElementById('all-tools');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (location.hash === '#image-tools') {
      setActiveCategory('image');
      const el = document.getElementById('all-tools');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (location.hash === '#text-tools') {
      setActiveCategory('text');
      const el = document.getElementById('all-tools');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (location.hash === '#calculator-tools' || location.hash === '#calculators') {
      setActiveCategory('calculator');
      const el = document.getElementById('all-tools');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.hash]);

  const allItems = useMemo(() => [...TOOLS, ...CALCULATORS], []);

  const filteredTools = useMemo(() => {
    return allItems.filter((tool) => {
      const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
      const title = language === 'ar' ? tool.titleAr : tool.titleEn;
      const desc = language === 'ar' ? tool.descAr : tool.descEn;
      const query = searchQuery.trim().toLowerCase();

      const matchesSearch =
        !query ||
        title.toLowerCase().includes(query) ||
        desc.toLowerCase().includes(query) ||
        tool.slug.includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [allItems, searchQuery, activeCategory, language]);

  const renderIcon = (name: string) => {
    const props = { className: 'w-6 h-6' };
    switch (name) {
      case 'FileStack':
        return <FileStack {...props} />;
      case 'Scissors':
        return <Scissors {...props} />;
      case 'Images':
        return <Images {...props} />;
      case 'Minimize2':
        return <Minimize2 {...props} />;
      case 'Scaling':
        return <Scaling {...props} />;
      case 'RefreshCw':
        return <RefreshCw {...props} />;
      case 'RotateCw':
        return <RotateCw {...props} />;
      case 'Trash2':
        return <Trash2 {...props} />;
      case 'FileImage':
        return <FileImage {...props} />;
      case 'AlignLeft':
        return <AlignLeft {...props} />;
      case 'Calculator':
        return <Calculator {...props} />;
      case 'ArrowRightLeft':
        return <ArrowRightLeft {...props} />;
      case 'Filter':
        return <Filter {...props} />;
      case 'ArrowDownAZ':
        return <ArrowDownAZ {...props} />;
      case 'Type':
        return <Type {...props} />;
      case 'GitCompare':
        return <GitCompare {...props} />;
      case 'FileText':
        return <FileText {...props} />;
      case 'Link2':
        return <Link2 {...props} />;
      case 'Trophy':
        return <Trophy {...props} />;
      case 'TrendingUp':
        return <TrendingUp {...props} />;
      case 'Percent':
        return <Percent {...props} />;
      case 'PiggyBank':
        return <PiggyBank {...props} />;
      case 'PieChart':
        return <PieChart {...props} />;
      case 'LineChart':
        return <LineChart {...props} />;
      case 'Flame':
        return <Flame {...props} />;
      case 'DollarSign':
        return <DollarSign {...props} />;
      case 'Target':
        return <Target {...props} />;
      case 'CalendarClock':
        return <CalendarClock {...props} />;
      case 'Car':
        return <Car {...props} />;
      case 'BadgePercent':
        return <BadgePercent {...props} />;
      case 'Receipt':
        return <Receipt {...props} />;
      case 'CreditCard':
        return <CreditCard {...props} />;
      case 'Sparkles':
        return <Sparkles {...props} />;
      default:
        return <Layers {...props} />;
    }
  };

  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const faqs = [
    {
      qAr: 'هل الأدوات هتبقى مجانية؟',
      qEn: 'Will the tools remain free?',
      aAr: 'نعم! جميع الأدوات الأساسية في منصة «أدواتي» مجانية 100% وستبقى مجانية دائماً دون أي قيود أو اشتراكات. الاشتراك المدفوع (برو) قادم قريباً وسيكون مخصصاً فقط لميزات إضافية متقدمة دون المساس بمجانية الأدوات الحالية.',
      aEn: 'Yes! All core tools on Adawaty are 100% free and will always remain free forever. The upcoming Pro plan is only for advanced high-volume batch processing and larger file limits, without affecting the existing free tools.',
    },
    {
      qAr: 'كيف تضمنون عدم رفع ملفاتي إلى أي خادم؟',
      qEn: 'How do you guarantee my files are never uploaded to any server?',
      aAr: 'تطبيق "أدواتي" مبني بتقنيات WebAssembly و HTML5 Canvas التي تتيح معالجة ملفات PDF والصور بالكامل داخل متصفح الإنترنت على جهازك. يمكنك فصل الإنترنت بعد تحميل الصفحة وستستمر جميع الأدوات في العمل بكفاءة!',
      aEn: 'Adawaty is built on modern WebAssembly and Canvas APIs allowing 100% in-browser processing. You can even disconnect your internet after loading the page and all tools will continue to work normally!',
    },
    {
      qAr: 'هل الخدمة مجانية فعلاً وبلا اشتراكات مخفية؟',
      qEn: 'Is this service truly free with no hidden fees?',
      aAr: 'نعم، مجانية تماماً وبدون أي اشتراك شهري أو قيود يومية، ونعتمد على إعلانات خفيفة غير مزعجة لدعم استمرارية التطوير وتحديث الأدوات.',
      aEn: 'Yes, completely free forever with no daily quotas or paid plans. We support maintenance via modest, non-intrusive ad placements.',
    },
    {
      qAr: 'هل تعمل الأدوات على الهواتف الذكية؟',
      qEn: 'Do these tools work on mobile phones?',
      aAr: 'نعم بكل تأكيد! تم تصميم الواجهة بنهج الهاتف أولاً بأزرار لمس مريحة وتحميل فوري لجميع الأجهزة الذكية والأجهزة اللوحية.',
      aEn: 'Absolutely! Our interface is crafted mobile-first with generous touch hitboxes and smooth performance on iOS and Android browsers.',
    },
    {
      qAr: 'ما هو الحد الأقصى لحجم الملف المسموح به؟',
      qEn: 'What is the maximum allowed file size?',
      aAr: 'نسمح بملفات تصل حتى 100 ميجابايت للملف الواحد لضمان استقرار وسرعة متصفح هاتفك أو حاسوبك دون استهلاك مفرط للذاكرة.',
      aEn: 'We support files up to 100MB each to ensure flawless browser memory stability and responsive performance.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 py-8 sm:py-12">
      
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        
        {/* Trust badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{t.privacyBadge}</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight text-balance leading-tight sm:leading-tight">
          {t.hero.title}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {t.hero.subtitle}
        </p>

        {/* Live Search Box */}
        <div className="max-w-xl mx-auto relative pt-2">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute start-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.hero.searchPlaceholder}
              className="w-full h-14 ps-12 pe-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute end-4 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {language === 'ar' ? 'مسح' : 'Clear'}
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {[
            { id: 'all', label: t.hero.categories.all },
            { id: 'pdf', label: t.hero.categories.pdf },
            { id: 'image', label: t.hero.categories.image },
            { id: 'text', label: t.hero.categories.text },
            { id: 'calculator', label: t.hero.categories.calculator },
            { id: 'generator', label: t.hero.categories.generator },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-4 py-2 min-h-[44px] rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

      </section>

      {/* Tools Grid Section */}
      <section id="all-tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {filteredTools.length === 0 ? (
          <div className="text-center py-16 text-slate-500 dark:text-slate-400">
            <p className="text-lg font-medium">{t.hero.noResults}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTools.map((tool) => (
              <Link
                key={tool.slug}
                to={tool.category === 'calculator' ? `/calculators/${tool.slug}` : `/tools/${tool.slug}`}
                className="group relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/80 dark:hover:border-blue-500 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                      {renderIcon(tool.iconName)}
                    </div>

                    {/* Unboxed Metadata (following Zero-Pill discipline) */}
                    {tool.badgeAr && (
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        {language === 'ar' ? tool.badgeAr : tool.badgeEn}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                    {language === 'ar' ? tool.titleAr : tool.titleEn}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {language === 'ar' ? tool.descAr : tool.descEn}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:underline pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  <span>{language === 'ar' ? 'ابدأ الاستخدام الآن' : 'Use Tool Now'}</span>
                  <ArrowIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        )}

      </section>

      {/* AdSlot Banner */}
      <div className="max-w-4xl mx-auto px-4">
        <AdSlot placement="content-inline" />
      </div>

      {/* Why Us Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t.whyUs.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {t.whyUs.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. Private */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              {t.whyUs.private.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.whyUs.private.desc}
            </p>
          </div>

          {/* 2. Fast */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              {t.whyUs.fast.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.whyUs.fast.desc}
            </p>
          </div>

          {/* 3. Free */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              {t.whyUs.free.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.whyUs.free.desc}
            </p>
          </div>

          {/* 4. No Signup */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              {t.whyUs.noSignup.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.whyUs.noSignup.desc}
            </p>
          </div>
        </div>
      </section>

      {/* Global FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {language === 'ar' ? 'الأسئلة الأكثر تكراراً' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {language === 'ar'
              ? 'إجابات على كل ما قد يشغل بالك بخصوص أمان ملفاتك وكيفية عمل أدواتي'
              : 'Answers to everything regarding privacy, file security, and how Adawaty works'}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full min-h-[52px] px-6 py-4 flex items-center justify-between text-start gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    {language === 'ar' ? faq.qAr : faq.qEn}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80">
                    {language === 'ar' ? faq.aAr : faq.aEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
