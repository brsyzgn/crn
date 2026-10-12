/* -------------------------------------------------------------------------- */
/*  Content types                                                             */
/* -------------------------------------------------------------------------- */

/** Finer CEFR labels used across the app (vocabulary, interview questions and the question bank). */
export const CEFR_LEVELS = ["B1", "B1+", "B2", "B2+"] as const;
export type CefrLevel = (typeof CEFR_LEVELS)[number];
export type Level = CefrLevel;

export const VOCABULARY_CATEGORIES = [
  "Aviation",
  "Customer Service",
  "Travel",
  "Safety",
  "Everyday English",
  "Interview Vocabulary",
] as const;
export type VocabularyCategory = (typeof VOCABULARY_CATEGORIES)[number];

export interface VocabularyEntry {
  /** Stable slug; used as the persistence key. Never change once published. */
  id: string;
  word: string;
  turkish: string;
  partOfSpeech: string;
  example: string;
  turkishNote?: string;
  /** Natural collocations / chunks that go with the word, e.g. "handle a complaint". */
  collocations?: string[];
  category: VocabularyCategory;
  level: Level;
}

export const INTERVIEW_CATEGORIES = [
  "Personal Introduction",
  "Motivation",
  "Strengths & Weaknesses",
  "Work Experience",
  "Customer Service",
  "Teamwork",
  "Conflict Resolution",
  "Stress Management",
  "Problem Solving",
  "Communication",
  "Adaptability",
  "Professionalism",
  "Cabin Crew Situations",
  "Passenger Situations",
  "Safety Awareness",
  "Behavioral Questions",
  "Opinion Questions",
  "Unexpected Questions",
] as const;
export type InterviewCategory = (typeof INTERVIEW_CATEGORIES)[number];

/** How to structure an answer. STAR is used for behavioural questions only. */
export type AnswerFramework = "STAR" | "SITUATION-ACTION-RESULT" | "OPINION-REASON-EXAMPLE" | "NONE";

/**
 * Every question in the bank is a "Representative Practice Question": written for practice and
 * not reported by any candidate or airline. (A candidate-reported question would need real
 * source metadata; none is claimed.)
 */
export type InterviewSource = "representative";

export interface InterviewQuestion {
  id: string;
  question: string;
  /** Turkish translation of the question. */
  turkish: string;
  category: InterviewCategory;
  difficulty: Level;
  /** The competency the interviewer is evaluating. */
  competency: string;
  /** Why interviewers ask this question. */
  why: string;
  /** What a good answer should include. */
  keyPoints: string[];
  /** Simple, clear, speakable model answer (B1 / B1+). */
  sampleAnswer: string;
  /** More developed, natural model answer (B2). */
  sampleAnswerB2: string;
  vocabulary: string[];
  phrases: string[];
  tips: string[];
  commonMistakes: string[];
  /** 2–4 follow-up questions an interviewer may ask next. */
  followUps: string[];
  framework: AnswerFramework;
  source: InterviewSource;
  turkishNote?: string;
}

export const QUIZ_CATEGORIES = [
  "vocabulary",
  "grammar",
  "reading",
  "cabin-crew",
] as const;
export type QuizCategory = (typeof QUIZ_CATEGORIES)[number];

/** Every skill area a quiz question can belong to (the Practice categories). */
export const QUESTION_CATEGORIES = [
  ...QUIZ_CATEGORIES,
  "everyday",
  "workplace",
  "customer-service",
  "situational",
  "sentence-completion",
  "error-correction",
] as const;
export type QuestionCategory = (typeof QUESTION_CATEGORIES)[number];

/** Optional teaching notes shown under the explanation after answering. */
export interface QuestionExtras {
  /** Why the other options do not work. */
  whyNot?: string;
  /** A useful phrase to remember. */
  phrase?: string;
  /** The grammar rule behind the answer. */
  rule?: string;
  /** A vocabulary note (meaning, collocation, register). */
  note?: string;
}

export type ReadingSkill =
  | "main idea"
  | "specific information"
  | "inference"
  | "vocabulary in context"
  | "author's intention"
  | "logical conclusion"
  | "reference"
  | "tone and attitude"
  | "cause and effect";

export interface QuizQuestion {
  id: string;
  category: QuestionCategory;
  difficulty: CefrLevel;
  /** Short subject label, e.g. "Third conditional". */
  topic: string;
  prompt: string;
  /** Optional reading passage shown above the prompt. */
  passage?: string;
  /** Always exactly four options. */
  choices: readonly [string, string, string, string];
  /** Index (0-3) of the single correct choice. */
  answerIndex: 0 | 1 | 2 | 3;
  explanation: string;
  extras?: QuestionExtras;
  /** Reading questions only: the title of the passage and the skill being tested. */
  passageTitle?: string;
  passageId?: string;
  skill?: ReadingSkill;
}

/** Test results are filed under a skill category, or one of two extra test families. */
export type ResultCategory = QuizCategory | "mixed" | "customer-service";

export interface QuizSet {
  id: string;
  category: ResultCategory;
  title: string;
  description: string;
  questionIds: string[];
}

export interface DailyPhrase {
  id: string;
  phrase: string;
  turkish: string;
  usage: string;
}

/* -------------------------------------------------------------------------- */
/*  Persisted progress types                                                  */
/* -------------------------------------------------------------------------- */

export type SpeechLang = "en-US" | "en-GB";
export type MotionPreference = "system" | "reduce" | "full";

export interface Preferences {
  /** Number of new words Ceren wants to learn each day. */
  dailyWordGoal: number;
  speechLang: SpeechLang;
  motion: MotionPreference;
  sidebarCollapsed: boolean;
}

export interface SavedAnswer {
  text: string;
  /** ISO timestamp */
  updatedAt: string;
}

export interface QuizAnswerRecord {
  questionId: string;
  /** null when the question was left unanswered (cannot happen in the UI, but kept for safety). */
  selectedIndex: number | null;
}

export interface QuizResult {
  id: string;
  setId: string;
  category: ResultCategory;
  title: string;
  /** ISO timestamp */
  takenAt: string;
  total: number;
  correct: number;
  /** Integer percentage 0-100 */
  scorePercent: number;
  answers: QuizAnswerRecord[];
}

export type AiMode = "interview" | "conversation" | "grammar" | "improve";

export interface AiPracticeEvent {
  /** ISO timestamp */
  at: string;
  mode: AiMode;
}

export interface ProgressState {
  version: 1;
  /** word id -> ISO timestamp it was marked learned */
  learnedWords: Record<string, string>;
  favoriteWords: string[];
  /** question id -> saved draft answer */
  interviewAnswers: Record<string, SavedAnswer>;
  /** question id -> ISO timestamp it was marked practiced */
  practicedQuestions: Record<string, string>;
  quizResults: QuizResult[];
  aiPractice: AiPracticeEvent[];
  preferences: Preferences;
}
