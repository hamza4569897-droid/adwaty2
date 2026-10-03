export type CurrencyCode = 'egp' | 'sar' | 'aed' | 'kwd' | 'none';
export type GrammaticalCase = 'nominative' | 'accusative_genitive';

interface CurrencyInfo {
  singular: string;
  dualNom: string;
  dualAcc: string;
  plural: string;
  accusative: string;
  fractionSingular: string;
  fractionDualNom: string;
  fractionDualAcc: string;
  fractionPlural: string;
  fractionAccusative: string;
  decimals: number;
}

const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  egp: {
    singular: 'جنيه مصري',
    dualNom: 'جنيهان مصريان',
    dualAcc: 'جنيهين مصريين',
    plural: 'جنيهات مصرية',
    accusative: 'جنيهاً مصرياً',
    fractionSingular: 'قرش',
    fractionDualNom: 'قرشان',
    fractionDualAcc: 'قرشين',
    fractionPlural: 'قروش',
    fractionAccusative: 'قرشاً',
    decimals: 2,
  },
  sar: {
    singular: 'ريال سعودي',
    dualNom: 'ريالان سعوديان',
    dualAcc: 'ريالين سعوديين',
    plural: 'ريالات سعودية',
    accusative: 'ريالاً سعودياً',
    fractionSingular: 'هللة',
    fractionDualNom: 'هللتان',
    fractionDualAcc: 'هللتين',
    fractionPlural: 'هللات',
    fractionAccusative: 'هللة',
    decimals: 2,
  },
  aed: {
    singular: 'درهم إماراتي',
    dualNom: 'درهمان إماراتيان',
    dualAcc: 'درهمين إماراتيين',
    plural: 'دراهم إماراتية',
    accusative: 'درهماً إماراتياً',
    fractionSingular: 'فلس',
    fractionDualNom: 'فلسان',
    fractionDualAcc: 'فلسين',
    fractionPlural: 'فلوس',
    fractionAccusative: 'فلساً',
    decimals: 2,
  },
  kwd: {
    singular: 'دينار كويتي',
    dualNom: 'ديناران كويتيان',
    dualAcc: 'دينارين كويتيين',
    plural: 'دنانير كويتية',
    accusative: 'ديناراً كويتياً',
    fractionSingular: 'فلس',
    fractionDualNom: 'فلسان',
    fractionDualAcc: 'فلسين',
    fractionPlural: 'فلوس',
    fractionAccusative: 'فلساً',
    decimals: 3,
  },
  none: {
    singular: '',
    dualNom: '',
    dualAcc: '',
    plural: '',
    accusative: '',
    fractionSingular: 'فاصلة',
    fractionDualNom: 'فاصلة',
    fractionDualAcc: 'فاصلة',
    fractionPlural: 'فاصلة',
    fractionAccusative: 'فاصلة',
    decimals: 2,
  },
};

const ONES_MASC_NOM = [
  '',
  'واحد',
  'اثنان',
  'ثلاثة',
  'أربعة',
  'خمسة',
  'ستة',
  'سبعة',
  'ثمانية',
  'تسعة',
  'عشرة',
  'أحد عشر',
  'اثنا عشر',
  'ثلاثة عشر',
  'أربعة عشر',
  'خمسة عشر',
  'ستة عشر',
  'سبعة عشر',
  'ثمانية عشر',
  'تسعة عشر',
];

const ONES_MASC_ACC = [
  '',
  'واحد',
  'اثنين',
  'ثلاثة',
  'أربعة',
  'خمسة',
  'ستة',
  'سبعة',
  'ثمانية',
  'تسعة',
  'عشرة',
  'أحد عشر',
  'اثني عشر',
  'ثلاثة عشر',
  'أربعة عشر',
  'خمسة عشر',
  'ستة عشر',
  'سبعة عشر',
  'ثمانية عشر',
  'تسعة عشر',
];

const ONES_FEM_NOM = [
  '',
  'واحدة',
  'اثنتان',
  'ثلاث',
  'أربع',
  'خمس',
  'ست',
  'سبع',
  'ثمان',
  'تسع',
  'عشر',
  'إحدى عشرة',
  'اثنتا عشرة',
  'ثلاث عشرة',
  'أربع عشرة',
  'خمس عشرة',
  'ست عشرة',
  'سبع عشرة',
  'ثماني عشرة',
  'تسع عشرة',
];

