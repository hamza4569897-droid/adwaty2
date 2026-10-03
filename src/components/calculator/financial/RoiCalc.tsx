import React, { useState, useMemo } from 'react';
import { CalculatorShell, ResultItem, CalculationStep } from '../CalculatorShell';
import { calculateROI } from '../../../calc/financial';
import { normalizeDigits, formatNumber, parseInputNumber } from '../../../calc/utils';
import { useApp } from '../../../context/AppContext';

export const RoiCalc: React.FC = () => {
  const { language } = useApp();

  const [initialStr, setInitialStr] = useState('20000');
  const [finalStr, setFinalStr] = useState('28000');
  const [yearsStr, setYearsStr] = useState('2');

  const initial = parseInputNumber(initialStr, 0);
  const finalVal = parseInputNumber(finalStr, 0);
  const years = parseInputNumber(yearsStr, 1);

  const error = useMemo(() => {
    if (initial <= 0) return language === 'ar' ? 'المبلغ المستثمر يجب أن يكون أكبر من صفر.' : 'Initial investment must be greater than zero.';
    if (finalVal < 0) return language === 'ar' ? 'القيمة النهائية لا يمكن أن تكون سالبة.' : 'Final value cannot be negative.';
    if (years <= 0) return language === 'ar' ? 'المدة بالسنوات يجب أن تكون أكبر من صفر.' : 'Years must be greater than zero.';
    return null;
  }, [initial, finalVal, years, language]);

  const result = useMemo(() => {
    if (error) return { netProfit: 0, roiPercentage: 0, annualizedRoi: 0 };
    return calculateROI(initial, finalVal, years);
  }, [initial, finalVal, years, error]);

  const isPositive = result.netProfit >= 0;

  const resultsList: ResultItem[] = [
    {
      labelAr: 'العائد على الاستثمار الإجمالي (ROI)',
      labelEn: 'Total Return on Investment (ROI)',
      value: `${isPositive ? '+' : ''}${formatNumber(result.roiPercentage)}%`,
      highlight: true,
      sublabelAr: 'نسبة الربح من رأس المال المستثمر',
      sublabelEn: 'Net profit percentage',
    },
    {
      labelAr: 'صافي الربح / الخسارة',
      labelEn: 'Net Profit / Loss',
      value: `${isPositive ? '+' : ''}${formatNumber(result.netProfit)} ج.م/ريال`,
      sublabelAr: 'القيمة النهائية - تكلفة الاستثمار',
      sublabelEn: 'Final value minus investment',
    },
    {
      labelAr: 'العائد السنوي المركب (Annualized ROI)',
      labelEn: 'Annualized ROI',
      value: result.annualizedRoi !== undefined ? `${result.annualizedRoi >= 0 ? '+' : ''}${formatNumber(result.annualizedRoi)}%` : '-',
      sublabelAr: `معدل العائد لكل سنة على مدى ${years} سنوات`,
      sublabelEn: `Compound return per year over ${years} years`,
    },
  ];

  const steps: CalculationStep[] = [
    {
      titleAr: 'صيغة العائد على الاستثمار',
      titleEn: 'ROI Formula',
      formula: 'ROI = [(القيمة النهائية - الاستثمار الأصلي) / الاستثمار الأصلي] × 100',
      substituted: `[(${formatNumber(finalVal)} - ${formatNumber(initial)}) / ${formatNumber(initial)}] × 100 = ${formatNumber(result.roiPercentage)}%`,
      explanationAr: 'يقيس العائد على الاستثمار كفاءة وجدوى الأرباح المحققة مقارنة بالتكلفة الرأسمالية الأولية.',
    },
  ];

  const handleReset = () => {
    setInitialStr('20000');
    setFinalStr('28000');
    setYearsStr('2');
  };

  return (
    <CalculatorShell
      titleAr="حاسبة العائد على الاستثمار (ROI Calculator)"
      titleEn="Return on Investment (ROI) Calculator"
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
                {language === 'ar' ? 'المبلغ المستثمر الأصلي' : 'Initial Investment Cost'}
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={initialStr}
                onChange={(e) => setInitialStr(normalizeDigits(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'ar' ? 'القيمة النهائية العائدة (أو سعر البيع)' : 'Final Value / Revenue'}
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={finalStr}
                onChange={(e) => setFinalStr(normalizeDigits(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {language === 'ar' ? 'مدة الاستثمار بالسنوات (لحساب العائد السنوي)' : 'Investment Period (Years)'}
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
