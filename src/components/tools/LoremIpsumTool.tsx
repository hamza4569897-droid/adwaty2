import React, { useState } from 'react';
import { Copy, Check, RefreshCw, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const ARABIC_PARAGRAPHS = [
  'هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق. إذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص العربى زيادة عدد الفقرات كما تريد، النص لن يبدو مقسما ولا يحوي أخطاء لغوية.',
  'يمثل هذا المحتوى قالباً تجريبياً يوضع مؤقتاً لتصميم واجهات المواقع والتطبيقات والمطبوعات، مما يساعد المصمم على التركيز على جمالية التوزيع والخطوط دون الانشغال بمحتوى النص النهائي. ويتميز هذا النص بالتدفق الطبيعي للجمل العربية وتناسق الكلمات.',
  'في العصر الرقمي الحديث، أصبحت الحاجة ملحة لوجود نصوص نائبة عربية تراعي خصوصية اللغة من حيث اتجاه الكتابة من اليمين إلى اليسار وتناغم الحروف المتصلة. يمنحك هذا المولد نصوصاً متوازنة تحاكي المقالات والتقارير الصحفية الحقيقية بدقة تامة.',
  'عند تصميم صفحات الهبوط أو النماذج الأولية للمشاريع الرقمية، يمنحك النص التجريبي فكرة واضحة عن كيفية تفاعل الخط العربي مع المساحات البيضاء وتأثيره على تجربة المستخدم النهائية، مما يتيح لك اتخاذ قرارات تصميمية واثقة ومبنية على أسس بصرية سليمة.',
  'تتنوع استخدامات النصوص البديلة بين تصميم الهويات البصرية والكتب والمجلات وتطبيقات الهاتف الذكي، حيث يعكس النص العربي الأصيل هوية المشروع ويبرز جماليات الطباعة والتنسيق قبل اعتماد النسخة النهائية من المحتوى التحريري.',
];

const LATIN_PARAGRAPHS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida.',
  'Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi.',
  'Donec lacus nunc, viverra nec, blandit vel, egestas et, augue. Vestibulum tincidunt malesuada tellus. Ut ultrices ultrices enim. Curabitur sit amet mauris. Morbi in dui quis est pulvinar ullamcorper.',
];

export const LoremIpsumTool: React.FC = () => {
  const { language, t } = useApp();
  const [langType, setLangType] = useState<'ar' | 'la'>('ar');
  const [unit, setUnit] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [count, setCount] = useState<number>(3);
  const [seed, setSeed] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const generateText = () => {
    const paragraphsSource = langType === 'ar' ? ARABIC_PARAGRAPHS : LATIN_PARAGRAPHS;

    if (unit === 'paragraphs') {
      const result: string[] = [];
      for (let i = 0; i < count; i++) {
        const pIndex = (i + seed) % paragraphsSource.length;
        result.push(paragraphsSource[pIndex]);
      }
      return result.join('\n\n');
    }

    if (unit === 'sentences') {
      const allSentences = paragraphsSource
        .join(' ')
        .split(/[.!?؟]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 5);

      const picked: string[] = [];
      for (let i = 0; i < count; i++) {
        picked.push(allSentences[(i + seed) % allSentences.length]);
      }
      const punct = langType === 'ar' ? '؟ ' : '. ';
      return picked.join(punct) + (langType === 'ar' ? '؛' : '.');
    }

    // Words
    const allWords = paragraphsSource.join(' ').split(/\s+/).filter(Boolean);
    const wordsPicked: string[] = [];
    for (let i = 0; i < count; i++) {
      wordsPicked.push(allWords[(i + seed) % allWords.length]);
    }
    return wordsPicked.join(' ');
  };

  const outputText = generateText();

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    setSeed((prev) => prev + 1);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Controls Bar */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Language selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {language === 'ar' ? 'لغة النص البديل:' : 'Placeholder Language:'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLangType('ar')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  langType === 'ar'
                    ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                عربي فصيح
              </button>
              <button
                type="button"
                onClick={() => setLangType('la')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  langType === 'la'
                    ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Latin (Lorem)
              </button>
            </div>
          </div>

          {/* Unit selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {language === 'ar' ? 'نوع التوليد:' : 'Generate By:'}
            </label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as any)}
              className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
            >
              <option value="paragraphs">{language === 'ar' ? 'فقرات كاملة (Paragraphs)' : 'Paragraphs'}</option>
              <option value="sentences">{language === 'ar' ? 'جمل (Sentences)' : 'Sentences'}</option>
              <option value="words">{language === 'ar' ? 'كلمات (Words)' : 'Words'}</option>
            </select>
          </div>

          {/* Quantity selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {language === 'ar' ? `العدد (${count}):` : `Count (${count}):`}
            </label>
            <input
              type="number"
              min="1"
              max={unit === 'words' ? 500 : 25}
              value={count}
              onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
          <button
            type="button"
            onClick={handleRegenerate}
            className="px-4 py-2 min-h-[40px] rounded-xl bg-slate-200/70 hover:bg-slate-300/70 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'توليد نص بديل جديد' : 'Generate New Text'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="px-5 py-2 min-h-[40px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? t.common.copySuccess : t.common.copy}</span>
          </button>
        </div>
      </div>

      {/* Generated Result Box */}
      <div className="space-y-2">
        <textarea
          readOnly
          rows={12}
          value={outputText}
          dir={langType === 'ar' ? 'rtl' : 'ltr'}
          className="w-full p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base leading-relaxed focus:outline-none select-all"
        />
      </div>
    </div>
  );
};
