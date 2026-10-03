import React, { useState, useMemo } from 'react';
import { CalculatorShell, ResultItem, CalculationStep } from '../CalculatorShell';
import { calculateSavingsGoal } from '../../../calc/financial';
import { normalizeDigits, formatNumber, parseInputNumber } from '../../../calc/utils';
import { useApp } from '../../../context/AppContext';

export const SavingsGoalCalc: React.FC = () => {
  const { language } = useApp();

  const [targetStr, setTargetStr] = useState('100000');
  const [yearsStr, setYearsStr] = useState('3');
  const [rateStr, setRateStr] = useState('8');
  const [initialStr, setInitialStr] = useState('10000');

  const target = parseInputNumber(targetStr, 0);
  const years = parseInputNumber(yearsStr, 0);
  const rate = parseInputNumber(rateStr, 0);
  const initial = parseInputNumber(initialStr, 0);

  const error = useMemo(() => {
    if (target <= 0) return language === 'ar' ? 'المبلغ المستهدف يجب أن يكون أكبر من صفر.' : 'Target amount must be greater than zero.';
    if (years <= 0) return language === 'ar' ? 'المدة بالسنوات يجب أن تكون أكبر من صفر.' : 'Years must be greater than zero.';
    if (initial >= target) return language === 'ar' ? 'الرصيد المبدئي حقق الهدف بالفعل أو يتجاوزه!' : 'Initial balance already meets or exceeds target!';
    return null;
  }, [target, years, initial, language]);

  const result = useMemo(() => {
    if (error) return { monthlySavingsNeeded: 0, totalDeposited: 0, totalInterestEarned: 0, monthsCount: 0 };
    return calculateSavingsGoal(target, years, rate, initial);
  }, [target, years, rate, initial, error]);

  const resultsList: ResultItem[] = [
    {
      labelAr: 'الادخار الشهري المطلوب',
      labelEn: 'Required Monthly Savings',
      value: `${formatNumber(result.monthlySavingsNeeded)} ج.م/ريال`,
      highlight: true,
      sublabelAr: `شهرياً لمدة ${result.monthsCount} شهراً`,
      sublabelEn: `Per month for ${result.monthsCount} months`,
    },
    {
      labelAr: 'إجمالي ما ستدفعه من جيبك',
      labelEn: 'Total Principal Saved',
      value: `${formatNumber(result.totalDeposited)} ج.م/ريال`,
      sublabelAr: 'الرصيد المبدئي + مجموع الأقساط',
      sublabelEn: 'Starting + monthly savings',
    },
    {
      labelAr: 'الأرباح والفوائد المساعدة',
      labelEn: 'Interest Earnings Help',
      value: `${formatNumber(result.totalInterestEarned)} ج.م/ريال`,
      sublabelAr: 'مساهمة العائد في تقليل ما تدفعه',
      sublabelEn: 'Compound growth portion',
    },
  ];

  const steps: CalculationStep[] = [
    {
      titleAr: 'صيغة استحقاق الهدف الادخاري',
      titleEn: 'Annuity Formula for Target',
      formula: 'PMT = (FV - P×(1+r)^n) × [ r / ((1+r)^n - 1) ]',
      substituted: `الهدف ${formatNumber(target)} خلال ${years} سنوات (${result.monthsCount} شهر) بمعدل ${rate}% سنوي.`,
      explanationAr: 'تحدد المعادلة القسط الشهري الدقيق المطلوب إيداعه في وعاء ادخاري ذي عائد لتحقيق الرقم المستهدف في الموعد المحدد.',
    },
  ];

  const handleReset = () => {
    setTargetStr('100000');
    setYearsStr('3');
    setRateStr('8');
    setInitialStr('10000');
  };

  return (
    <CalculatorShell
      titleAr="حاسبة خطة الادخار وتحقيق الهدف المالي"
      titleEn="Savings Goal Calculator"
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
                {language === 'ar' ? 'المبلغ المستهدف الوصول إليه' : 'Target Savings Goal'}
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={targetStr}
                onChange={(e) => setTargetStr(normalizeDigits(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'ar' ? 'الرصيد المبدئي الحالي (إن وُجد)' : 'Current Starting Balance'}
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={initialStr}
                onChange={(e) => setInitialStr(normalizeDigits(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'ar' ? 'المدة المحددة (بالسنوات)' : 'Target Timeframe (Years)'}
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={yearsStr}
                onChange={(e) => setYearsStr(normalizeDigits(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'ar' ? 'العائد الاستثماري السنوي المتوقع (%)' : 'Expected Annual Return (%)'}
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={rateStr}
                onChange={(e) => setRateStr(normalizeDigits(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>
          </div>
        </>
      )}
    </CalculatorShell>
  );
};
