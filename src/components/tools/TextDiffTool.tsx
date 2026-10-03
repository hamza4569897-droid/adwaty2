import React, { useState, useMemo } from 'react';
import { GitCompare, Trash2, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

type DiffType = 'added' | 'removed' | 'unchanged';

interface DiffPart {
  type: DiffType;
  value: string;
}

/**
 * Clean LCS-based diff implementation for words or lines without heavy dependencies
 */
function computeDiff(original: string[], modified: string[]): DiffPart[] {
  const m = original.length;
  const n = modified.length;

  // Build LCS matrix
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (original[i - 1] === modified[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to build diff
  const parts: DiffPart[] = [];
  let i = m;
  let j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && original[i - 1] === modified[j - 1]) {
      parts.push({ type: 'unchanged', value: original[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      parts.push({ type: 'added', value: modified[j - 1] });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      parts.push({ type: 'removed', value: original[i - 1] });
      i--;
    }
  }

  return parts.reverse();
}

export const TextDiffTool: React.FC = () => {
  const { language } = useApp();

  const [textA, setTextA] = useState<string>(
    'أدواتي هي منصة مجانية لمعالجة ملفات PDF والصور محلياً داخل المتصفح.'
  );
  const [textB, setTextB] = useState<string>(
    'أدواتي هي أسرع منصة لمعالجة وتعديل ملفات PDF والصور والنصوص محلياً داخل متصفحك.'
  );

  const [diffMode, setDiffMode] = useState<'words' | 'lines'>('words');

  const diffResult = useMemo(() => {
    if (diffMode === 'words') {
      const tokensA = textA.split(/(\s+)/);
      const tokensB = textB.split(/(\s+)/);
      return computeDiff(tokensA, tokensB);
    } else {
      const linesA = textA.split('\n');
      const linesB = textB.split('\n');
      return computeDiff(linesA, linesB);
    }
  }, [textA, textB, diffMode]);

  const addedCount = diffResult.filter((d) => d.type === 'added' && d.value.trim().length > 0).length;
  const removedCount = diffResult.filter((d) => d.type === 'removed' && d.value.trim().length > 0).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Diff Mode Toggle & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {language === 'ar' ? 'نوع المقارنة:' : 'Comparison Mode:'}
          </span>
          <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setDiffMode('words')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                diffMode === 'words'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {language === 'ar' ? 'مقارنة بالكلمات (Word diff)' : 'Words'}
            </button>
            <button
              type="button"
              onClick={() => setDiffMode('lines')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                diffMode === 'lines'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {language === 'ar' ? 'مقارنة بالأسطر (Line diff)' : 'Lines'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono font-medium">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>+{addedCount} {language === 'ar' ? 'إضافة' : 'added'}</span>
          </span>
          <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>-{removedCount} {language === 'ar' ? 'حذف' : 'removed'}</span>
          </span>
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original Text A */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>{language === 'ar' ? 'النص الأصلي (الأول):' : 'Original Text:'}</span>
            {textA && (
              <button
                type="button"
                onClick={() => setTextA('')}
                className="text-slate-400 hover:text-rose-600 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <textarea
            rows={6}
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            placeholder={language === 'ar' ? 'أدخل النص الأول...' : 'Original text...'}
            className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors resize-y"
          />
        </div>

        {/* Modified Text B */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>{language === 'ar' ? 'النص المعدل (الثاني):' : 'Modified Text:'}</span>
            {textB && (
              <button
                type="button"
                onClick={() => setTextB('')}
                className="text-slate-400 hover:text-rose-600 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <textarea
            rows={6}
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            placeholder={language === 'ar' ? 'أدخل النص الثاني لمقارنته بالأول...' : 'Modified text...'}
            className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors resize-y"
          />
        </div>
      </div>

      {/* Visual Diff Output */}
      <div className="space-y-2">
        <span className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          {language === 'ar' ? 'الفروقات المكتشفة وتلوين التغييرات:' : 'Highlighted Differences:'}
        </span>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm leading-relaxed min-h-[140px] whitespace-pre-wrap font-sans">
          {diffResult.length === 0 || (!textA && !textB) ? (
            <span className="text-slate-400 italic">
              {language === 'ar' ? 'أدخل نصين في الأعلى لرؤية الفروقات الملونة هنا...' : 'Enter texts above to see highlighted diff...'}
            </span>
          ) : (
            diffResult.map((part, idx) => {
              if (part.type === 'added') {
                return (
                  <span
                    key={idx}
                    className="bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-semibold px-1 rounded-sm mx-0.5"
                  >
                    {part.value}
                  </span>
                );
              }
              if (part.type === 'removed') {
                return (
                  <span
                    key={idx}
                    className="bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 line-through px-1 rounded-sm mx-0.5"
                  >
                    {part.value}
                  </span>
                );
              }
              return <span key={idx}>{part.value}</span>;
            })
          )}
        </div>
      </div>
    </div>
  );
};
