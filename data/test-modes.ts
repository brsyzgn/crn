import type { LevelWeights, Slot } from "../lib/question-selection.ts";
import type { QuestionCategory, ResultCategory } from "../types/index.ts";

/**
 * Randomized test modes. They sit beside the fixed sets in data/quiz.ts: a mode draws a fresh
 * set of questions from the whole bank every time it is started (preferring unseen questions).
 * Results are saved through the same QuizSet / QuizResult path as the fixed sets.
 */
export interface TestMode {
  id: string;
  title: string;
  description: string;
  /** The tab it appears under, and the category its results are filed under. */
  category: ResultCategory;
  length: number;
  levels: LevelWeights;
  slots: readonly Slot[];
}

const GRAMMAR: QuestionCategory[] = ["grammar", "error-correction"];
const VOCAB: QuestionCategory[] = ["vocabulary", "sentence-completion", "everyday"];
const SERVICE: QuestionCategory[] = ["customer-service", "situational", "workplace"];

function slot(key: string, categories: QuestionCategory[], count: number, spread = 1, reading = false): Slot {
  return { key, categories, count, min: Math.max(0, count - spread), max: count + spread, reading };
}

/**
 * Vocabulary questions whose topic is about the interview. The newer ones are labelled
 * "Interview: ..."; the older ones below are the interview-relevant words that already existed.
 */
const INTERVIEW_TOPIC_PREFIX = "Interview:";
const INTERVIEW_TOPICS: readonly string[] = [
  "confident",
  "reliable",
  "flexible",
  "patient",
  "professional",
  "responsibility",
  "remain calm",
  "take responsibility",
  "follow procedures",
  "meet expectations",
  "deal with pressure",
  "raise a concern",
  "take initiative",
  "work under pressure",
  "constructive",
  "make a decision",
  "reach an agreement",
  "resolve an issue",
  "priority",
  "aware",
];

/** A 20-question mixed test: grammar, vocabulary, service/situational, cabin crew and one reading passage. */
function mixedSlots(): Slot[] {
  return [
    slot("grammar", GRAMMAR, 6),
    slot("vocabulary", VOCAB, 5),
    slot("service", SERVICE, 3),
    slot("cabin", ["cabin-crew"], 2),
    slot("reading", ["reading"], 4, 1, true),
  ];
}

const CHALLENGE_LEVELS: LevelWeights = { "B1+": 30, B2: 55, "B2+": 15 };
const PROFESSIONAL_LEVELS: LevelWeights = { B1: 20, "B1+": 30, B2: 45, "B2+": 5 };

export const TEST_MODES: readonly TestMode[] = [
  {
    id: "mode-mixed-b1",
    title: "Mixed Test · B1",
    description: "Common structures and practical vocabulary across grammar, vocabulary, service, cabin crew and reading.",
    category: "mixed",
    length: 20,
    levels: { B1: 65, "B1+": 35 },
    slots: mixedSlots(),
  },
  {
    id: "mode-mixed-b1plus",
    title: "Mixed Test · B1+",
    description: "More contextual reasoning and less obvious wrong answers across all skills.",
    category: "mixed",
    length: 20,
    levels: { B1: 15, "B1+": 55, B2: 30 },
    slots: mixedSlots(),
  },
  {
    id: "mode-mixed-b2",
    title: "Mixed Test · B2",
    description: "Complex grammar, nuanced vocabulary, inference and professional communication with plausible distractors.",
    category: "mixed",
    length: 20,
    levels: { "B1+": 15, B2: 65, "B2+": 20 },
    slots: mixedSlots(),
  },
  {
    id: "mode-grammar-challenge",
    title: "Grammar Challenge",
    description: "Demanding grammar and error-correction questions, drawn at random each time.",
    category: "grammar",
    length: 20,
    levels: CHALLENGE_LEVELS,
    slots: [slot("grammar", ["grammar"], 14, 2), slot("error-correction", ["error-correction"], 6, 2)],
  },
  {
    id: "mode-vocabulary-challenge",
    title: "Vocabulary Challenge",
    description: "Vocabulary and sentence-completion questions: collocations, precise words and natural phrases.",
    category: "vocabulary",
    length: 20,
    levels: CHALLENGE_LEVELS,
    slots: [slot("vocabulary", ["vocabulary"], 14, 2), slot("sentence-completion", ["sentence-completion"], 6, 2)],
  },
  {
    id: "mode-reading-challenge",
    title: "Reading Challenge",
    description: "Reading passages with questions on main idea, detail, inference, reference, tone and vocabulary in context.",
    category: "reading",
    length: 20,
    levels: CHALLENGE_LEVELS,
    slots: [slot("reading", ["reading"], 20, 0, true)],
  },
  {
    id: "mode-cabin-crew-test",
    title: "Cabin Crew English Test",
    description: "Scenarios with passengers and colleagues: choose the language that is clear, polite and professional.",
    category: "cabin-crew",
    length: 20,
    levels: PROFESSIONAL_LEVELS,
    slots: [slot("cabin", ["cabin-crew"], 20, 0)],
  },
  {
    id: "mode-customer-service-test",
    title: "Customer Service English Test",
    description: "Questions on handling customers, difficult conversations and workplace communication.",
    category: "customer-service",
    length: 20,
    levels: PROFESSIONAL_LEVELS,
    slots: [slot("customer-service", ["customer-service"], 10, 2), slot("workplace", ["workplace"], 4), slot("situational", ["situational"], 6)],
  },
  {
    id: "mode-interview-vocabulary",
    title: "Interview Vocabulary Test",
    description: "Words and phrases you need to describe yourself and your skills in a cabin crew interview, tested in context.",
    category: "vocabulary",
    length: 20,
    levels: PROFESSIONAL_LEVELS,
    slots: [
      {
        key: "interview-vocabulary",
        categories: ["vocabulary"],
        count: 20,
        min: 20,
        max: 20,
        topicPrefix: INTERVIEW_TOPIC_PREFIX,
        topics: INTERVIEW_TOPICS,
      },
    ],
  },
];

/** The set id used to file results: the standard length keeps the original id, so earlier results stay together. */
export function modeSetId(mode: Pick<TestMode, "id" | "length">, length: number): string {
  return length === mode.length ? mode.id : `${mode.id}-${length}`;
}