const ONES_FEM_ACC = [
  '',
  'واحدة',
  'اثنتين',
  'ثلاث',
  'أربع',
  'خمس',
  'ست',
  'سبع',
  'ثمان',
  'تسع',
  'عشر',
  'إحدى عشرة',
  'اثنتي عشرة',
  'ثلاث عشرة',
  'أربع عشرة',
  'خمس عشرة',
  'ست عشرة',
  'سبع عشرة',
  'ثماني عشرة',
  'تسع عشرة',
];

const TENS_NOM = [
  '',
  '',
  'عشرون',
  'ثلاثون',
  'أربعون',
  'خمسون',
  'ستون',
  'سبعون',
  'ثمانون',
  'تسعون',
];

const TENS_ACC = [
  '',
  '',
  'عشرين',
  'ثلاثين',
  'أربعين',
  'خمسين',
  'ستين',
  'سبعين',
  'ثمانين',
  'تسعين',
];

const HUNDREDS_NOM = [
  '',
  'مائة',
  'مئتان',
  'ثلاثمائة',
  'أربعمائة',
  'خمسمائة',
  'ستمائة',
  'سبعمائة',
  'ثمانمائة',
  'تسعمائة',
];

const HUNDREDS_ACC = [
  '',
  'مائة',
  'مئتين',
  'ثلاثمائة',
  'أربعمائة',
  'خمسمائة',
  'ستمائة',
  'سبعمائة',
  'ثمانمائة',
  'تسعمائة',
];

const SCALE = [
  { singular: '', dualNom: '', dualAcc: '', plural: '', accusative: '' },
  { singular: 'ألف', dualNom: 'ألفان', dualAcc: 'ألفين', plural: 'آلاف', accusative: 'ألفاً' },
  { singular: 'مليون', dualNom: 'مليونان', dualAcc: 'مليونين', plural: 'ملايين', accusative: 'مليوناً' },
  { singular: 'مليار', dualNom: 'ملياران', dualAcc: 'مليارين', plural: 'مليارات', accusative: 'ملياراً' },
  { singular: 'تريليون', dualNom: 'تريليونان', dualAcc: 'تريليونين', plural: 'تريليونات', accusative: 'تريليوناً' },
];

function convertGroup(n: number, isFeminine = false, grammarCase: GrammaticalCase = 'nominative'): string {
  if (n === 0) return '';
  const parts: string[] = [];

  const h = Math.floor(n / 100);
  const remainder = n % 100;

  const hundredsArr = grammarCase === 'nominative' ? HUNDREDS_NOM : HUNDREDS_ACC;
  const tensArr = grammarCase === 'nominative' ? TENS_NOM : TENS_ACC;

  if (h > 0) {
    parts.push(hundredsArr[h]);
  }

  if (remainder > 0) {
    const onesArr = isFeminine
      ? (grammarCase === 'nominative' ? ONES_FEM_NOM : ONES_FEM_ACC)
      : (grammarCase === 'nominative' ? ONES_MASC_NOM : ONES_MASC_ACC);

    if (remainder < 20) {
      parts.push(onesArr[remainder]);
    } else {
      const ones = remainder % 10;
      const tens = Math.floor(remainder / 10);
      if (ones > 0) {
        parts.push(`${onesArr[ones]} و${tensArr[tens]}`);
      } else {
        parts.push(tensArr[tens]);
      }
    }
  }

  return parts.join(' و');
}

/**
 * Converts integer to Arabic words
 */
