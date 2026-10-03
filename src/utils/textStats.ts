export interface TextStatistics {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  paragraphs: number;
  sentences: number;
  readingTimeMinutes: number;
  readingTimeSeconds: number;
  arabicLetters: number;
  diacriticsCount: number;
}

// Arabic diacritics unicode range (Fat-ha, Damma, Kasra, Sukun, Shadda, Tanwin, etc.)
const ARABIC_DIACRITICS_REGEX = /[\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g;
const ARABIC_LETTERS_REGEX = /[\u0600-\u06FF]/g;

export function analyzeText(text: string): TextStatistics {
  if (!text || text.trim() === '') {
    return {
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      paragraphs: 0,
      sentences: 0,
      readingTimeMinutes: 0,
      readingTimeSeconds: 0,
      arabicLetters: 0,
      diacriticsCount: 0,
    };
  }

  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s+/g, '').length;

  // Words count: handles Arabic and Latin whitespace
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;

  // Paragraphs
  const paragraphs = text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0).length;

  // Sentences: periods, question marks (Arabic ؟ and Latin ?), exclamation marks
  const sentences = text
    .split(/[.!?؟]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0).length;

  // Arabic letters & diacritics
  const diacriticsMatches = text.match(ARABIC_DIACRITICS_REGEX);
  const diacriticsCount = diacriticsMatches ? diacriticsMatches.length : 0;

  const arabicMatches = text.match(ARABIC_LETTERS_REGEX);
  const arabicLetters = arabicMatches ? arabicMatches.length : 0;

  // Average reading speed: 200 words per minute
  const totalSeconds = words > 0 ? Math.ceil((words / 200) * 60) : 0;
  const readingTimeMinutes = Math.floor(totalSeconds / 60);
  const readingTimeSeconds = totalSeconds % 60;

  return {
    words,
    characters,
    charactersNoSpaces,
    paragraphs: Math.max(1, paragraphs),
    sentences: Math.max(1, sentences),
    readingTimeMinutes,
    readingTimeSeconds,
    arabicLetters,
    diacriticsCount,
  };
}

/**
 * Removes Arabic diacritics (Harakat / Tashkeel) from text.
 */
export function removeTashkeel(text: string): string {
  return text.replace(ARABIC_DIACRITICS_REGEX, '');
}

/**
 * Normalizes Arabic letters (Alif forms, Taa Marbuta).
 */
export function normalizeArabicText(text: string): string {
  return text
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ي/g, 'ى');
}
