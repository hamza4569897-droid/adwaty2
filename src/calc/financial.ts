/**
 * Pure financial calculation formulas for Adawaty.
 * Separate from UI to allow thorough unit testing and zero floating point rounding errors.
 */

import { round } from './utils';

// 1. Compound Interest
export interface CompoundInterestResult {
  finalBalance: number;
  totalPrincipal: number;
  totalInterest: number;
  yearlyBreakdown: {
    year: number;
    startBalance: number;
    contributions: number;
    interestEarned: number;
    endBalance: number;
  }[];
}

export function calculateCompoundInterest(
  principal: number,
  annualRatePct: number,
  years: number,
  frequency: 'yearly' | 'semiannual' | 'quarterly' | 'monthly' = 'yearly',
  monthlyDeposit = 0
): CompoundInterestResult {
  if (principal < 0 || annualRatePct < 0 || years <= 0) {
    return { finalBalance: 0, totalPrincipal: 0, totalInterest: 0, yearlyBreakdown: [] };
  }

  const freqMap = {
    yearly: 1,
    semiannual: 2,
    quarterly: 4,
    monthly: 12,
  };
  const n = freqMap[frequency] || 1;
  const rate = annualRatePct / 100;

  // Month-by-month simulation for exact compounding + monthly deposits
  let currentBalance = principal;
  let totalDeposited = principal;
  const yearlyBreakdown: CompoundInterestResult['yearlyBreakdown'] = [];

  const totalMonths = Math.round(years * 12);
  const monthlyRate = Math.pow(1 + rate / n, n / 12) - 1;

  let currentYearStartBalance = principal;
  let currentYearContributions = 0;
  let currentYearInterest = 0;

  for (let m = 1; m <= totalMonths; m++) {
    // Interest earned this month on current balance
    const interestThisMonth = currentBalance * monthlyRate;
    currentBalance += interestThisMonth;
    currentYearInterest += interestThisMonth;

    // Monthly deposit at end of month
    if (monthlyDeposit > 0) {
      currentBalance += monthlyDeposit;
      totalDeposited += monthlyDeposit;
      currentYearContributions += monthlyDeposit;
    }

    // Check if end of year or final month
    if (m % 12 === 0 || m === totalMonths) {
      const yearIndex = Math.ceil(m / 12);
      yearlyBreakdown.push({
        year: yearIndex,
        startBalance: round(currentYearStartBalance, 2),
        contributions: round(currentYearContributions, 2),
        interestEarned: round(currentYearInterest, 2),
        endBalance: round(currentBalance, 2),
      });
      currentYearStartBalance = currentBalance;
      currentYearContributions = 0;
      currentYearInterest = 0;
    }
  }

  return {
    finalBalance: round(currentBalance, 2),
    totalPrincipal: round(totalDeposited, 2),
    totalInterest: round(currentBalance - totalDeposited, 2),
    yearlyBreakdown,
  };
}

// 2. Simple Interest
export interface SimpleInterestResult {
  interest: number;
  totalAmount: number;
  annualRatePct: number;
  years: number;
}

export function calculateSimpleInterest(
  principal: number,
  annualRatePct: number,
  years: number
): SimpleInterestResult {
  if (principal <= 0 || annualRatePct < 0 || years <= 0) {
    return { interest: 0, totalAmount: 0, annualRatePct, years };
  }
  const interest = principal * (annualRatePct / 100) * years;
  return {
    interest: round(interest, 2),
    totalAmount: round(principal + interest, 2),
    annualRatePct,
    years,
  };
}

// 3. Savings Goal
export interface SavingsGoalResult {
  monthlySavingsNeeded: number;
  totalDeposited: number;
  totalInterestEarned: number;
  monthsCount: number;
}

