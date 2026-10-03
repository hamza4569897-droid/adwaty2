import React, { useState, useMemo } from 'react';
import { CalculatorShell, ResultItem, CalculationStep } from '../CalculatorShell';
import { calculateCommission } from '../../../calc/financial';
import { normalizeDigits, formatNumber, parseInputNumber } from '../../../calc/utils';
import { useApp } from '../../../context/AppContext';

export const CommissionCalc: React.FC = () => {
  const { language } = useApp();

  const [salesStr, setSalesStr] = useState('50000');
  const [rateStr, setRateStr] = useState('5');
  const [baseSalaryStr, setBaseSalaryStr] = useState('3000');

  const sales = parseInputNumber(salesStr, 0);
  const rate = parseInputNumber(rateStr, 0);
  const baseSalary = parseInputNumber(baseSalaryStr, 0);

  const error = useMemo(() => {
    if (sales < 0) return language === 'ar' ? 'حجم المبيعات لا يمكن أن يكون سالباً.' : 'Sales amount cannot be negative.';
    if (rate < 0) return language === 'ar' ? 'نسبة العمولة لا يمكن أن تكون سالبة.' : 'Commission rate cannot be negative.';
    if (baseSalary < 0) return language === 'ar' ? 'الراتب الأساسي لا يمكن أن يكون سالباً.' : 'Base salary cannot be negative.';
    return null;
  }, [sales, rate, baseSalary, language]);

  const result = useMemo(() => {
    if (error) return { commissionAmount: 0, totalEarnings: 0, effectiveRatePct: 0 };
    return calculateCommission(sales, rate, baseSalary);
  }, [sales, rate, baseSalary, error]);

  const resultsList: ResultItem[] = [
    {
      labelAr: 'إجمالي الدخل (الراتب + العمولة)',
      labelEn: 'Total Earnings',
      value: `${formatNumber(result.totalEarnings)} ج.م/ريال`,
      highlight: true,
      sublabelAr: 'مجموع المستحقات الصافية',
      sublabelEn: 'Base salary plus commission',
    },
    {
      labelAr: 'قيمة عمولة المبيعات',
      labelEn: 'Sales Commission Amount',
      value: `${formatNumber(result.commissionAmount)} ج.م/ريال`,
      sublabelAr: `${rate}% من إجمالي المبيعات`,
      sublabelEn: `${rate}% of total sales`,
    },
    {
      labelAr: 'الراتب الأساسي الثابت',
      labelEn: 'Base Salary',
      value: `${formatNumber(baseSalary)} ج.م/ريال`,
      sublabelAr: 'الدخل المضمون بدون عمولة',
      sublabelEn: 'Fixed base pay',
    },
  ];

  const steps: CalculationStep[] = [
    {
      titleAr: 'طريقة حساب عمولة المبيعات',
      titleEn: 'Commission Calculation',
      formula: 'العمولة = حجم المبيعات × (نسبة العمولة / 100)',
      substituted: `${formatNumber(sales)} × (${rate} / 100) = ${formatNumber(result.commissionAmount)}. الإجمالي = ${formatNumber(baseSalary)} + ${formatNumber(result.commissionAmount)} = ${formatNumber(result.totalEarnings)}.`,
      explanationAr: 'تُحسب العمولة كنسبة مئوية مباشرة من إجمالي قيمة المبيعات أو الصفقات المحققة وتُضاف إلى الراتب الأساسي.',
    },
  ];

  const handleReset = () => {
    setSalesStr('50000');
    setRateStr('5');
    setBaseSalaryStr('3000');
  };

  return (
    <CalculatorShell
      titleAr="حاسبة عمولة المبيعات وإجمالي الأرباح"
      titleEn="Sales Commission Calculator"
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
              {language === 'ar' ? 'إجمالي قيمة المبيعات أو الصفقات' : 'Total Sales Volume'}
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={salesStr}
              onChange={(e) => setSalesStr(normalizeDigits(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'ar' ? 'نسبة العمولة المئوية (%)' : 'Commission Rate (%)'}
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
                {language === 'ar' ? 'الراتب الأساسي الثابت (إن وُجد)' : 'Base Salary (Optional)'}
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={baseSalaryStr}
                onChange={(e) => setBaseSalaryStr(normalizeDigits(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>
          </div>
        </>
      )}
    </CalculatorShell>
  );
};
