import type {
  CefrLevel,
  QuestionCategory,
  QuestionExtras,
  QuizQuestion,
  ReadingSkill,
} from "../../types/index.ts";

/**
 * Authoring helpers for the question bank.
 *
 * Questions are written as `right answer + three distractors`. The correct answer is
 * then placed at a position derived from a hash of the question id, so positions are
 * well spread and stable between builds without being hand-managed.
 */

type Three = readonly [string, string, string];

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function place(id: string, right: string, wrong: Three): { choices: QuizQuestion["choices"]; answerIndex: 0 | 1 | 2 | 3 } {
  const answerIndex = ((hash(id) >>> 7) % 4) as 0 | 1 | 2 | 3;
  const list = [...wrong];
  list.splice(answerIndex, 0, right);
  return { choices: list as unknown as QuizQuestion["choices"], answerIndex };
}

/** [level, topic, prompt, right answer, three distractors, explanation, extras?] */
export type Row = readonly [CefrLevel, string, string, string, Three, string, QuestionExtras?];

export function bank(prefix: string, category: QuestionCategory, rows: readonly Row[]): QuizQuestion[] {
  return rows.map(([difficulty, topic, prompt, right, wrong, explanation, extras], i) => {
    const id = `${prefix}-${String(i + 1).padStart(3, "0")}`;
    return {
      id,
      category,
      difficulty,
      topic,
      prompt,
      ...place(id, right, wrong),
      explanation,
      ...(extras ? { extras } : {}),
    };
  });
}

/**
 * Error-correction rows keep the sentence order: the four choices are the four parts of
 * the sentence and the learner picks the part that contains the mistake.
 * The full sentence is the four parts joined with spaces.
 * [level, topic, four parts, index of the faulty part, incorrect, better, rule]
 */
export type ErrorRow = readonly [
  CefrLevel,
  string,
  readonly [string, string, string, string],
  0 | 1 | 2 | 3,
  string,
  string,
  string,
];

export function errorCorrection(prefix: string, rows: readonly ErrorRow[]): QuizQuestion[] {
  return rows.map(([difficulty, topic, parts, faulty, incorrect, better, rule], i) => ({
    id: `${prefix}-${String(i + 1).padStart(3, "0")}`,
    category: "error-correction" as const,
    difficulty,
    topic,
    prompt: `Find the part of the sentence that contains a mistake: “${parts.join(" ")}”`,
    choices: parts,
    answerIndex: faulty,
    explanation: `Incorrect: “${incorrect}”. Better: “${better}”. ${rule}`,
    extras: { rule },
  }));
}

export interface PassageDef {
  id: string;
  title: string;
  level: CefrLevel;
  topic: string;
  text: string;
  /** [skill, question, right answer, three distractors, explanation, extras?] */
  questions: readonly (readonly [ReadingSkill, string, string, Three, string, QuestionExtras?])[];
}

export function readingBank(passages: readonly PassageDef[]): QuizQuestion[] {
  return passages.flatMap((p) =>
    p.questions.map(([skill, prompt, right, wrong, explanation, extras], i) => {
      const id = `${p.id}-q${i + 1}`;
      return {
        id,
        category: "reading" as const,
        difficulty: p.level,
        topic: p.topic,
        prompt,
        passage: p.text,
        passageTitle: p.title,
        passageId: p.id,
        skill,
        ...place(id, right, wrong),
        explanation,
        ...(extras ? { extras } : {}),
      };
    }),
  );
}