export function calculateSavingsGoal(
  targetAmount: number,
  years: number,
  annualRatePct: number,
  startingBalance = 0
): SavingsGoalResult {
  if (targetAmount <= 0 || years <= 0) {
    return { monthlySavingsNeeded: 0, totalDeposited: 0, totalInterestEarned: 0, monthsCount: 0 };
  }

  const months = Math.round(years * 12);
  const r = annualRatePct / 100 / 12;

  let monthlySavings = 0;

  if (r <= 0) {
    monthlySavings = Math.max(0, (targetAmount - startingBalance) / months);
  } else {
    // FV = P*(1+r)^n + PMT * [ ((1+r)^n - 1) / r ]
    const futureValueOfInitial = startingBalance * Math.pow(1 + r, months);
    const remainingNeeded = Math.max(0, targetAmount - futureValueOfInitial);
    const annuityFactor = (Math.pow(1 + r, months) - 1) / r;
    monthlySavings = remainingNeeded / annuityFactor;
  }

  const totalDeposited = startingBalance + monthlySavings * months;
  const totalInterest = Math.max(0, targetAmount - totalDeposited);

  return {
    monthlySavingsNeeded: round(monthlySavings, 2),
    totalDeposited: round(totalDeposited, 2),
    totalInterestEarned: round(totalInterest, 2),
    monthsCount: months,
  };
}

// 4. Return on Investment (ROI)
export interface RoiResult {
  netProfit: number;
  roiPercentage: number;
  annualizedRoi?: number;
}

export function calculateROI(
  initialInvestment: number,
  finalValue: number,
  years = 1
): RoiResult {
  if (initialInvestment <= 0) {
    return { netProfit: 0, roiPercentage: 0 };
  }
  const netProfit = finalValue - initialInvestment;
  const roiPercentage = (netProfit / initialInvestment) * 100;

  let annualizedRoi: number | undefined;
  if (years > 0 && finalValue > 0) {
    annualizedRoi = (Math.pow(finalValue / initialInvestment, 1 / years) - 1) * 100;
  }

  return {
    netProfit: round(netProfit, 2),
    roiPercentage: round(roiPercentage, 2),
    annualizedRoi: annualizedRoi !== undefined ? round(annualizedRoi, 2) : undefined,
  };
}

// 5. Compound Annual Growth Rate (CAGR)
export interface CagrResult {
  cagrPercentage: number;
  totalGrowthPercentage: number;
  years: number;
}

export function calculateCAGR(
  beginningValue: number,
  endingValue: number,
  years: number
): CagrResult {
  if (beginningValue <= 0 || endingValue <= 0 || years <= 0) {
    return { cagrPercentage: 0, totalGrowthPercentage: 0, years };
  }
  const cagr = (Math.pow(endingValue / beginningValue, 1 / years) - 1) * 100;
  const totalGrowth = ((endingValue - beginningValue) / beginningValue) * 100;

  return {
    cagrPercentage: round(cagr, 2),
    totalGrowthPercentage: round(totalGrowth, 2),
    years,
  };
}

// 6. Inflation Calculator
export interface InflationResult {
  futureEquivalentCost: number;
  purchasingPowerLossPct: number;
  futurePurchasingPowerOfSameMoney: number;
}

export function calculateInflation(
  currentAmount: number,
  annualInflationPct: number,
  years: number
): InflationResult {
  if (currentAmount <= 0 || years <= 0) {
    return {
      futureEquivalentCost: currentAmount,
      purchasingPowerLossPct: 0,
      futurePurchasingPowerOfSameMoney: currentAmount,
    };
  }

  const factor = Math.pow(1 + annualInflationPct / 100, years);
  const futureCost = currentAmount * factor;
  const futurePurchasingPower = currentAmount / factor;
  const lossPct = ((currentAmount - futurePurchasingPower) / currentAmount) * 100;

  return {
    futureEquivalentCost: round(futureCost, 2),
    purchasingPowerLossPct: round(lossPct, 2),
    futurePurchasingPowerOfSameMoney: round(futurePurchasingPower, 2),
  };
}

// 7. Profit Margin and Markup
export interface ProfitMarginMarkupResult {
  profit: number;
  marginPercentage: number;
  markupPercentage: number;
  cost: number;
  price: number;
}

