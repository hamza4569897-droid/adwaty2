import React, { useState } from 'react';
import { Copy, Check, Link2, Trash2, ArrowRightLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TextToSlugAndUrlTool: React.FC = () => {
  const { language, t } = useApp();
  const [inputText, setInputText] = useState<string>('أفضل أدوات PDF أونلاين مجاناً لسنة 2026!');
  const [separator, setSeparator] = useState<'-' | '_'>('-');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Generate Arabic-friendly slug
  const generateSlug = (text: string, sep: string) => {
    return text
      .trim()
      .toLowerCase()
      // Remove diacritics
      .replace(/[\u064B-\u065F\u0670]/g, '')
      // Replace non-word, non-arabic characters with separator
      .replace(/[^\u0621-\u064Aa-z0-9]+/g, sep)
      // Remove leading or trailing separators
      .replace(new RegExp(`^\\${sep}+|\\${sep}+$`, 'g'), '');
  };

  // URL Encode
  const encodeText = (text: string) => {
    try {
      return encodeURIComponent(text);
    } catch {
      return '';
    }
  };

  // URL Decode
  const decodeText = (text: string) => {
    try {
      return decodeURIComponent(text);
    } catch {
      return language === 'ar' ? 'صيغة ترميز غير صالحة' : 'Invalid encoded URL string';
    }
  };

  const slugResult = generateSlug(inputText, separator);
  const encodedResult = encodeText(inputText);
  const decodedResult = decodeText(inputText);

  const handleCopy = (key: string, text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Input */}
      <div className="space-y-2 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
          <label htmlFor="slugInput" className="flex items-center gap-1.5">
            <Link2 className="w-4 h-4 text-blue-600" />
            <span>{language === 'ar' ? 'أدخل عنوان المقال أو الرابط المراد معالجته:' : 'Enter title or URL string:'}</span>
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
          id="slugInput"
          rows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={language === 'ar' ? 'اكتب عنوان مقال أو رابط مثل: https://example.com/search?q=...' : 'Enter title or encoded URL...'}
          className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-600"
        />

        {/* Separator toggle */}
        <div className="flex items-center gap-3 pt-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <span>{language === 'ar' ? 'الفاصل في الرابط (Slug):' : 'Separator:'}</span>
          <button
            type="button"
            onClick={() => setSeparator('-')}
            className={`px-3 py-1 rounded-lg border transition-colors ${
              separator === '-'
                ? 'border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300'
                : 'border-slate-200 dark:border-slate-700'
            }`}
          >
            {language === 'ar' ? 'شرطة عادية (-)' : 'Hyphen (-)'}
          </button>
          <button
            type="button"
            onClick={() => setSeparator('_')}
            className={`px-3 py-1 rounded-lg border transition-colors ${
              separator === '_'
                ? 'border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300'
                : 'border-slate-200 dark:border-slate-700'
            }`}
          >
            {language === 'ar' ? 'شرطة سفلية (_)' : 'Underscore (_)'}
          </button>
        </div>
      </div>

      {/* Output Results */}
      <div className="space-y-4">
        {/* 1. SEO Slug */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>{language === 'ar' ? 'رابط مقال نظيف (SEO Slug):' : 'Clean SEO URL Slug:'}</span>
            <button
              type="button"
              onClick={() => handleCopy('slug', slugResult)}
              disabled={!slugResult}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors disabled:opacity-40"
            >
              {copiedKey === 'slug' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'slug' ? t.common.copySuccess : t.common.copy}</span>
            </button>
          </div>
          <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono text-sm text-blue-600 dark:text-blue-400 break-all select-all">
            {slugResult || '...'}
          </p>
        </div>

        {/* 2. URL Encode */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>{language === 'ar' ? 'ترميز الرابط (URL Encode):' : 'URL Encoded (encodeURIComponent):'}</span>
            <button
              type="button"
              onClick={() => handleCopy('encode', encodedResult)}
              disabled={!encodedResult}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors disabled:opacity-40"
            >
              {copiedKey === 'encode' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'encode' ? t.common.copySuccess : t.common.copy}</span>
            </button>
          </div>
          <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300 break-all select-all">
            {encodedResult || '...'}
          </p>
        </div>

        {/* 3. URL Decode */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>{language === 'ar' ? 'فك ترميز الرابط (URL Decode):' : 'URL Decoded (decodeURIComponent):'}</span>
            <button
              type="button"
              onClick={() => handleCopy('decode', decodedResult)}
              disabled={!decodedResult}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors disabled:opacity-40"
            >
              {copiedKey === 'decode' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'decode' ? t.common.copySuccess : t.common.copy}</span>
            </button>
          </div>
          <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300 break-all select-all">
            {decodedResult || '...'}
          </p>
        </div>
      </div>
    </div>
  );
};
