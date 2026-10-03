import React, { useState } from 'react';
import {
  Copy,
  Check,
  Share2,
  RotateCcw,
  ChevronDown,
  Calculator,
  AlertCircle,
  HelpCircle,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { toArabicIndicDigits } from '../../calc/utils';

export interface ResultItem {
  labelAr: string;
  labelEn: string;
  value: string;
  rawValue?: number;
  highlight?: boolean;
  sublabelAr?: string;
  sublabelEn?: string;
}

export interface CalculationStep {
  titleAr: string;
  titleEn: string;
  formula: string;
  substituted: string;
  explanationAr?: string;
  explanationEn?: string;
}

interface CalculatorShellProps {
  titleAr: string;
  titleEn: string;
  descAr?: string;
  descEn?: string;
  categoryType?: 'financial' | 'health' | 'religious' | 'general';
  customNoticeAr?: string;
  customNoticeEn?: string;
  hasEditableRatesNotice?: boolean;
  children: (helpers: {
    useArabicDigits: boolean;
    setUseArabicDigits: (val: boolean) => void;
  }) => React.ReactNode;
  results: ResultItem[];
  steps?: CalculationStep[];
  onReset: () => void;
  onCalculate?: () => void;
  error?: string | null;
  tableContent?: React.ReactNode;
}

export const CalculatorShell: React.FC<CalculatorShellProps> = ({
  titleAr,
  titleEn,
  descAr,
  descEn,
  categoryType = 'financial',
  customNoticeAr,
  customNoticeEn,
  hasEditableRatesNotice = false,
  children,
  results,
  steps,
  onReset,
  onCalculate,
  error,
  tableContent,
}) => {
  const { language, dir } = useApp();
  const [copied, setCopied] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [useArabicDigits, setUseArabicDigits] = useState(false);

  // Copy result text
  const handleCopy = () => {
    const title = language === 'ar' ? titleAr : titleEn;
    const lines = [title, '-----------------'];
    results.forEach((r) => {
      const lbl = language === 'ar' ? r.labelAr : r.labelEn;
      const val = useArabicDigits ? toArabicIndicDigits(r.value) : r.value;
      lines.push(`${lbl}: ${val}`);
    });
    lines.push('-----------------');
    lines.push(window.location.href);

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Share via WhatsApp
  const handleWhatsAppShare = () => {
    const title = language === 'ar' ? titleAr : titleEn;
    const summary = results
      .map((r) => {
        const lbl = language === 'ar' ? r.labelAr : r.labelEn;
        const val = useArabicDigits ? toArabicIndicDigits(r.value) : r.value;
        return `*${lbl}:* ${val}`;
      })
      .join('\n');

    const text = encodeURIComponent(
      `📊 نتيجة ${title}:\n\n${summary}\n\nاحسب بنفسك مجاناً عبر منصة أدواتي:\n${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const isAdvisoryCategory =
    categoryType === 'financial' || categoryType === 'health' || categoryType === 'religious';

  return (
    <div className="space-y-8">
      {/* Top Advisory / Editable Settings Notice */}
      <div className="space-y-2">
        {isAdvisoryCategory && (
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2.5">
            <Info className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>
              {customNoticeAr ||
                (language === 'ar'
                  ? 'تنبيه: هذه الحاسبة للاسترشاد والتخطيط فقط ولا تغني عن استشارة مختص مالي أو طبي.'
                  : 'Notice: This calculator is for estimation only and does not replace professional advice.')}
            </span>
          </div>
        )}

        {hasEditableRatesNotice && (
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 text-blue-800 dark:text-blue-300 text-xs flex items-center gap-2">
            <HelpCircle className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
            <span>
              {language === 'ar'
                ? 'هذه القيم قابلة للتعديل وقد تتغير، راجع الجهة الرسمية أو البنك المعني.'
                : 'Rates and rules are editable and may change over time; verify with official sources.'}
            </span>
          </div>
        )}
      </div>

      {/* Main Grid: Inputs Column & Results Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Input Section */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg">
              <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>{language === 'ar' ? 'البيانات والمدخلات' : 'Inputs & Parameters'}</span>
            </div>

            {/* Digits style switch */}
            <button
              type="button"
              onClick={() => setUseArabicDigits(!useArabicDigits)}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title={language === 'ar' ? 'تبديل شكل الأرقام' : 'Toggle digits language'}
            >
              {useArabicDigits ? 'الأرقام: ١٢٣' : 'الأرقام: 123'}
            </button>
          </div>

          {/* Form controls rendered via render-prop children */}
          <div className="space-y-5">
            {children({ useArabicDigits, setUseArabicDigits })}
          </div>

          {/* Error display */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Action buttons (Calculate & Reset) */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            {onCalculate && (
              <button
                type="button"
                onClick={onCalculate}
                className="flex-1 py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{language === 'ar' ? 'احسب الآن' : 'Calculate'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onReset}
              className="py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer"
              title={language === 'ar' ? 'إعادة ضبط المدخلات' : 'Reset Inputs'}
            >
              <RotateCcw className="w-4 h-4" />
              <span>{language === 'ar' ? 'مسح' : 'Reset'}</span>
            </button>
          </div>
        </div>

        {/* Right / Results Section */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-blue-600/10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-blue-200">
                {language === 'ar' ? 'النتائج المحسوبة' : 'Calculation Results'}
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/20 text-white">
                {language === 'ar' ? 'حساب فوري' : 'Live Calculation'}
              </span>
            </div>

            {/* Results cards */}
            <div className="space-y-4">
              {results.map((r, i) => {
                const label = language === 'ar' ? r.labelAr : r.labelEn;
                const sublabel = language === 'ar' ? r.sublabelAr : r.sublabelEn;
                const displayVal = useArabicDigits ? toArabicIndicDigits(r.value) : r.value;

                return (
                  <div
                    key={i}
                    className={`rounded-2xl p-4 transition-all ${
                      r.highlight
                        ? 'bg-white/20 border border-white/30 backdrop-blur-sm'
                        : 'bg-white/10 border border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs sm:text-sm text-blue-100 font-medium">
                        {label}
                      </span>
                      {sublabel && (
                        <span className="text-[11px] text-blue-200/80 font-normal">
                          {sublabel}
                        </span>
                      )}
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 font-mono">
                      {displayVal}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Share and Copy Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopy}
                className="py-2.5 px-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer backdrop-blur-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>{language === 'ar' ? 'تم النسخ!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'نسخ النتيجة' : 'Copy'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-emerald-600/30"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'مشاركة واتساب' : 'WhatsApp'}</span>
              </button>
            </div>
          </div>

          {/* Calculation Steps Collapsible (عرض الخطوات) */}
          {steps && steps.length > 0 && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => setShowSteps(!showSteps)}
                className="w-full p-4 flex items-center justify-between text-start font-bold text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-blue-600" />
                  <span>{language === 'ar' ? 'عرض خطوات وتفاصيل المعادلة' : 'Show Calculation Steps'}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    showSteps ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>

              {showSteps && (
                <div className="p-4 pt-1 space-y-4 text-xs border-t border-slate-100 dark:border-slate-800">
                  {steps.map((s, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {language === 'ar' ? s.titleAr : s.titleEn}
                      </span>
                      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 font-mono text-[11px] text-slate-700 dark:text-slate-300 space-y-1">
                        <div>
                          <span className="text-slate-400 select-none">المعادلة: </span>
                          <span className="text-blue-600 dark:text-blue-400 font-bold">{s.formula}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 select-none">التعويض: </span>
                          <span>{s.substituted}</span>
                        </div>
                      </div>
                      {s.explanationAr && language === 'ar' && (
                        <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                          {s.explanationAr}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Optional Table Breakdown (e.g. amortization or yearly compound table) */}
      {tableContent && (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
          {tableContent}
        </div>
      )}
    </div>
  );
};
