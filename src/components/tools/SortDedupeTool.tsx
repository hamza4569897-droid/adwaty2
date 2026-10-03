import React, { useState } from 'react';
import { Copy, Check, Trash2, ArrowDownAZ, ArrowUpZA, Shuffle, RotateCcw, ListOrdered, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SortDedupeTool: React.FC = () => {
  const { language, t } = useApp();
  const [inputText, setInputText] = useState<string>(
    'محمد\nأحمد\nخالد\nمحمد\nإبراهيم\nسارة\nأحمد\nزينب'
  );
  const [removeDuplicates, setRemoveDuplicates] = useState<boolean>(true);
  const [numberLines, setNumberLines] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const getLines = (text: string) => {
    return text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
  };

  const processList = (action?: 'sort_asc' | 'sort_desc' | 'reverse' | 'shuffle') => {
    let lines = getLines(inputText);

    if (removeDuplicates) {
      const seen = new Set<string>();
      lines = lines.filter((line) => {
        const lower = line.toLowerCase();
        if (seen.has(lower)) return false;
        seen.add(lower);
        return true;
      });
    }

    if (action === 'sort_asc') {
      lines.sort((a, b) => a.localeCompare(b, 'ar', { sensitivity: 'base' }));
    } else if (action === 'sort_desc') {
      lines.sort((a, b) => b.localeCompare(a, 'ar', { sensitivity: 'base' }));
    } else if (action === 'reverse') {
      lines.reverse();
    } else if (action === 'shuffle') {
      // Fisher-Yates
      for (let i = lines.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lines[i], lines[j]] = [lines[j], lines[i]];
      }
    }

    if (numberLines) {
      lines = lines.map((line, idx) => `${idx + 1}. ${line}`);
    }

    return lines.join('\n');
  };

  const [lastAction, setLastAction] = useState<'sort_asc' | 'sort_desc' | 'reverse' | 'shuffle'>('sort_asc');

  const outputText = processList(lastAction);

  const handleAction = (action: 'sort_asc' | 'sort_desc' | 'reverse' | 'shuffle') => {
    setLastAction(action);
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const rawLinesCount = getLines(inputText).length;
  const outLinesCount = getLines(outputText).length;
  const dupesRemoved = Math.max(0, rawLinesCount - outLinesCount);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Control Actions Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleAction('sort_asc')}
            className={`px-3 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
              lastAction === 'sort_asc'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            <ArrowDownAZ className="w-4 h-4" />
            <span>{language === 'ar' ? 'ترتيب أ - ي (تصاعدي)' : 'Sort A-Z'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleAction('sort_desc')}
            className={`px-3 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
              lastAction === 'sort_desc'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            <ArrowUpZA className="w-4 h-4" />
            <span>{language === 'ar' ? 'ترتيب ي - أ (تنازلي)' : 'Sort Z-A'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleAction('reverse')}
            className={`px-3 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
              lastAction === 'reverse'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>{language === 'ar' ? 'عكس الترتيب' : 'Reverse'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleAction('shuffle')}
            className={`px-3 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
              lastAction === 'shuffle'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            <Shuffle className="w-4 h-4" />
            <span>{language === 'ar' ? 'خلط عشوائي' : 'Shuffle'}</span>
          </button>
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs sm:text-sm">
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300 select-none">
              <input
                type="checkbox"
                checked={removeDuplicates}
                onChange={(e) => setRemoveDuplicates(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
              />
              <span>{language === 'ar' ? 'حذف العناصر المكررة' : 'Remove duplicates'}</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300 select-none">
              <input
                type="checkbox"
                checked={numberLines}
                onChange={(e) => setNumberLines(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
              />
              <span>{language === 'ar' ? 'ترقيم القائمة (1. 2. 3.)' : 'Number lines (1. 2. 3.)'}</span>
            </label>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {language === 'ar'
              ? `إجمالي الأسطر: ${outLinesCount} (تم حذف ${dupesRemoved} مكرر)`
              : `Lines: ${outLinesCount} (${dupesRemoved} duplicates removed)`}
          </div>
        </div>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>{language === 'ar' ? 'القائمة الأصلية (عنصر لكل سطر):' : 'Original List (one per line):'}</span>
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
            placeholder={language === 'ar' ? 'اكتب أو الصق القائمة هنا، كل عنصر في سطر جديد...' : 'Paste your items here, one item per line...'}
            className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors resize-y"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>{language === 'ar' ? 'القائمة بعد الترتيب والتنقية:' : 'Processed List:'}</span>
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
            placeholder={language === 'ar' ? 'ستظهر القائمة المرتبة هنا...' : 'Processed list will appear here...'}
            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-base leading-relaxed focus:outline-none resize-y"
          />
        </div>
      </div>
    </div>
  );
};
