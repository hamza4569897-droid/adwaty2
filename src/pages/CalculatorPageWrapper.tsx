import React, { Suspense, lazy } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { CALCULATORS } from '../data/calculatorsData';
import { ToolLayout } from '../components/common/ToolLayout';

// Batch A Lazy Financial Calculators
const CompoundInterestCalc = lazy(() => import('../components/calculator/financial/CompoundInterestCalc').then((m) => ({ default: m.CompoundInterestCalc })));
const SimpleInterestCalc = lazy(() => import('../components/calculator/financial/SimpleInterestCalc').then((m) => ({ default: m.SimpleInterestCalc })));
const SavingsGoalCalc = lazy(() => import('../components/calculator/financial/SavingsGoalCalc').then((m) => ({ default: m.SavingsGoalCalc })));
const RoiCalc = lazy(() => import('../components/calculator/financial/RoiCalc').then((m) => ({ default: m.RoiCalc })));
const CagrCalc = lazy(() => import('../components/calculator/financial/CagrCalc').then((m) => ({ default: m.CagrCalc })));
const InflationCalc = lazy(() => import('../components/calculator/financial/InflationCalc').then((m) => ({ default: m.InflationCalc })));
const ProfitMarginMarkupCalc = lazy(() => import('../components/calculator/financial/ProfitMarginMarkupCalc').then((m) => ({ default: m.ProfitMarginMarkupCalc })));
const BreakEvenCalc = lazy(() => import('../components/calculator/financial/BreakEvenCalc').then((m) => ({ default: m.BreakEvenCalc })));
const FlatRateInstallmentCalc = lazy(() => import('../components/calculator/financial/FlatRateInstallmentCalc').then((m) => ({ default: m.FlatRateInstallmentCalc })));
const CarLoanCalc = lazy(() => import('../components/calculator/financial/CarLoanCalc').then((m) => ({ default: m.CarLoanCalc })));
const CommissionCalc = lazy(() => import('../components/calculator/financial/CommissionCalc').then((m) => ({ default: m.CommissionCalc })));
const TipSplitBillCalc = lazy(() => import('../components/calculator/financial/TipSplitBillCalc').then((m) => ({ default: m.TipSplitBillCalc })));
const CreditCardPayoffCalc = lazy(() => import('../components/calculator/financial/CreditCardPayoffCalc').then((m) => ({ default: m.CreditCardPayoffCalc })));

export const CalculatorPageWrapper: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const calc = CALCULATORS.find((c) => c.slug === slug);

  if (!calc) {
    return <Navigate to="/calculators" replace />;
  }

  const renderCalculatorComponent = () => {
    switch (calc.slug) {
      case 'compound-interest':
        return <CompoundInterestCalc />;
      case 'simple-interest':
        return <SimpleInterestCalc />;
      case 'savings-goal':
        return <SavingsGoalCalc />;
      case 'roi-calculator':
        return <RoiCalc />;
      case 'cagr-calculator':
        return <CagrCalc />;
      case 'inflation-calculator':
        return <InflationCalc />;
      case 'profit-margin-markup':
        return <ProfitMarginMarkupCalc />;
      case 'break-even':
        return <BreakEvenCalc />;
      case 'flat-rate-installment':
        return <FlatRateInstallmentCalc />;
      case 'car-loan':
        return <CarLoanCalc />;
      case 'commission-calculator':
        return <CommissionCalc />;
      case 'tip-split-bill':
        return <TipSplitBillCalc />;
      case 'credit-card-payoff':
        return <CreditCardPayoffCalc />;
      default:
        return (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <p className="text-slate-500">هذه الحاسبة قيد التجهيز في الحزم القادمة.</p>
          </div>
        );
    }
  };

  return (
    <ToolLayout tool={calc}>
      <Suspense
        fallback={
          <div className="py-16 text-center">
            <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-500">جارٍ تجهيز الحاسبة...</p>
          </div>
        }
      >
        {renderCalculatorComponent()}
      </Suspense>
    </ToolLayout>
  );
};
