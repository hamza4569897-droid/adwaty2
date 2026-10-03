import React, { useState, useMemo } from 'react';
import { CalculatorShell, ResultItem, CalculationStep } from '../CalculatorShell';
import { calculateInflation } from '../../../calc/financial';
import { normalizeDigits, formatNumber, parseInputNumber } from '../../../calc/utils';
import { useApp } from '../../../context/AppContext';

export const InflationCalc: React.FC = () => {
  const { language } = useApp();

  const [amountStr, setAmountStr] = useState('10000');
  const [inflationRateStr, setInflationRateStr] = useState('7');
  const [yearsStr, setYearsStr] = useState('5');

  const amount = parseInputNumber(amountStr, 0);
  const inflationRate = parseInputNumber(inflationRateStr, 0);
  const years = parseInputNumber(yearsStr, 0);

  const error = useMemo(() => {
    if (amount <= 0) return language === 'ar' ? 'المبلغ يجب أن يكون أكبر من صفر.' : 'Amount must be greater than zero.';
    if (inflationRate < 0) return language === 'ar' ? 'معدل التضخم لا يمكن أن يكون سالباً.' : 'Inflation rate cannot be negative.';
    if (years <= 0) return language === 'ar' ? 'السنوات يجب أن تكون أكبر من صفر.' : 'Years must be greater than zero.';
    return null;
  }, [amount, inflationRate, years, language]);

  const result = useMemo(() => {
    if (error) {
      return {
        futureEquivalentCost: 0,
        purchasingPowerLossPct: 0,
        futurePurchasingPowerOfSameMoney: 0,
      };
    }
    return calculateInflation(amount, inflationRate, years);
  }, [amount, inflationRate, years, error]);

  const resultsList: ResultItem[] = [
    {
      labelAr: 'المبلغ المطلوب مستقبلاً لنفس السلع',
      labelEn: 'Future Equivalent Cost',
      value: `${formatNumber(result.futureEquivalentCost)} ج.م/ريال`,
      highlight: true,
      sublabelAr: `ما تحتاجه بعد ${years} سنوات لشراء ما قيمته ${formatNumber(amount)} اليوم`,
      sublabelEn: `Future cost of today's goods`,
    },
    {
      labelAr: 'القوة الشرائية المتبقية لنفس المبلغ',
      labelEn: 'Future Purchasing Power of Cash',
      value: `${formatNumber(result.futurePurchasingPowerOfSameMoney)} ج.م/ريال`,
      sublabelAr: `القيمة الحقيقية لمبلغك الحالي إذا ظل دون استثمار`,
      sublabelEn: `Real value if uninvested`,
    },
    {
      labelAr: 'نسبة خسارة القوة الشرائية',
      labelEn: 'Purchasing Power Loss',
      value: `-${formatNumber(result.purchasingPowerLossPct)}%`,
      sublabelAr: `تآكل القيمة التراكمي خلال ${years} سنوات`,
      sublabelEn: 'Cumulative inflation erosion',
    },
  ];

  const steps: CalculationStep[] = [
    {
      titleAr: 'معادلة حساب التضخم والقوة الشرائية',
      titleEn: 'Inflation Formula',
      formula: 'القيمة المستقبلية = المبلغ × (1 + معدل التضخم)^السنوات',
      substituted: `${formatNumber(amount)} × (1 + ${inflationRate}%)^${years} = ${formatNumber(result.futureEquivalentCost)}`,
      explanationAr: 'يوضح التضخم التآكل السنوي المستمر في قيمة النقد، مما يعني أنك تحتاج كمية أكبر من الأموال لشراء نفس السلة من المنتجات والخدمات.',
    },
  ];

  const handleReset = () => {
    setAmountStr('10000');
    setInflationRateStr('7');
    setYearsStr('5');
  };

  return (
    <CalculatorShell
      titleAr="حاسبة التضخم وتآكل القوة الشرائية للعملة"
      titleEn="Inflation & Purchasing Power Calculator"
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
              {language === 'ar' ? 'المبلغ الحالي المراد قياسه (ج.م / ريال / $)' : 'Current Amount of Money'}
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={amountStr}
              onChange={(e) => setAmountStr(normalizeDigits(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'ar' ? 'معدل التضخم السنوي المتوقع (%)' : 'Expected Annual Inflation Rate (%)'}
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={inflationRateStr}
                onChange={(e) => setInflationRateStr(normalizeDigits(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                {language === 'ar' ? 'قابل للتعديل بحسب أرقام البنك المركزي' : 'Editable based on central bank reports'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'ar' ? 'المدة بالسنوات' : 'Time Horizon (Years)'}
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
