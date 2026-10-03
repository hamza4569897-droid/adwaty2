import React, { useState, useMemo } from 'react';
import { CalculatorShell, ResultItem, CalculationStep } from '../CalculatorShell';
import { calculateBreakEven } from '../../../calc/financial';
import { normalizeDigits, formatNumber, parseInputNumber } from '../../../calc/utils';
import { useApp } from '../../../context/AppContext';

export const BreakEvenCalc: React.FC = () => {
  const { language } = useApp();

  const [fixedCostsStr, setFixedCostsStr] = useState('30000');
  const [unitPriceStr, setUnitPriceStr] = useState('150');
  const [variableCostStr, setVariableCostStr] = useState('90');

  const fixedCosts = parseInputNumber(fixedCostsStr, 0);
  const unitPrice = parseInputNumber(unitPriceStr, 0);
  const variableCost = parseInputNumber(variableCostStr, 0);

  const error = useMemo(() => {
    if (fixedCosts <= 0) return language === 'ar' ? 'التكاليف الثابتة يجب أن تكون أكبر من صفر.' : 'Fixed costs must be greater than zero.';
    if (unitPrice <= 0) return language === 'ar' ? 'سعر بيع الوحدة يجب أن يكون أكبر من صفر.' : 'Unit price must be greater than zero.';
    if (variableCost < 0) return language === 'ar' ? 'التكلفة المتغيرة لا يمكن أن تكون سالبة.' : 'Variable cost cannot be negative.';
    if (unitPrice <= variableCost) {
      return language === 'ar'
        ? 'سعر البيع يجب أن يكون أعلى من التكلفة المتغيرة لتحقيق نقطة التعادل!'
        : 'Unit price must be strictly higher than variable cost!';
    }
    return null;
  }, [fixedCosts, unitPrice, variableCost, language]);

  const result = useMemo(() => {
    if (error) {
      return {
        breakEvenUnits: 0,
        breakEvenRevenue: 0,
        contributionMarginPerUnit: 0,
        contributionMarginRatio: 0,
      };
    }
    return calculateBreakEven(fixedCosts, unitPrice, variableCost);
  }, [fixedCosts, unitPrice, variableCost, error]);

  const resultsList: ResultItem[] = [
    {
      labelAr: 'عدد الوحدات لتحقيق التعادل',
      labelEn: 'Break-Even Units',
      value: `${formatNumber(result.breakEvenUnits, { decimals: 0 })} قطعة`,
      highlight: true,
      sublabelAr: 'حجم المبيعات لتغطية كافة التكاليف',
      sublabelEn: 'Units required to zero profit/loss',
    },
    {
      labelAr: 'إيراد المبيعات عند التعادل',
      labelEn: 'Break-Even Revenue',
      value: `${formatNumber(result.breakEvenRevenue)} ج.م/ريال`,
      sublabelAr: 'إجمالي المبيعات النقدية المطلوبة',
      sublabelEn: 'Revenue required to cover costs',
    },
    {
      labelAr: 'هامش المساهمة للقطعة الواحدة',
      labelEn: 'Unit Contribution Margin',
      value: `${formatNumber(result.contributionMarginPerUnit)} ج.م/ريال (${formatNumber(result.contributionMarginRatio)}%)`,
      sublabelAr: 'سعر البيع - التكلفة المتغيرة',
      sublabelEn: 'Selling price minus variable cost',
    },
  ];

  const steps: CalculationStep[] = [
    {
      titleAr: 'معادلة نقطة التعادل (Break-Even)',
      titleEn: 'Break-Even Formula',
      formula: 'نقطة التعادل (قطع) = التكاليف الثابتة / (سعر البيع - التكلفة المتغيرة)',
      substituted: `${formatNumber(fixedCosts)} / (${formatNumber(unitPrice)} - ${formatNumber(variableCost)}) = ${formatNumber(fixedCosts)} / ${formatNumber(result.contributionMarginPerUnit)} = ${formatNumber(result.breakEvenUnits, { decimals: 0 })} وحدة.`,
      explanationAr: 'نقطة التعادل هي الحد الأدنى من المبيعات الذي تتساوى عنده الإيرادات الإجمالية مع مجموع التكاليف الثابتة والمتغيرة، وتكون الأرباح صفراً.',
    },
  ];

  const handleReset = () => {
    setFixedCostsStr('30000');
    setUnitPriceStr('150');
    setVariableCostStr('90');
  };

  return (
    <CalculatorShell
      titleAr="حاسبة نقطة التعادل وتغطية التكاليف (Break-Even)"
      titleEn="Break-Even Point Calculator"
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
              {language === 'ar' ? 'إجمالي التكاليف الثابتة (إيجار، رواتب، اشتراكات...)' : 'Total Fixed Costs (Rent, Salaries, etc.)'}
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={fixedCostsStr}
              onChange={(e) => setFixedCostsStr(normalizeDigits(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'ar' ? 'سعر بيع القطعة / الوحدة' : 'Selling Price Per Unit'}
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={unitPriceStr}
                onChange={(e) => setUnitPriceStr(normalizeDigits(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'ar' ? 'التكلفة المتغيرة للقطعة (مواد، شحن، عمولة)' : 'Variable Cost Per Unit'}
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={variableCostStr}
                onChange={(e) => setVariableCostStr(normalizeDigits(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>
          </div>
        </>
      )}
    </CalculatorShell>
  );
};
