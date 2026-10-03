import React, { useState, useMemo } from 'react';
import { CalculatorShell, ResultItem, CalculationStep } from '../CalculatorShell';
import { calculateCompoundInterest } from '../../../calc/financial';
import { normalizeDigits, formatNumber, parseInputNumber } from '../../../calc/utils';
import { useApp } from '../../../context/AppContext';

export const CompoundInterestCalc: React.FC = () => {
  const { language } = useApp();

  // Inputs
  const [principalStr, setPrincipalStr] = useState('10000');
  const [rateStr, setRateStr] = useState('10');
  const [yearsStr, setYearsStr] = useState('5');
  const [frequency, setFrequency] = useState<'yearly' | 'semiannual' | 'quarterly' | 'monthly'>('yearly');
  const [monthlyDepositStr, setMonthlyDepositStr] = useState('0');

  // Parse & Calculate
  const principal = parseInputNumber(principalStr, 0);
  const rate = parseInputNumber(rateStr, 0);
  const years = parseInputNumber(yearsStr, 0);
  const monthlyDeposit = parseInputNumber(monthlyDepositStr, 0);

  const error = useMemo(() => {
    if (principal < 0) return language === 'ar' ? 'المبلغ الأصلي لا يمكن أن يكون سالباً.' : 'Principal cannot be negative.';
    if (rate < 0) return language === 'ar' ? 'نسبة الفائدة لا يمكن أن تكون سالبة.' : 'Rate cannot be negative.';
    if (years <= 0) return language === 'ar' ? 'يرجى إدخال عدد سنوات أكبر من صفر.' : 'Years must be greater than zero.';
    return null;
  }, [principal, rate, years, language]);

  const result = useMemo(() => {
    if (error) return { finalBalance: 0, totalPrincipal: 0, totalInterest: 0, yearlyBreakdown: [] };
    return calculateCompoundInterest(principal, rate, years, frequency, monthlyDeposit);
  }, [principal, rate, years, frequency, monthlyDeposit, error]);

  const resultsList: ResultItem[] = [
    {
      labelAr: 'الرصيد النهائي الإجمالي',
      labelEn: 'Total Final Balance',
      value: `${formatNumber(result.finalBalance)} ج.م/ريال`,
      highlight: true,
      sublabelAr: 'أصل المبلغ + الأرباح المركبة',
      sublabelEn: 'Principal + Total Interest',
    },
    {
      labelAr: 'إجمالي الأرباح والفوائد',
      labelEn: 'Total Interest Earned',
      value: `${formatNumber(result.totalInterest)} ج.م/ريال`,
      sublabelAr: 'صافي العائد التراكمي',
      sublabelEn: 'Compounded earnings',
    },
    {
      labelAr: 'إجمالي المبالغ المودعة',
      labelEn: 'Total Principal Deposited',
      value: `${formatNumber(result.totalPrincipal)} ج.م/ريال`,
      sublabelAr: 'المبلغ المبدئي + الإيداعات الشهرية',
      sublabelEn: 'Initial + monthly deposits',
    },
  ];

  const steps: CalculationStep[] = [
    {
      titleAr: 'صيغة الفائدة المركبة',
      titleEn: 'Compound Interest Formula',
      formula: 'A = P × (1 + r/n)^(n×t) + إيداعات',
      substituted: `${formatNumber(principal)} × (1 + ${rate}%/${frequency === 'yearly' ? 1 : frequency === 'monthly' ? 12 : frequency === 'quarterly' ? 4 : 2})^(${years} سنوات)`,
      explanationAr: 'الفائدة المركبة تضيف الأرباح المحققة دورياً إلى أصل المبلغ، مما يضاعف العائد بمرور الوقت مقارنة بالفائدة البسيطة.',
    },
  ];

  const handleReset = () => {
    setPrincipalStr('10000');
    setRateStr('10');
    setYearsStr('5');
    setFrequency('yearly');
    setMonthlyDepositStr('0');
  };

  return (
    <CalculatorShell
      titleAr="حاسبة الفائدة المركبة والأرباح التراكمية"
      titleEn="Compound Interest Calculator"
      categoryType="financial"
      results={resultsList}
      steps={steps}
      onReset={handleReset}
      error={error}
      tableContent={
        result.yearlyBreakdown.length > 0 ? (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {language === 'ar' ? 'الجدول السنوي لتراكم الأرباح' : 'Yearly Compounding Breakdown'}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-start">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                    <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'السنة' : 'Year'}</th>
                    <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'رصيد البداية' : 'Start Balance'}</th>
                    <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'الإيداعات' : 'Deposits'}</th>
                    <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'الفائدة المكتسبة' : 'Interest'}</th>
                    <th className="py-2.5 px-3 text-start font-bold">{language === 'ar' ? 'رصيد النهاية' : 'End Balance'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {result.yearlyBreakdown.map((row) => (
                    <tr key={row.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white">{row.year}</td>
                      <td className="py-2 px-3">{formatNumber(row.startBalance)}</td>
                      <td className="py-2 px-3">{formatNumber(row.contributions)}</td>
                      <td className="py-2 px-3 text-emerald-600 font-medium">+{formatNumber(row.interestEarned)}</td>
                      <td className="py-2 px-3 font-bold text-blue-600 dark:text-blue-400">{formatNumber(row.endBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null
      }
    >
      {() => (
        <>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {language === 'ar' ? 'أصل المبلغ المبدئي (ج.م / ريال / $)' : 'Initial Principal Amount'}
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
                {language === 'ar' ? 'نسبة الفائدة السنوية (%)' : 'Annual Interest Rate (%)'}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'ar' ? 'دورية تراكب الفائدة' : 'Compounding Frequency'}
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600"
              >
                <option value="yearly">{language === 'ar' ? 'سنوياً (مرة كل سنة)' : 'Annually'}</option>
                <option value="semiannual">{language === 'ar' ? 'نصف سنوي (مرتان بالعام)' : 'Semi-annually'}</option>
                <option value="quarterly">{language === 'ar' ? 'ربع سنوي (4 مرات بالعام)' : 'Quarterly'}</option>
                <option value="monthly">{language === 'ar' ? 'شهرياً (12 مرة بالعام)' : 'Monthly'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'ar' ? 'إيداع شهري إضافي (اختياري)' : 'Optional Monthly Deposit'}
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={monthlyDepositStr}
                onChange={(e) => setMonthlyDepositStr(normalizeDigits(e.target.value))}
                placeholder="0"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>
          </div>
        </>
      )}
    </CalculatorShell>
  );
};
