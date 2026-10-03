/**
 * Reference calculation implementations for the required test cases
 * to ensure 100% precision across all batches in /dev/calc-tests.
 */

import { calculateCompoundInterest, calculateCarLoan, calculateProfitMarginMarkup } from './financial';
import { round } from './utils';

// BMI
export function calculateBMI(weightKg: number, heightCm: number): { bmi: number; rounded1Dec: number } {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return {
    bmi: round(bmi, 2),
    rounded1Dec: round(bmi, 1),
  };
}

// Mifflin-St Jeor BMR
// Male: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
// Female: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
export function calculateMifflinStJeor(
  gender: 'male' | 'female',
  ageYears: number,
  weightKg: number,
  heightCm: number
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
  const bmr = gender === 'male' ? base + 5 : base - 161;
  return round(bmr, 2);
}

// Pythagorean theorem
export function calculateHypotenuse(a: number, b: number): number {
  return round(Math.sqrt(a * a + b * b), 2);
}

// Gold purity: 21k, 10g -> 10 * (21/24) = 8.75g of 24k
export function calculatePureGoldContent(weightGrams: number, karat: number): number {
  return round((weightGrams * karat) / 24, 2);
}

// GCD & LCM
export function calculateGCD(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

export function calculateLCM(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / calculateGCD(a, b);
}

// Roman numerals (1 - 3999)
export function toRomanNumeral(num: number): string {
  if (num <= 0 || num >= 4000) return '';
  const val = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const syms = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
  let roman = '';
  let n = num;
  for (let i = 0; i < val.length; i++) {
    while (n >= val[i]) {
      roman += syms[i];
      n -= val[i];
    }
  }
  return roman;
}

export function fromRomanNumeral(str: string): number {
  const map: Record<string, number> = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };
  const s = str.toUpperCase().trim();
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const curr = map[s[i]] || 0;
    const next = map[s[i + 1]] || 0;
    if (curr < next) {
      total -= curr;
    } else {
      total += curr;
    }
  }
  return total;
}

// Base converter
export function convertNumberBase(value: string, fromBase: number, toBase: number): string {
  const parsed = parseInt(value, fromBase);
  if (isNaN(parsed)) return '0';
  return parsed.toString(toBase).toUpperCase();
}

// Quadratic solver: ax² + bx + c = 0
export function solveQuadratic(a: number, b: number, c: number): {
  discriminant: number;
  roots: [number, number] | [string, string];
  isComplex: boolean;
} {
  const d = b * b - 4 * a * c;
  if (d >= 0) {
    const r1 = (-b + Math.sqrt(d)) / (2 * a);
    const r2 = (-b - Math.sqrt(d)) / (2 * a);
    return {
      discriminant: round(d, 4),
      roots: [round(r1, 4), round(r2, 4)],
      isComplex: false,
    };
  } else {
    const real = round(-b / (2 * a), 4);
    const imag = round(Math.sqrt(-d) / (2 * a), 4);
    return {
      discriminant: round(d, 4),
      roots: [`${real} + ${imag}i`, `${real} - ${imag}i`],
      isComplex: true,
    };
  }
}

// Pregnancy Naegele's rule: LMP date + 280 days (or LMP + 1 year - 3 months + 7 days)
export function calculateDueDate(lmpDate: Date): Date {
  const due = new Date(lmpDate.getTime());
  due.setDate(due.getDate() + 280);
  return due;
}

export interface TestCaseItem {
  id: string;
  name: string;
  category: string;
  inputDescription: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  notes?: string;
}

