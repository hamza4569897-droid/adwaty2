import React, { useState, useMemo } from 'react';
import { CalculatorShell, ResultItem, CalculationStep } from '../CalculatorShell';
import { calculateProfitMarginMarkup } from '../../../calc/financial';
import { normalizeDigits, formatNumber, parseInputNumber } from '../../../calc/utils';
import { useApp } from '../../../context/AppContext';

export const ProfitMarginMarkupCalc: React.FC = () => {
  const { language } = useApp();

  const [costStr, setCostStr] = useState('80');
  const [priceStr, setPriceStr] = useState('100');

  const cost = parseInputNumber(costStr, 0);
  const price = parseInputNumber(priceStr, 0);

  const error = useMemo(() => {
    if (cost <= 0) return language === 'ar' ? 'التكلفة يجب أن تكون أكبر من صفر.' : 'Cost must be greater than zero.';
    if (price <= 0) return language === 'ar' ? 'سعر البيع يجب أن يكون أكبر من صفر.' : 'Price must be greater than zero.';
    return null;
  }, [cost, price, language]);

  const result = useMemo(() => {
    if (error) return { profit: 0, marginPercentage: 0, markupPercentage: 0, cost: 0, price: 0 };
    return calculateProfitMarginMarkup(cost, price);
  }, [cost, price, error]);

  const resultsList: ResultItem[] = [
    {
      labelAr: 'هامش الربح (Profit Margin)',
      labelEn: 'Profit Margin',
      value: `${formatNumber(result.marginPercentage)}%`,
      highlight: true,
      sublabelAr: 'نسبة الربح من سعر البيع الإجمالي',
      sublabelEn: 'Profit divided by selling price',
    },
    {
      labelAr: 'نسبة الزيادة على التكلفة (Markup)',
      labelEn: 'Markup Percentage',
      value: `${formatNumber(result.markupPercentage)}%`,
      sublabelAr: 'نسبة الربح فوق سعر التكلفة الأصلي',
      sublabelEn: 'Profit divided by cost',
    },
    {
      labelAr: 'صافي الربح النقدي بالقطعة',
      labelEn: 'Gross Profit Per Unit',
      value: `${formatNumber(result.profit)} ج.م/ريال`,
      sublabelAr: 'سعر البيع - التكلفة',
      sublabelEn: 'Selling price minus cost',
    },
  ];

  const steps: CalculationStep[] = [
    {
      titleAr: 'الفرق بين هامش الربح والـ Markup',
      titleEn: 'Margin vs Markup Formula',
      formula: 'Margin = (الربح / البيع) × 100 | Markup = (الربح / التكلفة) × 100',
      substituted: `الربح = ${formatNumber(price)} - ${formatNumber(cost)} = ${formatNumber(result.profit)}. الهامش = (${formatNumber(result.profit)} / ${formatNumber(price)}) = ${formatNumber(result.marginPercentage)}%. الزيادة = (${formatNumber(result.profit)} / ${formatNumber(cost)}) = ${formatNumber(result.markupPercentage)}%.`,
      explanationAr: 'هامش الربح (Margin) يُحسب دائماً كنسبة مئوية من سعر البيع، بينما نسبة الزيادة (Markup) تُحسب كنسبة مئوية من التكلفة.',
    },
  ];

  const handleReset = () => {
    setCostStr('80');
    setPriceStr('100');
  };

  return (
    <CalculatorShell
      titleAr="حاسبة هامش الربح ونسبة الزيادة (Margin & Markup)"
      titleEn="Profit Margin & Markup Calculator"
      categoryType="financial"
      results={resultsList}
      steps={steps}
      onReset={handleReset}
      error={error}
    >
      {() => (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {language === 'ar' ? 'سعر التكلفة (Cost)' : 'Cost of Product'}
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={costStr}
              onChange={(e) => setCostStr(normalizeDigits(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {language === 'ar' ? 'سعر البيع المقترح (Selling Price)' : 'Selling Price'}
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={priceStr}
              onChange={(e) => setPriceStr(normalizeDigits(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 font-mono"
            />
          </div>
        </div>
      )}
    </CalculatorShell>
  );
};
