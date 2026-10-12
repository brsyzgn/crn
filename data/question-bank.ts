import type { QuizQuestion } from "../types/index.ts";
import { CABIN_CREW_QUESTIONS } from "./questions/cabin-crew.ts";
import { ERROR_CORRECTION_QUESTIONS, SENTENCE_COMPLETION_QUESTIONS } from "./questions/correction-completion.ts";
import { EVERYDAY_QUESTIONS } from "./questions/everyday.ts";
import { GRAMMAR_QUESTIONS } from "./questions/grammar.ts";
import { readingBank } from "./questions/helpers.ts";
import { READING_PASSAGES_A } from "./questions/reading-a.ts";
import { READING_PASSAGES_B } from "./questions/reading-b.ts";
import { READING_PASSAGES_C } from "./questions/reading-c.ts";
import { EXTRA_ERROR_CORRECTION_QUESTIONS, EXTRA_SENTENCE_COMPLETION_QUESTIONS } from "./questions/extra-correction.ts";
import { EXTRA_GRAMMAR_QUESTIONS } from "./questions/extra-grammar.ts";
import {
  EXTRA_CUSTOMER_SERVICE_QUESTIONS,
  EXTRA_EVERYDAY_QUESTIONS,
  EXTRA_WORKPLACE_QUESTIONS,
} from "./questions/extra-service.ts";
import { EXTRA_CABIN_CREW_QUESTIONS, EXTRA_SITUATIONAL_QUESTIONS } from "./questions/extra-situational.ts";
import { EXTRA_VOCABULARY_QUESTIONS } from "./questions/extra-vocabulary.ts";
import { CUSTOMER_SERVICE_QUESTIONS, WORKPLACE_QUESTIONS } from "./questions/service-workplace.ts";
import { SITUATIONAL_QUESTIONS } from "./questions/situational.ts";
import { VOCABULARY_QUESTIONS } from "./questions/vocabulary.ts";

/** Reading passages (each has 5 questions that share the passage text). */
export const READING_PASSAGES = [...READING_PASSAGES_A, ...READING_PASSAGES_B, ...READING_PASSAGES_C];

/**
 * The expanded question bank used by Practice and the randomized tests.
 * It sits next to the original 64 questions in data/quiz.ts and never replaces them.
 */
export const BANK_QUESTIONS: readonly QuizQuestion[] = [
  ...GRAMMAR_QUESTIONS,
  ...EXTRA_GRAMMAR_QUESTIONS,
  ...VOCABULARY_QUESTIONS,
  ...EXTRA_VOCABULARY_QUESTIONS,
  ...EVERYDAY_QUESTIONS,
  ...EXTRA_EVERYDAY_QUESTIONS,
  ...CABIN_CREW_QUESTIONS,
  ...EXTRA_CABIN_CREW_QUESTIONS,
  ...CUSTOMER_SERVICE_QUESTIONS,
  ...EXTRA_CUSTOMER_SERVICE_QUESTIONS,
  ...WORKPLACE_QUESTIONS,
  ...EXTRA_WORKPLACE_QUESTIONS,
  ...SITUATIONAL_QUESTIONS,
  ...EXTRA_SITUATIONAL_QUESTIONS,
  ...ERROR_CORRECTION_QUESTIONS,
  ...EXTRA_ERROR_CORRECTION_QUESTIONS,
  ...SENTENCE_COMPLETION_QUESTIONS,
  ...EXTRA_SENTENCE_COMPLETION_QUESTIONS,
  ...readingBank(READING_PASSAGES),
];
