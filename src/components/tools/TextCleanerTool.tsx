import React, { useState } from 'react';
import { Copy, Check, Trash2, Sparkles, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TextCleanerTool: React.FC = () => {
  const { language, t } = useApp();
  const [inputText, setInputText] = useState<string>(
    '  هذا   نص   تجريبي    يحتوي   على   مسافات   كثيرة   \n\n\nوهذا سطر آخر\nوهذا سطر مكرر\nوهذا سطر مكرر\n\n\nوسطر أخير  '
  );

  const [removeExtraSpaces, setRemoveExtraSpaces] = useState<boolean>(true);
  const [removeEmptyLines, setRemoveEmptyLines] = useState<boolean>(true);
  const [removeDuplicateLines, setRemoveDuplicateLines] = useState<boolean>(true);
  const [trimLines, setTrimLines] = useState<boolean>(true);
  const [removeAllLineBreaks, setRemoveAllLineBreaks] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const cleanText = (raw: string) => {
    if (!raw) return '';
    let result = raw;

    if (trimLines) {
      result = result
        .split('\n')
        .map((line) => line.trim())
        .join('\n');
    }

    if (removeExtraSpaces) {
      result = result.replace(/[ \t]+/g, ' ');
    }

    if (removeEmptyLines) {
      result = result
        .split('\n')
        .filter((line) => line.trim() !== '')
        .join('\n');
    }

    if (removeDuplicateLines) {
      const seen = new Set<string>();
      result = result
        .split('\n')
        .filter((line) => {
          if (seen.has(line)) return false;
          seen.add(line);
          return true;
        })
        .join('\n');
    }

    if (removeAllLineBreaks) {
      result = result.replace(/\n+/g, ' ').trim();
      if (removeExtraSpaces) {
        result = result.replace(/[ \t]+/g, ' ');
      }
    }

    return result;
  };

  const outputText = cleanText(inputText);

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const originalLines = inputText ? inputText.split('\n').length : 0;
  const cleanedLines = outputText ? outputText.split('\n').length : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Cleaning options */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>{language === 'ar' ? 'خيارات التنظيف المطلوبة:' : 'Cleaning Options:'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs sm:text-sm">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300 select-none">
            <input
              type="checkbox"
              checked={removeExtraSpaces}
              onChange={(e) => setRemoveExtraSpaces(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
            />
            <span>{language === 'ar' ? 'إزالة المسافات الزائدة والمتكررة' : 'Remove extra spaces'}</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300 select-none">
            <input
              type="checkbox"
              checked={removeEmptyLines}
              onChange={(e) => setRemoveEmptyLines(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
            />
            <span>{language === 'ar' ? 'حذف الأسطر الفارغة' : 'Remove empty lines'}</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300 select-none">
            <input
              type="checkbox"
              checked={removeDuplicateLines}
              onChange={(e) => setRemoveDuplicateLines(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
            />
            <span>{language === 'ar' ? 'حذف الأسطر المكررة' : 'Remove duplicate lines'}</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300 select-none">
            <input
              type="checkbox"
              checked={trimLines}
              onChange={(e) => setTrimLines(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
            />
            <span>{language === 'ar' ? 'مسح المسافات من أطراف السطور (Trim)' : 'Trim leading/trailing spaces'}</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300 select-none">
            <input
              type="checkbox"
              checked={removeAllLineBreaks}
              onChange={(e) => setRemoveAllLineBreaks(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
            />
            <span>{language === 'ar' ? 'تحويل لسطر واحد (إزالة الفواصل)' : 'Remove all line breaks'}</span>
          </label>
        </div>

        {/* Stats */}
        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
          <span>{language === 'ar' ? `الأسطر: ${originalLines} → ${cleanedLines}` : `Lines: ${originalLines} → ${cleanedLines}`}</span>
          <span>{language === 'ar' ? `الحروف: ${inputText.length} → ${outputText.length}` : `Chars: ${inputText.length} → ${outputText.length}`}</span>
        </div>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>{language === 'ar' ? 'النص قبل التنظيف:' : 'Input Text:'}</span>
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
            placeholder={language === 'ar' ? 'الصق النص المراد تنظيفه هنا...' : 'Paste text to clean here...'}
            className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors resize-y"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>{language === 'ar' ? 'النص النظيف:' : 'Cleaned Output:'}</span>
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
            placeholder={language === 'ar' ? 'سيظهر النص النظيف هنا...' : 'Cleaned text will appear here...'}
            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-base leading-relaxed focus:outline-none resize-y"
          />
        </div>
      </div>
    </div>
  );
};