function numberToWordsInt(num: number, isFeminine = false, grammarCase: GrammaticalCase = 'nominative'): string {
  if (num === 0) return 'صفر';
  if (num < 0) return `سالب ${numberToWordsInt(Math.abs(num), isFeminine, grammarCase)}`;

  const groups: number[] = [];
  let temp = Math.floor(num);

  while (temp > 0) {
    groups.push(temp % 1000);
    temp = Math.floor(temp / 1000);
  }

  const parts: string[] = [];

  for (let i = groups.length - 1; i >= 0; i--) {
    const val = groups[i];
    if (val === 0) continue;

    const scale = SCALE[i];
    if (i === 0) {
      parts.push(convertGroup(val, isFeminine, grammarCase));
    } else if (val === 1) {
      parts.push(scale.singular);
    } else if (val === 2) {
      parts.push(grammarCase === 'nominative' ? scale.dualNom : scale.dualAcc);
    } else if (val >= 3 && val <= 10) {
      parts.push(`${convertGroup(val, false, grammarCase)} ${scale.plural}`);
    } else {
      parts.push(`${convertGroup(val, false, grammarCase)} ${scale.accusative}`);
    }
  }

  return parts.join(' و');
}

function getCurrencyName(amount: number, info: CurrencyInfo, isFraction = false, grammarCase: GrammaticalCase = 'nominative'): string {
  if (!info.singular) return '';
  const sing = isFraction ? info.fractionSingular : info.singular;
  const dual = isFraction
    ? (grammarCase === 'nominative' ? info.fractionDualNom : info.fractionDualAcc)
    : (grammarCase === 'nominative' ? info.dualNom : info.dualAcc);
  const plur = isFraction ? info.fractionPlural : info.plural;
  const acc = isFraction ? info.fractionAccusative : info.accusative;

  const rem = amount % 100;
  if (amount === 1) return sing;
  if (amount === 2) return dual;
  if (rem >= 3 && rem <= 10) return plur;
  return acc;
}

export interface TafqeetOptions {
  currency?: CurrencyCode;
  includeOnlyClause?: boolean; // "فقط لا غير"
  isFeminine?: boolean;
  grammaticalCase?: GrammaticalCase; // 'nominative' | 'accusative_genitive'
}

/**
 * Main Tafqeet entry point
 */
export function tafqeet(value: number | string, options: TafqeetOptions = {}): string {
  const {
    currency = 'egp',
    includeOnlyClause = true,
    isFeminine = false,
    grammaticalCase = 'nominative',
  } = options;

  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '';

  const currInfo = CURRENCIES[currency] || CURRENCIES.egp;
  const isNegative = num < 0;
  const absNum = Math.abs(num);

  const integerPart = Math.floor(absNum);
  const decimalMultiplier = Math.pow(10, currInfo.decimals);
  const fractionalPart = Math.round((absNum - integerPart) * decimalMultiplier);

  let result = '';

  if (currency === 'none') {
    result = numberToWordsInt(integerPart, isFeminine, grammaticalCase);
    if (fractionalPart > 0) {
      result += ` فاصلة ${numberToWordsInt(fractionalPart, isFeminine, grammaticalCase)}`;
    }
  } else {
    // Integer part with currency
    if (integerPart === 0 && fractionalPart === 0) {
      result = `صفر ${currInfo.singular}`;
    } else if (integerPart > 0) {
      if (integerPart === 1) {
        result = currInfo.singular;
      } else if (integerPart === 2) {
        result = grammaticalCase === 'nominative' ? currInfo.dualNom : currInfo.dualAcc;
      } else {
        result = `${numberToWordsInt(integerPart, false, grammaticalCase)} ${getCurrencyName(integerPart, currInfo, false, grammaticalCase)}`;
      }
    }

    // Fraction part
    if (fractionalPart > 0) {
      const fracWords = numberToWordsInt(fractionalPart, false, grammaticalCase);
      const fracUnit = getCurrencyName(fractionalPart, currInfo, true, grammaticalCase);
      const fracString =
        fractionalPart === 1
          ? currInfo.fractionSingular
          : fractionalPart === 2
          ? (grammaticalCase === 'nominative' ? currInfo.fractionDualNom : currInfo.fractionDualAcc)
          : `${fracWords} ${fracUnit}`;

      if (integerPart > 0) {
        result += ` و${fracString}`;
      } else {
        result = fracString;
      }
    }
  }

  if (isNegative) {
    result = `سالب ${result}`;
  }

  if (includeOnlyClause && currency !== 'none') {
    result = `${result} فقط لا غير`;
  }

  return result.trim();
}
