import React, { useState, useMemo } from 'react';
import { CalculatorShell, ResultItem, CalculationStep } from '../CalculatorShell';
import { calculateSimpleInterest } from '../../../calc/financial';
import { normalizeDigits, formatNumber, parseInputNumber } from '../../../calc/utils';
import { useApp } from '../../../context/AppContext';

export const SimpleInterestCalc: React.FC = () => {
  const { language } = useApp();

  const [principalStr, setPrincipalStr] = useState('50000');
  const [rateStr, setRateStr] = useState('12');
  const [yearsStr, setYearsStr] = useState('3');

  const principal = parseInputNumber(principalStr, 0);
  const rate = parseInputNumber(rateStr, 0);
  const years = parseInputNumber(yearsStr, 0);

  const error = useMemo(() => {
    if (principal <= 0) return language === 'ar' ? 'المبلغ الأصلي يجب أن يكون أكبر من صفر.' : 'Principal must be greater than zero.';
    if (rate < 0) return language === 'ar' ? 'نسبة الفائدة لا يمكن أن تكون سالبة.' : 'Rate cannot be negative.';
    if (years <= 0) return language === 'ar' ? 'المدة بالسنوات يجب أن تكون أكبر من صفر.' : 'Term must be greater than zero.';
    return null;
  }, [principal, rate, years, language]);

  const result = useMemo(() => {
    if (error) return { interest: 0, totalAmount: 0, annualRatePct: 0, years: 0 };
    return calculateSimpleInterest(principal, rate, years);
  }, [principal, rate, years, error]);

  const resultsList: ResultItem[] = [
    {
      labelAr: 'إجمالي الفائدة المكتسبة / المستحقة',
      labelEn: 'Total Simple Interest',
      value: `${formatNumber(result.interest)} ج.م/ريال`,
      highlight: true,
      sublabelAr: 'الأرباح الثابتة بدون تراكب',
      sublabelEn: 'Non-compounded return',
    },
    {
      labelAr: 'المبلغ الإجمالي النهائي',
      labelEn: 'Total Final Amount',
      value: `${formatNumber(result.totalAmount)} ج.م/ريال`,
      sublabelAr: 'أصل المبلغ + إجمالي الفائدة',
      sublabelEn: 'Principal + interest',
    },
    {
      labelAr: 'الفائدة السنوية الثابتة',
      labelEn: 'Annual Interest Amount',
      value: `${formatNumber(years > 0 ? result.interest / years : 0)} ج.م/ريال`,
      sublabelAr: 'لكل سنة من سنوات القرض/الوديعة',
      sublabelEn: 'Per single year',
    },
  ];

  const steps: CalculationStep[] = [
    {
      titleAr: 'قانون الفائدة البسيطة',
      titleEn: 'Simple Interest Formula',
      formula: 'I = P × r × t',
      substituted: `${formatNumber(principal)} × (${rate} / 100) × ${years} = ${formatNumber(result.interest)}`,
      explanationAr: 'في الفائدة البسيطة تُحسب الفائدة بناءً على أصل المبلغ المبدئي فقط دون إضافة الأرباح السابقة إلى الأصل.',
    },
  ];

  const handleReset = () => {
    setPrincipalStr('50000');
    setRateStr('12');
    setYearsStr('3');
  };

  return (
    <CalculatorShell
      titleAr="حاسبة الفائدة البسيطة"
      titleEn="Simple Interest Calculator"
      categoryType="financial"
      results={resultsList}
      steps={steps}
      onReset={handleReset}
      error={error}
    >
      {() => (
        <>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {language === 'ar' ? 'أصل المبلغ (ج.م / ريال / $)' : 'Principal Amount'}
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={principalStr}
              onChange={(e) => setPrincipalStr(normalizeDigits(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'ar' ? 'نسبة الفائدة السنوية (%)' : 'Annual Rate (%)'}
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={rateStr}
                onChange={(e) => setRateStr(normalizeDigits(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 font-mono"
              />
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
          </div>
        </>
      )}
    </CalculatorShell>
  );
};
