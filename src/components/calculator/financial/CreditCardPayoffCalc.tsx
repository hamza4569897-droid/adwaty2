import React, { useState, useMemo } from 'react';
import { CalculatorShell, ResultItem, CalculationStep } from '../CalculatorShell';
import { calculateCreditCardPayoff } from '../../../calc/financial';
import { normalizeDigits, formatNumber, parseInputNumber } from '../../../calc/utils';
import { useApp } from '../../../context/AppContext';

export const CreditCardPayoffCalc: React.FC = () => {
  const { language } = useApp();

  const [balanceStr, setBalanceStr] = useState('15000');
  const [aprStr, setAprStr] = useState('24');
  const [paymentStr, setPaymentStr] = useState('800');

  const balance = parseInputNumber(balanceStr, 0);
  const apr = parseInputNumber(aprStr, 0);
  const payment = parseInputNumber(paymentStr, 0);

  const error = useMemo(() => {
    if (balance <= 0) return language === 'ar' ? 'رصيد البطاقة المتبقي يجب أن يكون أكبر من صفر.' : 'Balance must be greater than zero.';
    if (apr < 0) return language === 'ar' ? 'نسبة الفائدة السنوية لا يمكن أن تكون سالبة.' : 'APR cannot be negative.';
    if (payment <= 0) return language === 'ar' ? 'القسط الشهري يجب أن يكون أكبر من صفر.' : 'Monthly payment must be greater than zero.';
    return null;
  }, [balance, apr, payment, language]);

  const result = useMemo(() => {
    if (error) {
      return {
        isImpossible: false,
        minimumPaymentToCoverInterest: 0,
        monthsToPayoff: 0,
        yearsToPayoff: 0,
        totalInterestPaid: 0,
        totalPaid: 0,
      };
    }
    return calculateCreditCardPayoff(balance, apr, payment);
  }, [balance, apr, payment, error]);

  const resultsList: ResultItem[] = result.isImpossible
    ? [
        {
          labelAr: 'تنبيه حرج: لا يمكن سداد البطاقة بهذا القسط!',
          labelEn: 'Critical Warning: Unpayable at this amount!',
          value: 'دفعة غير كافية',
          highlight: true,
          sublabelAr: `القسط أقل من الفائدة الشهرية المتولدة (${formatNumber(result.minimumPaymentToCoverInterest)} ج.م)`,
          sublabelEn: 'Payment lower than monthly interest',
        },
        {
          labelAr: 'الحد الأدنى المطلوب شهرياً لتغطية الفائدة فقط',
          labelEn: 'Minimum Payment to Cover Interest',
          value: `${formatNumber(result.minimumPaymentToCoverInterest)} ج.م/ريال`,
          sublabelAr: 'دون سداد أي مليم من أصل المديونية',
          sublabelEn: 'Interest only charge',
        },
      ]
    : [
        {
          labelAr: 'المدة اللازمة للتخلص من المديونية',
          labelEn: 'Time to Debt Freedom',
          value: `${formatNumber(result.monthsToPayoff, { decimals: 0 })} شهراً`,
          highlight: true,
          sublabelAr: `حوالي ${formatNumber(result.yearsToPayoff, { decimals: 1 })} سنة`,
          sublabelEn: `Approx. ${formatNumber(result.yearsToPayoff, { decimals: 1 })} years`,
        },
        {
          labelAr: 'إجمالي الفوائد البنكية المدفوعة',
          labelEn: 'Total Interest Paid',
          value: `${formatNumber(result.totalInterestPaid)} ج.م/ريال`,
          sublabelAr: 'أرباح البنك الإضافية فوق مشترياتك',
          sublabelEn: 'Interest charges above balance',
        },
        {
          labelAr: 'المبلغ الإجمالي النهائي للسداد',
          labelEn: 'Total Principal + Interest',
          value: `${formatNumber(result.totalPaid)} ج.م/ريال`,
          sublabelAr: 'أصل الرصيد + كامل الفوائد',
          sublabelEn: 'Total cash paid',
        },
      ];

  const steps: CalculationStep[] = [
    {
      titleAr: 'آلية سداد رصيد البطاقة الائتمانية',
      titleEn: 'Credit Card Payoff Mechanism',
      formula: 'الفائدة الشهرية = الرصيد الحالي × (الفائدة السنوية / 12) | سداد الأصل = القسط - الفائدة',
      substituted: `الفائدة في الشهر الأول = ${formatNumber(balance)} × (${apr}% / 12) = ${formatNumber((balance * (apr / 100)) / 12)}. سداد أصل الدين = ${formatNumber(payment)} - ${formatNumber((balance * (apr / 100)) / 12)}.`,
      explanationAr: 'كلما زاد قسطك الشهري عن الحد الأدنى، اتجهت أموالك مباشرة لإطفاء أصل الدين مما يقلل الفوائد التراكمية بشكل دراماتيكي.',
    },
  ];

  const handleReset = () => {
    setBalanceStr('15000');
    setAprStr('24');
    setPaymentStr('800');
  };

  return (
    <CalculatorShell
      titleAr="حاسبة سداد البطاقة الائتمانية والفيزا (Credit Card Payoff)"
      titleEn="Credit Card Payoff Calculator"
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
              {language === 'ar' ? 'الرصيد المتبقي على البطاقة (ج.م / ريال / $)' : 'Current Credit Card Balance'}
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={balanceStr}
              onChange={(e) => setBalanceStr(normalizeDigits(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'ar' ? 'نسبة الفائدة السنوية للبطاقة (APR %)' : 'Annual Percentage Rate (APR %)'}
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={aprStr}
                onChange={(e) => setAprStr(normalizeDigits(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                {language === 'ar' ? 'تتراوح عادة بين 18% إلى 36% سنوياً' : 'Usually 18% to 36% annually'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'ar' ? 'المبلغ المخصص للسداد شهرياً' : 'Monthly Payment Amount'}
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={paymentStr}
                onChange={(e) => setPaymentStr(normalizeDigits(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>
          </div>
        </>
      )}
    </CalculatorShell>
  );
};
