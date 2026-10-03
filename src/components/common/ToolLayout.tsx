import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  ArrowLeft,
  ArrowRight,
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
import { useApp } from '../../context/AppContext';
import { ToolDefinition } from '../../types';
import { TOOLS, TOOLS_SEO } from '../../data/toolsData';
import { CALCULATORS, CALCULATORS_SEO } from '../../data/calculatorsData';
import { AdSlot } from './AdSlot';

interface ToolLayoutProps {
  tool: ToolDefinition;
  children: React.ReactNode;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({ tool, children }) => {
  const { language, dir, t } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const seo = TOOLS_SEO[tool.slug] || CALCULATORS_SEO[tool.slug];
  const pageTitle = language === 'ar' ? seo?.metaTitleAr || tool.titleAr : seo?.metaTitleEn || tool.titleEn;
  const pageDesc = language === 'ar' ? seo?.metaDescAr || tool.descAr : seo?.metaDescEn || tool.descEn;
  const h1 = language === 'ar' ? seo?.h1Ar || tool.titleAr : seo?.h1En || tool.titleEn;
  const steps = language === 'ar' ? seo?.stepsAr || [] : seo?.stepsEn || [];
  const benefits = language === 'ar' ? seo?.benefitsAr || [] : seo?.benefitsEn || [];
  const faqs = seo?.faqs || [];

  const allRegistry = [...TOOLS, ...CALCULATORS];
  const relatedTools = (seo?.relatedTools || [])
    .map((slug) => allRegistry.find((t) => t.slug === slug))
    .filter(Boolean) as ToolDefinition[];

  // Update SEO tags and inject JSON-LD
  useEffect(() => {
    document.title = `${pageTitle} | ${t.appName}`;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', pageDesc);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', pageTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', pageDesc);

    // Schema.org FAQPage & SoftwareApplication JSON-LD
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: language === 'ar' ? faq.questionAr : faq.questionEn,
        acceptedAnswer: {
          '@type': 'Answer',
          text: language === 'ar' ? faq.answerAr : faq.answerEn,
        },
      })),
    };

    const toolSchema = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: language === 'ar' ? tool.titleAr : tool.titleEn,
      operatingSystem: 'All',
      applicationCategory: 'UtilitiesApplication',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      description: pageDesc,
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'tool-seo-schema';
    script.textContent = JSON.stringify([toolSchema, faqSchema]);

    const oldScript = document.getElementById('tool-seo-schema');
    if (oldScript) oldScript.remove();
    document.head.appendChild(script);

    window.scrollTo(0, 0);

    return () => {
      const el = document.getElementById('tool-seo-schema');
      if (el) el.remove();
    };
  }, [tool.slug, pageTitle, pageDesc, language]);

  const renderIcon = (name: string, className = 'w-6 h-6') => {
    switch (name) {
      case 'FileStack':
        return <FileStack className={className} />;
      case 'Scissors':
        return <Scissors className={className} />;
      case 'Images':
        return <Images className={className} />;
      case 'Minimize2':
        return <Minimize2 className={className} />;
      case 'Scaling':
        return <Scaling className={className} />;
      case 'RefreshCw':
        return <RefreshCw className={className} />;
      case 'RotateCw':
        return <RotateCw className={className} />;
      case 'Trash2':
        return <Trash2 className={className} />;
      case 'FileImage':
        return <FileImage className={className} />;
      case 'AlignLeft':
        return <AlignLeft className={className} />;
      case 'Calculator':
        return <Calculator className={className} />;
      case 'ArrowRightLeft':
        return <ArrowRightLeft className={className} />;
      case 'Filter':
        return <Filter className={className} />;
      case 'ArrowDownAZ':
        return <ArrowDownAZ className={className} />;
      case 'Type':
        return <Type className={className} />;
      case 'GitCompare':
        return <GitCompare className={className} />;
      case 'FileText':
        return <FileText className={className} />;
      case 'Link2':
        return <Link2 className={className} />;
      case 'Trophy':
        return <Trophy className={className} />;
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
        return <Sparkles className={className} />;
    }
  };

  const BreadcrumbChevron = dir === 'rtl' ? ChevronLeft : ChevronRight;

  return (
    <div className="py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-6"
          aria-label="Breadcrumb"
        >
          <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {t.nav.home}
          </Link>
          <BreadcrumbChevron className="w-3.5 h-3.5 text-slate-400" />
          {tool.category === 'calculator' ? (
            <Link to="/calculators" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {language === 'ar' ? 'حاسبات' : 'Calculators'}
            </Link>
          ) : (
            <span className="capitalize">
              {tool.category === 'pdf'
                ? language === 'ar' ? 'ملفات PDF' : 'PDF'
                : tool.category === 'image'
                ? language === 'ar' ? 'الصور' : 'Images'
                : language === 'ar' ? 'النصوص' : 'Text'}
            </span>
          )}
          <BreadcrumbChevron className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {language === 'ar' ? tool.titleAr : tool.titleEn}
          </span>
        </nav>

        {/* Tool Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mb-4 shadow-sm">
            {renderIcon(tool.iconName, 'w-7 h-7')}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            {h1}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            {language === 'ar' ? tool.descAr : tool.descEn}
          </p>

          {/* Privacy Guarantee Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-medium">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{t.privacyBadge}</span>
          </div>
        </div>

        {/* Main Interactive Tool Workspace */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-4 sm:p-8 mb-8 transition-colors">
          {children}
        </div>

        {/* Monetization Slot below tool */}
        <AdSlot placement="tool-bottom" />

        {/* Rich SEO Content Section */}
        <section className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800 max-w-4xl mx-auto space-y-16">
          
          {/* How to use */}
          {steps.length > 0 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
                {t.common.howToUse}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 relative space-y-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm mb-3">
                      {idx + 1}
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Benefits */}
          {benefits.length > 0 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
                {t.common.whyUse}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {benefits.map((benefit, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2"
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mb-2" />
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {benefit.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inline AdSlot */}
          <AdSlot placement="content-inline" />

          {/* FAQ Accordion */}
          {faqs.length > 0 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
                {t.common.faqTitle}
              </h2>
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
                        className="w-full min-h-[52px] px-5 py-4 flex items-center justify-between text-start gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                        aria-expanded={isOpen}
                      >
                        <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                          {language === 'ar' ? faq.questionAr : faq.questionEn}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-blue-600' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80">
                          {language === 'ar' ? faq.answerAr : faq.answerEn}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Related Tools */}
          {relatedTools.length > 0 && (
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-4">
                {t.common.relatedTools}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedTools.map((relTool) => (
                  <Link
                    key={relTool.slug}
                    to={`/tools/${relTool.slug}`}
                    className="group p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {renderIcon(relTool.iconName, 'w-4 h-4')}
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {language === 'ar' ? relTool.titleAr : relTool.titleEn}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {language === 'ar' ? relTool.descAr : relTool.descEn}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </section>

      </div>
    </div>
  );
};
