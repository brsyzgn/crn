import type { Level, VocabularyCategory, VocabularyEntry } from "../../types/index.ts";

/**
 * Expansion rows: [word, Turkish, part of speech, example sentence, CEFR level, collocations, optional Turkish note].
 * Collocations are separated by semicolons. IDs follow the same scheme as the original rows
 * (category prefix + slug of the word), so progress saved against old entries is never affected.
 */
export type ExtRow = readonly [string, string, string, string, Level, string, string?];

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildExt(category: VocabularyCategory, rows: readonly ExtRow[]): VocabularyEntry[] {
  const prefix = slugify(category).slice(0, 4);
  return rows.map(([word, turkish, partOfSpeech, example, level, collocations, turkishNote]) => ({
    id: `${prefix}-${slugify(word)}`,
    word,
    turkish,
    partOfSpeech,
    example,
    level,
    category,
    collocations: collocations
      .split(";")
      .map((c) => c.trim())
      .filter(Boolean),
    ...(turkishNote ? { turkishNote } : {}),
  }));
}
