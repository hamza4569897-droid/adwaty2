import React, { useState, useMemo } from 'react';
import { CalculatorShell, ResultItem, CalculationStep } from '../CalculatorShell';
import { calculateCAGR } from '../../../calc/financial';
import { normalizeDigits, formatNumber, parseInputNumber } from '../../../calc/utils';
import { useApp } from '../../../context/AppContext';

export const CagrCalc: React.FC = () => {
  const { language } = useApp();

  const [startStr, setStartStr] = useState('10000');
  const [endStr, setEndStr] = useState('25000');
  const [yearsStr, setYearsStr] = useState('5');

  const startVal = parseInputNumber(startStr, 0);
  const endVal = parseInputNumber(endStr, 0);
  const years = parseInputNumber(yearsStr, 0);

  const error = useMemo(() => {
    if (startVal <= 0) return language === 'ar' ? 'القيمة الأولية يجب أن تكون أكبر من صفر.' : 'Beginning value must be greater than zero.';
    if (endVal <= 0) return language === 'ar' ? 'القيمة النهائية يجب أن تكون أكبر من صفر.' : 'Ending value must be greater than zero.';
    if (years <= 0) return language === 'ar' ? 'عدد السنوات يجب أن يكون أكبر من صفر.' : 'Years must be greater than zero.';
    return null;
  }, [startVal, endVal, years, language]);

  const result = useMemo(() => {
    if (error) return { cagrPercentage: 0, totalGrowthPercentage: 0, years: 0 };
    return calculateCAGR(startVal, endVal, years);
  }, [startVal, endVal, years, error]);

  const resultsList: ResultItem[] = [
    {
      labelAr: 'معدل النمو السنوي المركب (CAGR)',
      labelEn: 'Compound Annual Growth Rate (CAGR)',
      value: `${formatNumber(result.cagrPercentage)}%`,
      highlight: true,
      sublabelAr: 'النمو السنوي الهندسي الصافي الموحد',
      sublabelEn: 'Geometric average growth rate',
    },
    {
      labelAr: 'إجمالي نسبة النمو التراكمية',
      labelEn: 'Total Growth Percentage',
      value: `${formatNumber(result.totalGrowthPercentage)}%`,
      sublabelAr: `خلال كامل مدة الـ ${years} سنوات`,
      sublabelEn: `Across the entire ${years} years`,
    },
    {
      labelAr: 'الزيادة الصافية في القيمة',
      labelEn: 'Absolute Value Gain',
      value: `${formatNumber(endVal - startVal)} ج.م/ريال`,
      sublabelAr: 'القيمة النهائية - القيمة الأولية',
      sublabelEn: 'Ending value minus beginning value',
    },
  ];

  const steps: CalculationStep[] = [
    {
      titleAr: 'معادلة النمو السنوي المركب (CAGR)',
      titleEn: 'CAGR Formula',
      formula: 'CAGR = [(القيمة النهائية / القيمة الأولية) ^ (1 / السنوات)] - 1',
      substituted: `[(${formatNumber(endVal)} / ${formatNumber(startVal)}) ^ (1 / ${years})] - 1 = ${formatNumber(result.cagrPercentage)}%`,
      explanationAr: 'يمثل CAGR متوسط معدل النمو السنوي لاستثمار ما بافتراض إعادة استثمار الأرباح وتراكبها كل عام.',
    },
  ];

  const handleReset = () => {
    setStartStr('10000');
    setEndStr('25000');
    setYearsStr('5');
  };

  return (
    <CalculatorShell
      titleAr="حاسبة معدل النمو السنوي المركب (CAGR Calculator)"
      titleEn="CAGR Calculator"
      categoryType="financial"
      results={resultsList}
      steps={steps}
      onReset={handleReset}
      error={error}
    >
      {() => (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'ar' ? 'القيمة الأولية (بداية المدة)' : 'Beginning Value'}
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={startStr}
                onChange={(e) => setStartStr(normalizeDigits(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'ar' ? 'القيمة النهائية (نهاية المدة)' : 'Ending Value'}
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={endStr}
                onChange={(e) => setEndStr(normalizeDigits(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {language === 'ar' ? 'المدة بالسنوات' : 'Term in Years'}
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={yearsStr}
              onChange={(e) => setYearsStr(normalizeDigits(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 font-mono"
            />
          </div>
        </>
      )}
    </CalculatorShell>
  );
};