export function runAllKnownTests(): TestCaseItem[] {
  const results: TestCaseItem[] = [];

  // 1. Compound Interest: 10,000 at 10% yearly for 5 years → 16,105.10
  const ci = calculateCompoundInterest(10000, 10, 5, 'yearly', 0);
  results.push({
    id: 'compound-interest',
    name: 'الفائدة المركبة (Compound Interest)',
    category: 'مالية',
    inputDescription: 'مبلغ 10,000 بفائدة 10% سنوياً لمدة 5 سنوات',
    expectedOutput: '16105.10',
    actualOutput: ci.finalBalance.toFixed(2),
    passed: ci.finalBalance === 16105.10,
  });

  // 2. Loan: 100,000 at 12% annual, 12 months → monthly payment 8,884.88
  const loan = calculateCarLoan(100000, 0, 12, 12);
  results.push({
    id: 'loan-payment',
    name: 'قسط القرض (Loan Monthly Payment)',
    category: 'مالية',
    inputDescription: 'قرض 100,000 بفائدة 12% سنوياً على 12 شهراً',
    expectedOutput: '8884.88',
    actualOutput: loan.monthlyPayment.toFixed(2),
    passed: loan.monthlyPayment === 8884.88,
  });

  // 3. BMI: 70 kg, 175 cm → 22.9 (22.86)
  const bmiRes = calculateBMI(70, 175);
  results.push({
    id: 'bmi',
    name: 'مؤشر كتلة الجسم (BMI)',
    category: 'صحة',
    inputDescription: 'وزن 70 كجم، طول 175 سم',
    expectedOutput: '22.86 (أو 22.9 مقرباً)',
    actualOutput: `${bmiRes.bmi} (تقريب: ${bmiRes.rounded1Dec})`,
    passed: bmiRes.bmi === 22.86 && bmiRes.rounded1Dec === 22.9,
  });

  // 4. Mifflin-St Jeor: male, 30 years, 70 kg, 175 cm → BMR 1648.75
  const bmrRes = calculateMifflinStJeor('male', 30, 70, 175);
  results.push({
    id: 'bmr-mifflin',
    name: 'معادلة Mifflin-St Jeor للسعرات الأساسية',
    category: 'صحة',
    inputDescription: 'ذكر، 30 سنة، 70 كجم، 175 سم',
    expectedOutput: '1648.75',
    actualOutput: bmrRes.toFixed(2),
    passed: bmrRes === 1648.75,
  });

  // 5. Pythagorean: legs 3 and 4 → hypotenuse 5
  const pythRes = calculateHypotenuse(3, 4);
  results.push({
    id: 'pythagorean',
    name: 'مبرهنة فيثاغورس (Pythagorean Theorem)',
    category: 'تعليم ورياضيات',
    inputDescription: 'ضلعان 3 و 4',
    expectedOutput: '5',
    actualOutput: pythRes.toString(),
    passed: pythRes === 5,
  });

  // 6. Gold 21k: 10 g → pure gold content 8.75 g of 24k equivalent
  const goldRes = calculatePureGoldContent(10, 21);
  results.push({
    id: 'gold-21k',
    name: 'حساب نقاء الذهب عيار 21',
    category: 'ذهب وعملات',
    inputDescription: '10 جرام ذهب عيار 21',
    expectedOutput: '8.75',
    actualOutput: goldRes.toFixed(2),
    passed: goldRes === 8.75,
  });

  // 7. GCD(48, 18) = 6 and LCM(4, 6) = 12
  const gcdRes = calculateGCD(48, 18);
  const lcmRes = calculateLCM(4, 6);
  results.push({
    id: 'gcd-lcm',
    name: 'القاسم المشترك والمضاعف (GCD & LCM)',
    category: 'تعليم ورياضيات',
    inputDescription: 'GCD(48, 18) و LCM(4, 6)',
    expectedOutput: 'GCD=6, LCM=12',
    actualOutput: `GCD=${gcdRes}, LCM=${lcmRes}`,
    passed: gcdRes === 6 && lcmRes === 12,
  });

  // 8. Roman numerals: 1994 → MCMXCIV
  const romanRes = toRomanNumeral(1994);
  results.push({
    id: 'roman-numerals',
    name: 'الأرقام الرومانية (Roman Numerals)',
    category: 'تعليم ورياضيات',
    inputDescription: 'الرقم 1994',
    expectedOutput: 'MCMXCIV',
    actualOutput: romanRes,
    passed: romanRes === 'MCMXCIV',
  });

  // 9. Binary 1010 → decimal 10 → hex A
  const decRes = convertNumberBase('1010', 2, 10);
  const hexRes = convertNumberBase('1010', 2, 16);
  results.push({
    id: 'number-bases',
    name: 'تحويل الأنظمة العددية (Number Bases)',
    category: 'تقنية ورياضيات',
    inputDescription: 'ثنائي 1010',
    expectedOutput: 'عشري 10، ست عشري A',
    actualOutput: `عشري ${decRes}، ست عشري ${hexRes}`,
    passed: decRes === '10' && hexRes === 'A',
  });

  // 10. Quadratic x² - 5x + 6 = 0 → roots 2 and 3
  const quadRes = solveQuadratic(1, -5, 6);
  const rootsSorted = [...quadRes.roots].sort();
  results.push({
    id: 'quadratic',
    name: 'المعادلة التربيعية (Quadratic Equation)',
    category: 'تعليم ورياضيات',
    inputDescription: 'x² - 5x + 6 = 0 (a=1, b=-5, c=6)',
    expectedOutput: '2 و 3',
    actualOutput: `${rootsSorted[0]} و ${rootsSorted[1]}`,
    passed: rootsSorted[0] === 2 && rootsSorted[1] === 3,
  });

  // 11. Profit: cost 80, price 100 → margin 20%, markup 25%
  const profitRes = calculateProfitMarginMarkup(80, 100);
  results.push({
    id: 'profit-margin-markup',
    name: 'هامش الربح والزيادة (Margin & Markup)',
    category: 'مالية',
    inputDescription: 'تكلفة 80، سعر بيع 100',
    expectedOutput: 'هامش 20%، نسبة زيادة 25%',
    actualOutput: `هامش ${profitRes.marginPercentage}%، نسبة زيادة ${profitRes.markupPercentage}%`,
    passed: profitRes.marginPercentage === 20 && profitRes.markupPercentage === 25,
  });

  // 12. Pregnancy: LMP + 280 days = due date
  const testLmp = new Date('2026-01-01T00:00:00Z');
  const dueRes = calculateDueDate(testLmp);
  const expectedDue = new Date(testLmp.getTime() + 280 * 24 * 60 * 60 * 1000);
  results.push({
    id: 'pregnancy-due-date',
    name: 'موعد الولادة المتوقع (Naegele Rule)',
    category: 'صحة',
    inputDescription: 'تاريخ آخر دورة 2026-01-01 + 280 يوماً',
    expectedOutput: expectedDue.toISOString().split('T')[0],
    actualOutput: dueRes.toISOString().split('T')[0],
    passed: dueRes.toISOString().split('T')[0] === expectedDue.toISOString().split('T')[0],
  });

  return results;
}
