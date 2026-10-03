import React, { useState, useMemo } from 'react';
import { CalculatorShell, ResultItem, CalculationStep } from '../CalculatorShell';
import { calculateTipSplitBill } from '../../../calc/financial';
import { normalizeDigits, formatNumber, parseInputNumber } from '../../../calc/utils';
import { useApp } from '../../../context/AppContext';

export const TipSplitBillCalc: React.FC = () => {
  const { language } = useApp();

  const [billStr, setBillStr] = useState('450');
  const [tipPctStr, setTipPctStr] = useState('12');
  const [peopleStr, setPeopleStr] = useState('4');

  const bill = parseInputNumber(billStr, 0);
  const tipPct = parseInputNumber(tipPctStr, 0);
  const people = parseInputNumber(peopleStr, 1);

  const error = useMemo(() => {
    if (bill <= 0) return language === 'ar' ? 'مبلغ الفاتورة يجب أن يكون أكبر من صفر.' : 'Bill amount must be greater than zero.';
    if (tipPct < 0) return language === 'ar' ? 'نسبة الإكرامية لا يمكن أن تكون سالبة.' : 'Tip percentage cannot be negative.';
    if (people < 1) return language === 'ar' ? 'عدد الأشخاص يجب أن يكون شخصاً واحداً على الأقل.' : 'Number of people must be at least 1.';
    return null;
  }, [bill, tipPct, people, language]);

  const result = useMemo(() => {
    if (error) {
      return {
        tipAmount: 0,
        totalBillWithTip: 0,
        perPersonBill: 0,
        perPersonTip: 0,
        perPersonTotal: 0,
      };
    }
    return calculateTipSplitBill(bill, tipPct, people);
  }, [bill, tipPct, people, error]);

  const resultsList: ResultItem[] = [
    {
      labelAr: 'المطلوب من كل شخص (الشامل)',
      labelEn: 'Total Per Person',
      value: `${formatNumber(result.perPersonTotal)} ج.م/ريال`,
      highlight: true,
      sublabelAr: 'حصّة الفرد شاملة الأكل والخدمة',
      sublabelEn: 'Bill share + tip share',
    },
    {
      labelAr: 'إجمالي الفاتورة مع الإكرامية',
      labelEn: 'Total Bill with Tip',
      value: `${formatNumber(result.totalBillWithTip)} ج.م/ريال`,
      sublabelAr: `الفاتورة الأساسية + ${formatNumber(result.tipAmount)} إكرامية`,
      sublabelEn: 'Total group amount',
    },
    {
      labelAr: 'قيمة الإكرامية لكل فرد',
      labelEn: 'Tip Share Per Person',
      value: `${formatNumber(result.perPersonTip)} ج.م/ريال`,
      sublabelAr: 'مساهمة كل شخص في الإكرامية',
      sublabelEn: 'Per-person tip contribution',
    },
  ];

  const steps: CalculationStep[] = [
    {
      titleAr: 'طريقة تقسيم الفاتورة والإكرامية',
      titleEn: 'Tip & Bill Split Calculation',
      formula: 'الإكرامية = الفاتورة × (النسبة / 100) | نصيب الفرد = (الفاتورة + الإكرامية) / الأشخاص',
      substituted: `الإكرامية = ${formatNumber(bill)} × ${tipPct}% = ${formatNumber(result.tipAmount)}. الإجمالي = ${formatNumber(result.totalBillWithTip)}. نصيب الفرد من ${people} أفراد = ${formatNumber(result.perPersonTotal)}.`,
      explanationAr: 'تضمن المعادلة توزيع الفاتورة والإكرامية بالتساوي وبدون كسور ضائعة.',
    },
  ];

  const handleReset = () => {
    setBillStr('450');
    setTipPctStr('12');
    setPeopleStr('4');
  };

  return (
    <CalculatorShell
      titleAr="حاسبة البقشيش وتقسيم الفاتورة بالتساوي (Tip & Bill Split)"
      titleEn="Tip & Bill Split Calculator"
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
              {language === 'ar' ? 'مبلغ الفاتورة الإجمالي' : 'Total Bill Amount'}
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={billStr}
              onChange={(e) => setBillStr(normalizeDigits(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'ar' ? 'نسبة الإكرامية / البقشيش (%)' : 'Tip Percentage (%)'}
              </label>
              <div className="flex gap-2 mb-2">
                {['10', '12', '15', '20'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setTipPctStr(preset)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      tipPctStr === preset
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {preset}%
                  </button>
                ))}
              </div>
              <input
                type="text"
                inputMode="decimal"
                value={tipPctStr}
                onChange={(e) => setTipPctStr(normalizeDigits(e.target.value))}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'ar' ? 'عدد الأشخاص المقسم بينهم' : 'Number of People'}
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={peopleStr}
                onChange={(e) => setPeopleStr(normalizeDigits(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>
          </div>
        </>
      )}
    </CalculatorShell>
  );
};
