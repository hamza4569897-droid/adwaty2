import React, { useState } from 'react';
import { Copy, Check, Trash2, Sparkles, ArrowRightLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RemoveTashkeelTool: React.FC = () => {
  const { language, t } = useApp();
  const [inputText, setInputText] = useState<string>('مَرْحَبَاً بِكُمْ فِي مَوْقِعِ أَدَوَاتِي الشَّامِلِ لِلْمُسْتَخْدِمِ الْعَرَبِيِّ!');
  const [removeTatweel, setRemoveTatweel] = useState<boolean>(true);
  const [removePunctuation, setRemovePunctuation] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Tashkeel regex: U+064B to U+065F, plus U+0670 (Superscript Alef)
  const TASHKEEL_REGEX = /[\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g;
  const TATWEEL_REGEX = /[\u0640]/g;
  const PUNCT_REGEX = /[،؛؟.!?:,'"()[\]{}«»-]/g;

  let outputText = inputText.replace(TASHKEEL_REGEX, '');
  if (removeTatweel) {
    outputText = outputText.replace(TATWEEL_REGEX, '');
  }
  if (removePunctuation) {
    outputText = outputText.replace(PUNCT_REGEX, '');
  }

  const tashkeelCount = (inputText.match(TASHKEEL_REGEX) || []).length;
  const tatweelCount = (inputText.match(TATWEEL_REGEX) || []).length;

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Options Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800 dark:text-slate-200 select-none">
            <input
              type="checkbox"
              checked={true}
              disabled={true}
              className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
            />
            <span>{language === 'ar' ? 'إزالة حركات التشكيل (الفتحة، الضمة، الكسرة، الشدة...)' : 'Strip Arabic Diacritics (Harakat)'}</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800 dark:text-slate-200 select-none">
            <input
              type="checkbox"
              checked={removeTatweel}
              onChange={(e) => setRemoveTatweel(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
            />
            <span>{language === 'ar' ? 'إزالة التطويل والكشيدة (ـ)' : 'Remove Tatweel / Kashida (ـ)'}</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800 dark:text-slate-200 select-none">
            <input
              type="checkbox"
              checked={removePunctuation}
              onChange={(e) => setRemovePunctuation(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
            />
            <span>{language === 'ar' ? 'إزالة علامات الترقيم العربية' : 'Remove Punctuation'}</span>
          </label>
        </div>

        {/* Stats Pill */}
        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          <span>{language === 'ar' ? `تم حذف ${tashkeelCount} حركة تشكيل` : `${tashkeelCount} diacritics removed`}</span>
          {removeTatweel && tatweelCount > 0 && (
            <span> · {language === 'ar' ? `${tatweelCount} كشيدة` : `${tatweelCount} tatweel`}</span>
          )}
        </div>
      </div>

      {/* Editor Grid: Before & After */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input Textarea */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>{language === 'ar' ? 'النص الأصلي (مع التشكيل):' : 'Original Text (with Tashkeel):'}</span>
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
            placeholder={language === 'ar' ? 'اكتب أو الصق النص العربي المشكول هنا...' : 'Paste Arabic text with tashkeel here...'}
            className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors resize-y"
          />
        </div>

        {/* Output Textarea */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>{language === 'ar' ? 'النص بعد إزالة التشكيل:' : 'Cleaned Text (without Tashkeel):'}</span>
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
            placeholder={language === 'ar' ? 'سوف يظهر النص النظيف هنا تلقائياً...' : 'Cleaned text will appear here automatically...'}
            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-base leading-relaxed focus:outline-none resize-y"
          />
        </div>
      </div>
    </div>
  );
};
