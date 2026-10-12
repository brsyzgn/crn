import type { AnswerFramework, CefrLevel, InterviewCategory, InterviewQuestion } from "../../types/index.ts";

/**
 * Authoring format for the expanded interview bank. Lists are separated by " | ".
 * [slug, level, category, question, Turkish translation, competency, why the interviewer asks,
 *  key points, B1/B1+ answer, B2 answer, useful vocabulary, useful phrases, tips, common mistakes,
 *  follow-up questions, answer framework]
 *
 * Every record is a Representative Practice Question. None is claimed to come from a specific
 * airline or candidate report.
 */
export type InterviewRow = readonly [
  string,
  CefrLevel,
  InterviewCategory,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  AnswerFramework,
];

const list = (text: string, sep = "|") =>
  text
    .split(sep)
    .map((t) => t.trim())
    .filter(Boolean);

export function interviewBank(rows: readonly InterviewRow[]): InterviewQuestion[] {
  return rows.map(
    ([slug, difficulty, category, question, turkish, competency, why, keyPoints, b1, b2, vocabulary, phrases, tips, mistakes, followUps, framework]) => ({
      id: `iq-${slug}`,
      question,
      turkish,
      category,
      difficulty,
      competency,
      why,
      keyPoints: list(keyPoints),
      sampleAnswer: b1,
      sampleAnswerB2: b2,
      vocabulary: vocabulary.split(/[;|]/).map((t) => t.trim()).filter(Boolean),
      phrases: list(phrases),
      tips: list(tips),
      commonMistakes: list(mistakes),
      followUps: list(followUps),
      framework,
      source: "representative" as const,
    }),
  );
}

/** Enrichment for an original (pre-expansion) question: only the new fields are written. */
export type LegacyEnrichment = readonly [
  /** category (the original seven are mapped onto the eighteen categories) */
  InterviewCategory,
  /** Turkish translation */
  string,
  /** competency */
  string,
  /** why asked */
  string,
  /** key points | separated */
  string,
  /** the answer at the OTHER level: a B2 answer for original B1 questions, a B1+ answer for original B2 questions */
  string,
  /** vocabulary | separated */
  string,
  /** phrases | separated */
  string,
  /** follow-ups | separated */
  string,
  AnswerFramework,
];

export { list };
