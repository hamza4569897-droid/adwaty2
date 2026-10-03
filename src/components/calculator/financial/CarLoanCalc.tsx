import React, { useState, useMemo } from 'react';
import { CalculatorShell, ResultItem, CalculationStep } from '../CalculatorShell';
import { calculateCarLoan } from '../../../calc/financial';
import { normalizeDigits, formatNumber, parseInputNumber } from '../../../calc/utils';
import { useApp } from '../../../context/AppContext';

export const CarLoanCalc: React.FC = () => {
  const { language } = useApp();

  const [priceStr, setPriceStr] = useState('100000');
  const [downPaymentStr, setDownPaymentStr] = useState('0');
  const [rateStr, setRateStr] = useState('12');
  const [monthsStr, setMonthsStr] = useState('12');

  const price = parseInputNumber(priceStr, 0);
  const downPayment = parseInputNumber(downPaymentStr, 0);
  const rate = parseInputNumber(rateStr, 0);
  const months = parseInputNumber(monthsStr, 0);

  const error = useMemo(() => {
    if (price <= 0) return language === 'ar' ? 'سعر السيارة يجب أن يكون أكبر من صفر.' : 'Price must be greater than zero.';
    if (downPayment >= price) return language === 'ar' ? 'الدفعة المقدمة تغطي أو تفوق سعر السيارة بالكامل!' : 'Down payment equals or exceeds vehicle price!';
    if (rate < 0) return language === 'ar' ? 'نسبة الفائدة لا يمكن أن تكون سالبة.' : 'Interest rate cannot be negative.';
    if (months <= 0) return language === 'ar' ? 'مدة التمويل بالشهور يجب أن تكون أكبر من صفر.' : 'Months must be greater than zero.';
    return null;
  }, [price, downPayment, rate, months, language]);

  const result = useMemo(() => {
    if (error) {
      return { loanAmount: 0, monthlyPayment: 0, totalPayment: 0, totalInterest: 0, schedule: [] };
    }
    return calculateCarLoan(price, downPayment, rate, months);
  }, [price, downPayment, rate, months, error]);

  const resultsList: ResultItem[] = [
    {
      labelAr: 'القسط الشهري (Monthly Payment)',
      labelEn: 'Monthly Payment',
      value: `${formatNumber(result.monthlyPayment)} ج.م/ريال`,
      highlight: true,
      sublabelAr: `لمدة ${months} شهراً بفائدة بنكية متناقصة`,
      sublabelEn: `For ${months} months`,
    },
    {
      labelAr: 'مبلغ القرض المموّل الفعلي',
      labelEn: 'Loan Principal Financed',
      value: `${formatNumber(result.loanAmount)} ج.م/ريال`,
      sublabelAr: 'سعر السيارة بعد خصم المقدم',
      sublabelEn: 'Vehicle price minus down payment',
    },
    {
      labelAr: 'إجمالي الفوائد البنكية',
      labelEn: 'Total Interest Charge',
      value: `${formatNumber(result.totalInterest)} ج.م/ريال`,
      sublabelAr: 'تكلفة التمويل الصافية فوق أصل القرض',
      sublabelEn: 'Cost of borrowing',
    },
    {
      labelAr: 'إجمالي السداد الكلي مع الفوائد',
      labelEn: 'Total Loan Payments',
      value: `${formatNumber(result.totalPayment)} ج.م/ريال`,
      sublabelAr: 'أصل القرض + كامل الفوائد',
      sublabelEn: 'Principal + total interest',
    },
  ];

  const steps: CalculationStep[] = [
    {
      titleAr: 'معادلة القسط البنكي (Amortization Formula)',
      titleEn: 'Loan Amortization Formula',
      formula: 'M = P × [ r(1+r)^n / ((1+r)^n - 1) ]',
      substituted: `أصل القرض P = ${formatNumber(result.loanAmount)}، معدل شهري r = (${rate}% / 12)، مدة n = ${months} شهر. القسط = ${formatNumber(result.monthlyPayment)}.`,
      explanationAr: 'تعتمد البنوك هذه المعادلة القياسية لحساب القسط المتساوي على الرصيد المتناقص مع جدول استهلاك القرض.',
    },
  ];

  const handleReset = () => {
    setPriceStr('100000');
    setDownPaymentStr('0');
    setRateStr('12');
    setMonthsStr('12');
  };

  return (
    <CalculatorShell
      titleAr="حاسبة قسط السيارة والقرض الشخصي مع جدول الإهلاك"
      titleEn="Car Loan & Auto Finance Calculator"
      categoryType="financial"
      hasEditableRatesNotice={true}
      results={resultsList}
      steps={steps}
      onReset={handleReset}
      error={error}
      tableContent={
        result.schedule.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {language === 'ar' ? 'جدول استهلاك وسداد أقساط القرض (Amortization Schedule)' : 'Loan Amortization Schedule'}
              </h3>
              <span className="text-xs text-slate-500">
                {language === 'ar' ? `${result.schedule.length} قسطاً شهرياً` : `${result.schedule.length} monthly payments`}
              </span>
            </div>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-xs sm:text-sm text-start">
                <thead className="sticky top-0 bg-white dark:bg-slate-900 shadow-xs">
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                    <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'الشهر' : 'Month'}</th>
                    <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'القسط' : 'Payment'}</th>
                    <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'سداد الأصل' : 'Principal'}</th>
                    <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'الفائدة' : 'Interest'}</th>
                    <th className="py-2.5 px-3 text-start font-bold">{language === 'ar' ? 'الرصيد المتبقي' : 'Balance'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {result.schedule.map((row) => (
                    <tr key={row.month} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white">#{row.month}</td>
                      <td className="py-2 px-3 font-mono">{formatNumber(row.payment)}</td>
                      <td className="py-2 px-3 text-emerald-600 font-mono">{formatNumber(row.principalPaid)}</td>
                      <td className="py-2 px-3 text-amber-600 font-mono">{formatNumber(row.interestPaid)}</td>
                      <td className="py-2 px-3 font-mono font-semibold text-slate-900 dark:text-white">{formatNumber(row.remainingBalance)}</td>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'ar' ? 'سعر السيارة الإجمالي' : 'Vehicle Total Price'}
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={priceStr}
                onChange={(e) => setPriceStr(normalizeDigits(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'ar' ? 'الدفعة المقدمة (إن وُجدت)' : 'Down Payment'}
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={downPaymentStr}
                onChange={(e) => setDownPaymentStr(normalizeDigits(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'ar' ? 'نسبة الفائدة البنكية السنوية (%)' : 'Annual Interest Rate (%)'}
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
                {language === 'ar' ? 'مدة التقسيط بالأشهر (مثال: 12، 36، 60)' : 'Loan Term in Months'}
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={monthsStr}
                onChange={(e) => setMonthsStr(normalizeDigits(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>
          </div>
        </>
      )}
    </CalculatorShell>
  );
};
