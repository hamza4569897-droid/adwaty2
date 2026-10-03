import React, { useState } from 'react';
import { Copy, Check, Trash2, Type } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CaseConverterTool: React.FC = () => {
  const { language, t } = useApp();
  const [inputText, setInputText] = useState<string>('Welcome to Adawaty free client-side tools');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const toWords = (str: string) => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[_\-]+/g, ' ')
      .trim()
      .split(/\s+/);
  };

  const cases = [
    {
      id: 'upper',
      nameAr: 'أحرف كبيرة (UPPERCASE)',
      nameEn: 'UPPERCASE',
      convert: (str: string) => str.toUpperCase(),
    },
    {
      id: 'lower',
      nameAr: 'أحرف صغيرة (lowercase)',
      nameEn: 'lowercase',
      convert: (str: string) => str.toLowerCase(),
    },
    {
      id: 'title',
      nameAr: 'بداية كل كلمة كبير (Title Case)',
      nameEn: 'Title Case',
      convert: (str: string) =>
        str.replace(/\b\w/g, (char) => char.toUpperCase()),
    },
    {
      id: 'sentence',
      nameAr: 'بداية كل جملة كبير (Sentence case)',
      nameEn: 'Sentence case',
      convert: (str: string) =>
        str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()),
    },
    {
      id: 'camel',
      nameAr: 'سنام الجمل (camelCase)',
      nameEn: 'camelCase',
      convert: (str: string) => {
        const words = toWords(str);
        if (!words.length) return '';
        return (
          words[0].toLowerCase() +
          words
            .slice(1)
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join('')
        );
      },
    },
    {
      id: 'snake',
      nameAr: 'حالة الثعبان (snake_case)',
      nameEn: 'snake_case',
      convert: (str: string) =>
        toWords(str)
          .map((w) => w.toLowerCase())
          .join('_'),
    },
    {
      id: 'kebab',
      nameAr: 'حالة الكباب (kebab-case)',
      nameEn: 'kebab-case',
      convert: (str: string) =>
        toWords(str)
          .map((w) => w.toLowerCase())
          .join('-'),
    },
    {
      id: 'constant',
      nameAr: 'ثوابت برمجية (CONSTANT_CASE)',
      nameEn: 'CONSTANT_CASE',
      convert: (str: string) =>
        toWords(str)
          .map((w) => w.toUpperCase())
          .join('_'),
    },
  ];

  const handleCopy = (id: string, text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Input Textarea */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
          <label htmlFor="caseInput" className="flex items-center gap-1.5">
            <Type className="w-4 h-4 text-blue-600" />
            <span>{language === 'ar' ? 'أدخل النص الإنجليزي المراد تحويل حالته:' : 'Enter text to convert case:'}</span>
          </label>
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
          id="caseInput"
          rows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type or paste English text here..."
          className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
        />
      </div>

      {/* Grid of All Converted Results */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {language === 'ar' ? 'جميع صيغ وحالات الأحرف (انقر للنسخ الفوري):' : 'All Case Formats (Click to copy):'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {cases.map((c) => {
            const val = c.convert(inputText);
            const isCopied = copiedKey === c.id;

            return (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-900 transition-all flex flex-col justify-between gap-2 shadow-2xs"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span>{language === 'ar' ? c.nameAr : c.nameEn}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(c.id, val)}
                    disabled={!val}
                    className="p-1 px-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-600 dark:text-blue-400 text-xs font-medium flex items-center gap-1 transition-colors disabled:opacity-40"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? t.common.copySuccess : t.common.copy}</span>
                  </button>
                </div>

                <p className="text-sm font-mono font-medium text-slate-900 dark:text-white break-all select-all pt-1">
                  {val || <span className="text-slate-400 font-sans italic text-xs">...</span>}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
