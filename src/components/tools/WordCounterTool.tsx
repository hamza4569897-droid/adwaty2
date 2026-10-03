import React, { useState } from 'react';
import { Copy, Check, Trash2, Sparkles, Clock, FileText, AlignLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { analyzeText, removeTashkeel } from '../../utils/textStats';

export const WordCounterTool: React.FC = () => {
  const { language, t } = useApp();
  const [text, setText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const stats = analyzeText(text);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRemoveTashkeel = () => {
    setText((prev) => removeTashkeel(prev));
  };

  const handleClear = () => {
    setText('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Words */}
        <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-center">
          <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">
            {language === 'ar' ? 'الكلمات' : 'Words'}
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold text-blue-900 dark:text-blue-100 tabular-nums">
            {stats.words.toLocaleString()}
          </p>
        </div>

        {/* Characters with spaces */}
        <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 text-center">
          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-1">
            {language === 'ar' ? 'الحروف (مع المسافات)' : 'Characters (spaces)'}
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-900 dark:text-emerald-100 tabular-nums">
            {stats.characters.toLocaleString()}
          </p>
        </div>

        {/* Characters without spaces */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            {language === 'ar' ? 'الحروف (بدون مسافات)' : 'Characters (no spaces)'}
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
            {stats.charactersNoSpaces.toLocaleString()}
          </p>
        </div>

        {/* Reading Time */}
        <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40 text-center">
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1 flex items-center justify-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'زمن القراءة' : 'Reading Time'}</span>
          </p>
          <p className="text-xl sm:text-2xl font-extrabold text-amber-900 dark:text-amber-100 tabular-nums">
            {stats.readingTimeMinutes > 0
              ? `${stats.readingTimeMinutes} ${language === 'ar' ? 'دقيقة' : 'min'}`
              : `${stats.readingTimeSeconds} ${language === 'ar' ? 'ثانية' : 'sec'}`}
          </p>
        </div>
      </div>

      {/* Secondary Metrics Bar */}
      <div className="flex flex-wrap items-center justify-around gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
        <div>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {language === 'ar' ? 'الفقرات:' : 'Paragraphs:'}{' '}
          </span>
          <span className="font-mono font-bold tabular-nums">{stats.paragraphs}</span>
        </div>
        <div>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {language === 'ar' ? 'الجمل:' : 'Sentences:'}{' '}
          </span>
          <span className="font-mono font-bold tabular-nums">{stats.sentences}</span>
        </div>
        <div>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {language === 'ar' ? 'الحركات والتشكيل:' : 'Arabic Diacritics:'}{' '}
          </span>
          <span className="font-mono font-bold tabular-nums">{stats.diacriticsCount}</span>
        </div>
      </div>

      {/* Editor & Actions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label
            htmlFor="editorTextarea"
            className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
          >
            <AlignLeft className="w-4 h-4 text-blue-600" />
            <span>{language === 'ar' ? 'اكتب أو الصق النص هنا:' : 'Type or paste your text here:'}</span>
          </label>

          <div className="flex items-center gap-2">
            {stats.diacriticsCount > 0 && (
              <button
                type="button"
                onClick={handleRemoveTashkeel}
                className="px-2.5 py-1 rounded-lg text-xs font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 flex items-center gap-1 transition-colors"
                title={language === 'ar' ? 'حذف الحركات والتشكيل' : 'Strip Arabic Diacritics'}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'إزالة التشكيل' : 'Strip Tashkeel'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCopy}
              disabled={!text}
              className="px-2.5 py-1 rounded-lg text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 flex items-center gap-1 transition-colors disabled:opacity-40"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? t.common.copySuccess : t.common.copy}</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={!text}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition-colors disabled:opacity-40"
              title={t.common.clearAll}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <textarea
          id="editorTextarea"
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            language === 'ar'
              ? 'اكتب أو الصق النص هنا للبدء بحساب الكلمات والحروف والفقرات تلقائياً...'
              : 'Type or paste your text here to calculate words, characters, and sentences...'
          }
          className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors resize-y"
        />
      </div>

    </div>
  );
};
