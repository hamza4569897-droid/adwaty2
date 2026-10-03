import React, { useState } from 'react';
import { Copy, Check, ArrowRightLeft, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ArabicIndianDigitsTool: React.FC = () => {
  const { language, t } = useApp();
  const [inputText, setInputText] = useState<string>('رقم الهاتف: 01012345678، التاريخ: 2026/10/03، المبلغ: 1500 ج.م');
  const [targetSystem, setTargetSystem] = useState<'arabic_indic' | 'western' | 'persian'>('arabic_indic');
  const [copied, setCopied] = useState<boolean>(false);

  const WESTERN_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const ARABIC_INDIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

  const convertDigits = (text: string, target: 'arabic_indic' | 'western' | 'persian') => {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      let val = -1;

      // Check Western
      const wIdx = WESTERN_DIGITS.indexOf(char);
      if (wIdx !== -1) val = wIdx;

      // Check Arabic Indic
      const aIdx = ARABIC_INDIC_DIGITS.indexOf(char);
      if (aIdx !== -1) val = aIdx;

      // Check Persian
      const pIdx = PERSIAN_DIGITS.indexOf(char);
      if (pIdx !== -1) val = pIdx;

      if (val !== -1) {
        if (target === 'arabic_indic') {
          result += ARABIC_INDIC_DIGITS[val];
        } else if (target === 'persian') {
          result += PERSIAN_DIGITS[val];
        } else {
          result += WESTERN_DIGITS[val];
        }
      } else {
        result += char;
      }
    }
    return result;
  };

  const outputText = convertDigits(inputText, targetSystem);

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Target Selector */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          {language === 'ar' ? 'اختر نظام الأرقام المستهدف للتحويل إليه:' : 'Target Digits System:'}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setTargetSystem('arabic_indic')}
            className={`p-3 rounded-xl border text-center font-bold text-xs sm:text-sm transition-all min-h-[44px] ${
              targetSystem === 'arabic_indic'
                ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {language === 'ar' ? 'أرقام مشرقية عربية (٠ ١ ٢ ٣ ٤ ٥)' : 'Arabic-Indic (٠ ١ ٢ ٣ ٤ ٥)'}
          </button>

          <button
            type="button"
            onClick={() => setTargetSystem('western')}
            className={`p-3 rounded-xl border text-center font-bold text-xs sm:text-sm transition-all min-h-[44px] ${
              targetSystem === 'western'
                ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {language === 'ar' ? 'أرقام إنجليزية / مغربية (0 1 2 3 4 5)' : 'Western / English (0 1 2 3 4 5)'}
          </button>

          <button
            type="button"
            onClick={() => setTargetSystem('persian')}
            className={`p-3 rounded-xl border text-center font-bold text-xs sm:text-sm transition-all min-h-[44px] ${
              targetSystem === 'persian'
                ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {language === 'ar' ? 'أرقام فارسية / أوردو (۰ ۱ ۲ ۳ ۴ ۵)' : 'Persian / Urdu (۰ ۱ ۲ ۳ ۴ ۵)'}
          </button>
        </div>
      </div>

      {/* Inputs & Outputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>{language === 'ar' ? 'النص أو الأرقام الأصلية:' : 'Original Text or Digits:'}</span>
            {inputText && (
              <button
                type="button"
                onClick={() => setInputText('')}
                className="text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.common.clearAll}</span>
              </button>
            )}
          </div>
          <textarea
            rows={10}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={language === 'ar' ? 'اكتب أو الصق أي نص يحتوي على أرقام...' : 'Enter any text containing numbers...'}
            className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors resize-y"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>{language === 'ar' ? 'النتيجة بعد التحويل:' : 'Converted Result:'}</span>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!outputText}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors disabled:opacity-40"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? t.common.copySuccess : t.common.copy}</span>
            </button>
          </div>
          <textarea
            readOnly
            rows={10}
            value={outputText}
            placeholder={language === 'ar' ? 'ستظهر الأرقام المحولة هنا فوراً...' : 'Converted digits will appear here...'}
            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-base leading-relaxed focus:outline-none resize-y"
          />
        </div>
      </div>
    </div>
  );
};
