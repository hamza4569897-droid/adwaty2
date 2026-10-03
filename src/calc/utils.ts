/**
 * Precision numerical and digit conversion utilities for Adawaty calculators.
 */

const ARABIC_INDIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/**
 * Normalizes input string by converting any Arabic-Indic or Eastern Arabic (Persian)
 * digits to standard Western ASCII digits (0-9). Also normalizes commas to dots.
 */
export function normalizeDigits(input: string): string {
  if (!input) return '';
  let result = input;
  for (let i = 0; i < 10; i++) {
    result = result.split(ARABIC_INDIC_DIGITS[i]).join(i.toString());
    result = result.split(PERSIAN_DIGITS[i]).join(i.toString());
  }
  // Convert Arabic decimal comma '،' to '.' if present
  result = result.replace(/،/g, '.');
  return result;
}

/**
 * Converts Western digits to Arabic-Indic digits (٠-٩).
 */
export function toArabicIndicDigits(input: string | number): string {
  const str = String(input);
  let res = '';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code >= 48 && code <= 57) {
      res += ARABIC_INDIC_DIGITS[code - 48];
    } else {
      res += str[i];
    }
  }
  return res;
}

/**
 * Precision rounding helper that avoids JavaScript floating point inaccuracies
 * e.g., 1.005 -> 1.01 instead of 1.00
 */
export function round(value: number, decimals = 2): number {
  if (!Number.isFinite(value) || Number.isNaN(value)) return 0;
  // Use exponential string conversion to avoid 1.005 floating rounding anomalies
  return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
}

/**
 * Formats a number with thousands separators (commas), fixed decimal places,
 * and optional Arabic-Indic digits conversion.
 * Never outputs NaN or Infinity.
 */
export function formatNumber(
  value: number,
  options: {
    decimals?: number;
    useArabicDigits?: boolean;
    commas?: boolean;
    trimTrailingZeros?: boolean;
  } = {}
): string {
  if (!Number.isFinite(value) || Number.isNaN(value)) {
    return options.useArabicDigits ? '٠' : '0';
  }

  const decimals = options.decimals !== undefined ? options.decimals : 2;
  const commas = options.commas !== undefined ? options.commas : true;
  const trimTrailingZeros = options.trimTrailingZeros || false;

  const rounded = round(value, decimals);
  const parts = rounded.toFixed(decimals).split('.');

  if (commas) {
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  let formatted = parts.length > 1 && decimals > 0 ? `${parts[0]}.${parts[1]}` : parts[0];

  if (trimTrailingZeros && formatted.includes('.')) {
    formatted = formatted.replace(/\.?0+$/, '');
  }

  if (options.useArabicDigits) {
    return toArabicIndicDigits(formatted);
  }

  return formatted;
}

/**
 * Safely parse a number from a string, supporting Arabic digits and commas.
 */
export function parseInputNumber(input: string, fallback = 0): number {
  if (!input) return fallback;
  const normalized = normalizeDigits(input).trim();
  const num = parseFloat(normalized);
  return Number.isFinite(num) ? num : fallback;
}
