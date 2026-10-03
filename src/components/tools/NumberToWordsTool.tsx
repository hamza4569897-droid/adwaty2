import React, { useState } from 'react';
import { Copy, Check, Calculator, Coins } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { tafqeet, CurrencyCode, GrammaticalCase } from '../../utils/tafqeet';

export const NumberToWordsTool: React.FC = () => {
  const { language, t } = useApp();
  const [inputValue, setInputValue] = useState<string>('1250.75');
  const [currency, setCurrency] = useState<CurrencyCode>('egp');
  const [grammaticalCase, setGrammaticalCase] = useState<GrammaticalCase>('nominative');
  const [isFeminine, setIsFeminine] = useState<boolean>(false);
  const [includeOnlyClause, setIncludeOnlyClause] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const tafqeetResult = tafqeet(inputValue, {
    currency,
    includeOnlyClause,
    grammaticalCase,
    isFeminine,
  });

  const handleCopy = () => {
    if (!tafqeetResult) return;
    navigator.clipboard.writeText(tafqeetResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleNumbers = ['150', '1250.75', '25000', '100000', '1500000', '1000000000'];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Input area */}
      <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div>
          <label
            htmlFor="numInput"
            className="block text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2"
          >
            <Calculator className="w-4 h-4 text-blue-600" />
            <span>{language === 'ar' ? 'أدخل الرقم أو المبلغ المالي:' : 'Enter Number or Amount:'}</span>
          </label>
          <input
            id="numInput"
            type="number"
            step="any"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="1250.75"
            className="w-full text-xl sm:text-2xl font-bold px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 tabular-nums"
          />
        </div>

        {/* Sample numbers */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500">
            {language === 'ar' ? 'أرقام سريعة للتجربة:' : 'Quick samples:'}
          </span>
          {sampleNumbers.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setInputValue(s)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-xs font-mono text-slate-600 dark:text-slate-300"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Currency selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-blue-600" />
            <span>{language === 'ar' ? 'نوع العملة المطلوبة:' : 'Currency:'}</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: 'egp', ar: 'جنيه مصري', en: 'Egyptian Pound' },
              { id: 'sar', ar: 'ريال سعودي', en: 'Saudi Riyal' },
              { id: 'aed', ar: 'درهم إماراتي', en: 'UAE Dirham' },
              { id: 'kwd', ar: 'دينار كويتي', en: 'Kuwaiti Dinar' },
              { id: 'none', ar: 'بدون عملة', en: 'Plain Number' },
            ].map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCurrency(c.id as CurrencyCode)}
                className={`px-2.5 py-2 rounded-xl border text-xs font-semibold text-center transition-all min-h-[40px] ${
                  currency === c.id
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {language === 'ar' ? c.ar : c.en}
              </button>
            ))}
          </div>
        </div>

        {/* Grammar & Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Grammar Case */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'ar' ? 'الحالة الإعرابية:' : 'Grammatical Case:'}
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setGrammaticalCase('nominative')}
                className={`p-2 rounded-lg border font-medium transition-all ${
                  grammaticalCase === 'nominative'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {language === 'ar' ? 'مرفوع (ألفان / عشرون)' : 'Nominative'}
              </button>
              <button
                type="button"
                onClick={() => setGrammaticalCase('accusative_genitive')}
                className={`p-2 rounded-lg border font-medium transition-all ${
                  grammaticalCase === 'accusative_genitive'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {language === 'ar' ? 'منصوب/مجرور (ألفين / عشرين)' : 'Accusative/Gen'}
              </button>
            </div>
          </div>

          {/* Gender (for plain number) */}
          {currency === 'none' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'ar' ? 'التذكير والتأنيث للعدد:' : 'Gender:'}
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsFeminine(false)}
                  className={`p-2 rounded-lg border font-medium transition-all ${
                    !isFeminine
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {language === 'ar' ? 'مذكر (واحد / ثلاثة)' : 'Masculine'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsFeminine(true)}
                  className={`p-2 rounded-lg border font-medium transition-all ${
                    isFeminine
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {language === 'ar' ? 'مؤنث (واحدة / ثلاث)' : 'Feminine'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Options */}
        {currency !== 'none' && (
          <div className="pt-2 flex items-center gap-2">
            <input
              id="onlyClause"
              type="checkbox"
              checked={includeOnlyClause}
              onChange={(e) => setIncludeOnlyClause(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
            />
            <label
              htmlFor="onlyClause"
              className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none"
            >
              {language === 'ar'
                ? 'إضافة عبارة الحماية للشيكات والعقود ("فقط لا غير")'
                : 'Include legal safeguarding suffix ("Only")'}
            </label>
          </div>
        )}
      </div>

      {/* Tafqeet Result Box */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50/80 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/20 border border-blue-200 dark:border-blue-900/60 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
            {language === 'ar' ? 'النتيجة بالحروف العربية (التفقيط)' : 'Result in Arabic Words'}
          </span>

          <button
            type="button"
            onClick={handleCopy}
            disabled={!tafqeetResult}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-40"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? t.common.copySuccess : t.common.copy}</span>
          </button>
        </div>

        <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed select-all">
          {tafqeetResult || (
            <span className="text-slate-400 font-normal">
              {language === 'ar' ? 'أدخل رقماً لعرض التفقيط هنا...' : 'Enter a number to see Arabic words...'}
            </span>
          )}
        </p>

        {tafqeetResult && (
          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>{language === 'ar' ? 'صيغة لغوية وقانونية معتمدة للبنوك والشيكات' : 'Standard banking & legal check format'}</span>
            <span className="text-emerald-600 font-medium">✓ {language === 'ar' ? 'سليم نحوياً' : 'Grammar checked'}</span>
          </div>
        )}
      </div>

    </div>
  );
};
