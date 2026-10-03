import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, RefreshCw, FlaskConical, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { runAllKnownTests, TestCaseItem } from '../calc/knownTests';
import { useApp } from '../context/AppContext';

export const DevCalcTestsPage: React.FC = () => {
  const { language, dir } = useApp();
  const [tests, setTests] = useState<TestCaseItem[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const executeTests = () => {
    const results = runAllKnownTests();
    setTests(results);
  };

  useEffect(() => {
    executeTests();
  }, []);

  const totalCount = tests.length;
  const passedCount = tests.filter((t) => t.passed).length;
  const failedCount = totalCount - passedCount;
  const allPassed = totalCount > 0 && failedCount === 0;

  const categories = Array.from(new Set(tests.map((t) => t.category)));

  const filteredTests = tests.filter((t) => {
    if (filterCategory === 'all') return true;
    return t.category === filterCategory;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>وحدة الاختبارات البرمجية والتحقق الرياضي (Test Runner)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            فحص دقة معادلات الحاسبات (Known Test Cases)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            يتحقق هذا الفحص التلقائي من تطابق نواتج الدوال الحسابية الصافية في calc/ مع الحالات القياسية المطلوبة.
          </p>
        </div>

        <button
          type="button"
          onClick={executeTests}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-colors shadow-sm shadow-blue-600/20"
        >
          <RefreshCw className="w-4 h-4" />
          <span>إعادة تشغيل الفحوصات</span>
        </button>
      </div>

      {/* Summary Scorecard */}
      <div className={`p-6 rounded-2xl border ${allPassed ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100' : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {allPassed ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-8 h-8 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <div>
              <h2 className="text-lg font-bold">
                {allPassed ? 'جميع الحالات القياسية ناجحة ومطابقة 100%!' : `يوجد ${failedCount} حالات تحتاج مراجعة`}
              </h2>
              <p className="text-xs opacity-80 mt-0.5">
                تم تنفيذ {totalCount} اختبارات دقة رياضية بحسابات نقية بدون أخطاء تقريب.
              </p>
            </div>
          </div>

          <div className="text-end">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono">
              {passedCount} / {totalCount}
            </span>
            <span className="text-xs block opacity-80 font-medium">حالة ناجحة</span>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setFilterCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filterCategory === 'all'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          الكل ({totalCount})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterCategory === cat
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {cat} ({tests.filter((t) => t.category === cat).length})
          </button>
        ))}
      </div>

      {/* Tests Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-start">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 text-start font-semibold">الحالة</th>
                <th className="py-3 px-4 text-start font-semibold">اسم الحاسبة / الاختبار</th>
                <th className="py-3 px-4 text-start font-semibold">التصنيف</th>
                <th className="py-3 px-4 text-start font-semibold">المدخلات المجربة</th>
                <th className="py-3 px-4 text-start font-semibold">المتوقع (Expected)</th>
                <th className="py-3 px-4 text-start font-semibold">الناتج الفعلي (Actual)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {filteredTests.map((t) => (
                <tr
                  key={t.id}
                  className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                    t.passed ? '' : 'bg-rose-50/50 dark:bg-rose-950/20'
                  }`}
                >
                  <td className="py-3 px-4 whitespace-nowrap">
                    {t.passed ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>PASS</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>FAIL</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-sans font-bold text-slate-900 dark:text-white">
                    {t.name}
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-500 dark:text-slate-400 text-xs">
                    {t.category}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 text-xs">
                    {t.inputDescription}
                  </td>
                  <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">
                    {t.expectedOutput}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {t.actualOutput}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Nav */}
      <div className="pt-4 flex items-center justify-between text-xs text-slate-500">
        <Link to="/calculators" className="inline-flex items-center gap-1 hover:text-blue-600 font-semibold">
          <ArrowIcon className="w-4 h-4" />
          <span>العودة لصفحة الحاسبات الرئيسية</span>
        </Link>
        <span>بيئة التطوير والتحقق الداخلي منصة أدواتي</span>
      </div>
    </div>
  );
};