export function calculateProfitMarginMarkup(
  cost: number,
  price: number
): ProfitMarginMarkupResult {
  if (cost <= 0 || price <= 0) {
    return { profit: 0, marginPercentage: 0, markupPercentage: 0, cost, price };
  }
  const profit = price - cost;
  const marginPercentage = (profit / price) * 100;
  const markupPercentage = (profit / cost) * 100;

  return {
    profit: round(profit, 2),
    marginPercentage: round(marginPercentage, 2),
    markupPercentage: round(markupPercentage, 2),
    cost: round(cost, 2),
    price: round(price, 2),
  };
}

// 8. Break-Even Analysis
export interface BreakEvenResult {
  breakEvenUnits: number;
  breakEvenRevenue: number;
  contributionMarginPerUnit: number;
  contributionMarginRatio: number;
}

export function calculateBreakEven(
  fixedCosts: number,
  unitPrice: number,
  variableCostPerUnit: number
): BreakEvenResult {
  const marginPerUnit = unitPrice - variableCostPerUnit;
  if (fixedCosts <= 0 || marginPerUnit <= 0 || unitPrice <= 0) {
    return {
      breakEvenUnits: 0,
      breakEvenRevenue: 0,
      contributionMarginPerUnit: Math.max(0, marginPerUnit),
      contributionMarginRatio: 0,
    };
  }

  const units = fixedCosts / marginPerUnit;
  const revenue = units * unitPrice;
  const ratio = (marginPerUnit / unitPrice) * 100;

  return {
    breakEvenUnits: Math.ceil(units),
    breakEvenRevenue: round(revenue, 2),
    contributionMarginPerUnit: round(marginPerUnit, 2),
    contributionMarginRatio: round(ratio, 2),
  };
}

// 9. Flat Rate Installment (قسط بفائدة ثابتة)
export interface FlatRateInstallmentResult {
  monthlyInstallment: number;
  totalInterest: number;
  totalPayable: number;
  effectiveAnnualRatePct: number;
}

export function calculateFlatRateInstallment(
  principal: number,
  annualFlatRatePct: number,
  months: number
): FlatRateInstallmentResult {
  if (principal <= 0 || months <= 0) {
    return {
      monthlyInstallment: 0,
      totalInterest: 0,
      totalPayable: 0,
      effectiveAnnualRatePct: 0,
    };
  }

  const years = months / 12;
  const totalInterest = principal * (annualFlatRatePct / 100) * years;
  const totalPayable = principal + totalInterest;
  const monthlyInstallment = totalPayable / months;

  // Approximate Effective APR from flat rate: APR ~ (2 * n * flatRate) / (n + 1)
  const effectiveApr = (2 * months * annualFlatRatePct) / (months + 1);

  return {
    monthlyInstallment: round(monthlyInstallment, 2),
    totalInterest: round(totalInterest, 2),
    totalPayable: round(totalPayable, 2),
    effectiveAnnualRatePct: round(effectiveApr, 2),
  };
}

// 10. Car Loan / Amortization Loan
export interface AmortizationRow {
  month: number;
  payment: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
}

export interface LoanResult {
  loanAmount: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  schedule: AmortizationRow[];
}

export function calculateCarLoan(
  vehiclePrice: number,
  downPayment: number,
  annualInterestRatePct: number,
  months: number
): LoanResult {
  const loanAmount = Math.max(0, vehiclePrice - downPayment);
  if (loanAmount <= 0 || months <= 0) {
    return { loanAmount: 0, monthlyPayment: 0, totalPayment: 0, totalInterest: 0, schedule: [] };
  }

  const r = annualInterestRatePct / 100 / 12;
  let monthlyPayment = 0;

  if (r <= 0) {
    monthlyPayment = loanAmount / months;
  } else {
    // Standard amortization formula: M = P * [ r*(1+r)^n / ((1+r)^n - 1) ]
    monthlyPayment = (loanAmount * (r * Math.pow(1 + r, months))) / (Math.pow(1 + r, months) - 1);
  }

  let balance = loanAmount;
  let totalInterest = 0;
  const schedule: AmortizationRow[] = [];

  for (let m = 1; m <= months; m++) {
    const interestForMonth = r > 0 ? balance * r : 0;
    const principalForMonth = monthlyPayment - interestForMonth;
    balance = Math.max(0, balance - principalForMonth);
    totalInterest += interestForMonth;

    schedule.push({
      month: m,
      payment: round(monthlyPayment, 2),
      principalPaid: round(principalForMonth, 2),
      interestPaid: round(interestForMonth, 2),
      remainingBalance: round(balance, 2),
    });
  }

  return {
    loanAmount: round(loanAmount, 2),
    monthlyPayment: round(monthlyPayment, 2),
    totalPayment: round(loanAmount + totalInterest, 2),
    totalInterest: round(totalInterest, 2),
    schedule,
  };
}

