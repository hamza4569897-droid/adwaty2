import React, { useState, useMemo } from 'react';
import { CalculatorShell, ResultItem, CalculationStep } from '../CalculatorShell';
import { calculateFlatRateInstallment } from '../../../calc/financial';
import { normalizeDigits, formatNumber, parseInputNumber } from '../../../calc/utils';
import { useApp } from '../../../context/AppContext';

export const FlatRateInstallmentCalc: React.FC = () => {
  const { language } = useApp();

  const [principalStr, setPrincipalStr] = useState('100000');
  const [flatRateStr, setFlatRateStr] = useState('10');
  const [monthsStr, setYearsOrMonths] = useState('36');

  const principal = parseInputNumber(principalStr, 0);
  const flatRate = parseInputNumber(flatRateStr, 0);
  const months = parseInputNumber(monthsStr, 0);

  const error = useMemo(() => {
    if (principal <= 0) return language === 'ar' ? 'مبلغ القسط الأصلي يجب أن يكون أكبر من صفر.' : 'Principal must be greater than zero.';
    if (flatRate < 0) return language === 'ar' ? 'نسبة الفائدة الثابتة لا يمكن أن تكون سالبة.' : 'Flat rate cannot be negative.';
    if (months <= 0) return language === 'ar' ? 'عدد الشهور يجب أن يكون أكبر من صفر.' : 'Months must be greater than zero.';
    return null;
  }, [principal, flatRate, months, language]);

  const result = useMemo(() => {
    if (error) {
      return {
        monthlyInstallment: 0,
        totalInterest: 0,
        totalPayable: 0,
        effectiveAnnualRatePct: 0,
      };
    }
    return calculateFlatRateInstallment(principal, flatRate, months);
  }, [principal, flatRate, months, error]);

  const resultsList: ResultItem[] = [
    {
      labelAr: 'القسط الشهري الثابت',
      labelEn: 'Monthly Installment',
      value: `${formatNumber(result.monthlyInstallment)} ج.م/ريال`,
      highlight: true,
      sublabelAr: `لمدة ${months} شهراً (${formatNumber(months / 12, { decimals: 1 })} سنوات)`,
      sublabelEn: `For ${months} months`,
    },
    {
      labelAr: 'إجمالي الفائدة المضافة',
      labelEn: 'Total Interest Charge',
      value: `${formatNumber(result.totalInterest)} ج.م/ريال`,
      sublabelAr: 'مجموع الفائدة على كامل المدة',
      sublabelEn: 'Total flat fee across term',
    },
    {
      labelAr: 'المبلغ الإجمالي النهائي للسداد',
      labelEn: 'Total Payable Amount',
      value: `${formatNumber(result.totalPayable)} ج.م/ريال`,
      sublabelAr: 'أصل المبلغ + إجمالي الفائدة الثابتة',
      sublabelEn: 'Principal plus all interest',
    },
    {
      labelAr: 'الفائدة الفعلية التناقصية التقريبية (APR)',
      labelEn: 'Approx. Effective APR',
      value: `${formatNumber(result.effectiveAnnualRatePct)}%`,
      sublabelAr: 'الفائدة الحقيقية المعادلة على الرصيد المتناقص',
      sublabelEn: 'True equivalent reducing rate',
    },
  ];

  const steps: CalculationStep[] = [
    {
      titleAr: 'طريقة حساب الفائدة الثابتة (Flat Rate)',
      titleEn: 'Flat Rate Calculation Steps',
      formula: 'إجمالي الفائدة = المبلغ × نسبة الفائدة × (الشهور / 12)',
      substituted: `${formatNumber(principal)} × (${flatRate} / 100) × (${months} / 12) = ${formatNumber(result.totalInterest)}. القسط = (${formatNumber(principal)} + ${formatNumber(result.totalInterest)}) / ${months} = ${formatNumber(result.monthlyInstallment)} شهرياً.`,
      explanationAr: 'في نظام الفائدة الثابتة، تُحسب الفائدة على كامل أصل القرض طوال المدة دون اعتبار للمبالغ التي تم سدادها بالفعل، ولذلك يكون معدل الفائدة الفعلي (APR) أعلى بكثير من النسبة المعلنة.',
    },
  ];

  const handleReset = () => {
    setPrincipalStr('100000');
    setFlatRateStr('10');
    setYearsOrMonths('36');
  };

  return (
    <CalculatorShell
      titleAr="حاسبة القسط الشهري بفائدة ثابتة والفائدة الفعلية"
      titleEn="Flat Rate Installment Calculator"
      categoryType="financial"
      hasEditableRatesNotice={true}
      results={resultsList}
      steps={steps}
      onReset={handleReset}
      error={error}
    >
      {() => (
        <>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {language === 'ar' ? 'مبلغ التمويل / القرض الأصلي (ج.م / ريال / $)' : 'Loan Principal Amount'}
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
                {language === 'ar' ? 'نسبة الفائدة الثابتة السنوية (Flat Rate %)' : 'Annual Flat Rate (%)'}
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={flatRateStr}
                onChange={(e) => setFlatRateStr(normalizeDigits(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                {language === 'ar' ? 'كما يُعلن عنها المعرض أو الشركة' : 'As advertised by dealer or lender'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'ar' ? 'مدة التقسيط بالأشهر' : 'Installment Term (Months)'}
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={monthsStr}
                onChange={(e) => setYearsOrMonths(normalizeDigits(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>
          </div>
        </>
      )}
    </CalculatorShell>
  );
};