// 11. Sales Commission
export interface CommissionResult {
  commissionAmount: number;
  totalEarnings: number;
  effectiveRatePct: number;
}

export function calculateCommission(
  saleAmount: number,
  commissionRatePct: number,
  baseSalary = 0
): CommissionResult {
  if (saleAmount < 0 || commissionRatePct < 0) {
    return { commissionAmount: 0, totalEarnings: baseSalary, effectiveRatePct: 0 };
  }

  const commission = saleAmount * (commissionRatePct / 100);
  const total = baseSalary + commission;

  return {
    commissionAmount: round(commission, 2),
    totalEarnings: round(total, 2),
    effectiveRatePct: commissionRatePct,
  };
}

// 12. Tip & Bill Split
export interface TipSplitResult {
  tipAmount: number;
  totalBillWithTip: number;
  perPersonBill: number;
  perPersonTip: number;
  perPersonTotal: number;
}

export function calculateTipSplitBill(
  billAmount: number,
  tipPct: number,
  numberOfPeople = 1
): TipSplitResult {
  const people = Math.max(1, numberOfPeople);
  if (billAmount <= 0) {
    return {
      tipAmount: 0,
      totalBillWithTip: 0,
      perPersonBill: 0,
      perPersonTip: 0,
      perPersonTotal: 0,
    };
  }

  const tip = billAmount * (tipPct / 100);
  const total = billAmount + tip;

  return {
    tipAmount: round(tip, 2),
    totalBillWithTip: round(total, 2),
    perPersonBill: round(billAmount / people, 2),
    perPersonTip: round(tip / people, 2),
    perPersonTotal: round(total / people, 2),
  };
}

// 13. Credit Card Payoff
export interface CreditCardPayoffResult {
  isImpossible: boolean;
  minimumPaymentToCoverInterest: number;
  monthsToPayoff: number;
  yearsToPayoff: number;
  totalInterestPaid: number;
  totalPaid: number;
}

export function calculateCreditCardPayoff(
  balance: number,
  annualAprPct: number,
  monthlyPayment: number
): CreditCardPayoffResult {
  if (balance <= 0) {
    return {
      isImpossible: false,
      minimumPaymentToCoverInterest: 0,
      monthsToPayoff: 0,
      yearsToPayoff: 0,
      totalInterestPaid: 0,
      totalPaid: 0,
    };
  }

  const monthlyRate = annualAprPct / 100 / 12;
  const firstMonthInterest = balance * monthlyRate;

  if (monthlyPayment <= firstMonthInterest) {
    return {
      isImpossible: true,
      minimumPaymentToCoverInterest: round(firstMonthInterest + 1, 2),
      monthsToPayoff: Infinity,
      yearsToPayoff: Infinity,
      totalInterestPaid: Infinity,
      totalPaid: Infinity,
    };
  }

  let remaining = balance;
  let months = 0;
  let totalInterest = 0;
  const maxMonths = 1200; // 100 years guard

  while (remaining > 0 && months < maxMonths) {
    months++;
    const interest = remaining * monthlyRate;
    totalInterest += interest;

    if (remaining + interest <= monthlyPayment) {
      // Final month payoff
      remaining = 0;
      break;
    } else {
      remaining = remaining + interest - monthlyPayment;
    }
  }

  return {
    isImpossible: false,
    minimumPaymentToCoverInterest: round(firstMonthInterest, 2),
    monthsToPayoff: months,
    yearsToPayoff: round(months / 12, 1),
    totalInterestPaid: round(totalInterest, 2),
    totalPaid: round(balance + totalInterest, 2),
  };
}
