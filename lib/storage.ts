import type {
  AiMode,
  MotionPreference,
  Preferences,
  ProgressState,
  QuizResult,
  SpeechLang,
} from "@/types";

/**
 * Versioned LocalStorage persistence.
 *
 * - Every value read from storage is treated as untrusted and sanitised.
 * - If storage is unavailable (private mode, blocked cookies, quota), the app
 *   keeps working in memory and `available` is reported as false.
 * - Unknown/corrupt payloads are backed up under a separate key and never
 *   crash the UI.
 */

export const STORAGE_KEY = "ceren-english-club:progress";
export const BACKUP_KEY = "ceren-english-club:progress:backup";
export const STORAGE_VERSION = 1 as const;

export const MAX_QUIZ_RESULTS = 100;
export const MAX_AI_EVENTS = 200;
export const MAX_ANSWER_LENGTH = 4000;

export const DEFAULT_PREFERENCES: Preferences = {
  dailyWordGoal: 5,
  speechLang: "en-US",
  motion: "system",
  sidebarCollapsed: false,
};

export function createDefaultState(): ProgressState {
  return {
    version: STORAGE_VERSION,
    learnedWords: {},
    favoriteWords: [],
    interviewAnswers: {},
    practicedQuestions: {},
    quizResults: [],
    aiPractice: [],
    preferences: { ...DEFAULT_PREFERENCES },
  };
}

/* ------------------------------ sanitising -------------------------------- */

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isIso(v: unknown): v is string {
  return typeof v === "string" && !Number.isNaN(Date.parse(v));
}

function sanitizeTimestampMap(v: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (!isRecord(v)) return out;
  for (const [k, val] of Object.entries(v)) {
    if (isIso(val)) out[k] = val;
  }
  return out;
}

function sanitizeQuizResult(v: unknown): QuizResult | null {
  if (!isRecord(v)) return null;
  const { id, setId, category, title, takenAt, total, correct, scorePercent, answers } = v;
  if (
    typeof id !== "string" ||
    typeof setId !== "string" ||
    typeof title !== "string" ||
    !isIso(takenAt) ||
    typeof total !== "number" ||
    typeof correct !== "number" ||
    typeof scorePercent !== "number" ||
    (category !== "vocabulary" &&
      category !== "grammar" &&
      category !== "reading" &&
      category !== "cabin-crew" &&
      category !== "mixed" &&
      category !== "customer-service") ||
    !Array.isArray(answers)
  ) {
    return null;
  }
  return {
    id,
    setId,
    category,
    title,
    takenAt,
    total,
    correct,
    scorePercent,
    answers: answers.flatMap((a) =>
      isRecord(a) && typeof a.questionId === "string"
        ? [
            {
              questionId: a.questionId,
              selectedIndex:
                typeof a.selectedIndex === "number" ? a.selectedIndex : null,
            },
          ]
        : [],
    ),
  };
}

const AI_MODES: readonly AiMode[] = ["interview", "conversation", "grammar", "improve"];
const SPEECH_LANGS: readonly SpeechLang[] = ["en-US", "en-GB"];
const MOTIONS: readonly MotionPreference[] = ["system", "reduce", "full"];

export function sanitizePreferences(v: unknown): Preferences {
  const p = isRecord(v) ? v : {};
  const goal = typeof p.dailyWordGoal === "number" ? Math.round(p.dailyWordGoal) : NaN;
  return {
    dailyWordGoal:
      Number.isFinite(goal) && goal >= 1 && goal <= 50
        ? goal
        : DEFAULT_PREFERENCES.dailyWordGoal,
    speechLang: SPEECH_LANGS.includes(p.speechLang as SpeechLang)
      ? (p.speechLang as SpeechLang)
      : DEFAULT_PREFERENCES.speechLang,
    motion: MOTIONS.includes(p.motion as MotionPreference)
      ? (p.motion as MotionPreference)
      : DEFAULT_PREFERENCES.motion,
    sidebarCollapsed: p.sidebarCollapsed === true,
  };
}

/** Turns arbitrary parsed JSON into a valid current-version state. */
export function sanitizeState(raw: unknown): ProgressState {
  const base = createDefaultState();
  if (!isRecord(raw)) return base;

  const answers: ProgressState["interviewAnswers"] = {};
  if (isRecord(raw.interviewAnswers)) {
    for (const [k, val] of Object.entries(raw.interviewAnswers)) {
      if (isRecord(val) && typeof val.text === "string" && isIso(val.updatedAt)) {
        answers[k] = {
          text: val.text.slice(0, MAX_ANSWER_LENGTH),
          updatedAt: val.updatedAt,
        };
      }
    }
  }

  return {
    version: STORAGE_VERSION,
    learnedWords: sanitizeTimestampMap(raw.learnedWords),
    favoriteWords: Array.isArray(raw.favoriteWords)
      ? Array.from(new Set(raw.favoriteWords.filter((x): x is string => typeof x === "string")))
      : [],
    interviewAnswers: answers,
    practicedQuestions: sanitizeTimestampMap(raw.practicedQuestions),
    quizResults: Array.isArray(raw.quizResults)
      ? raw.quizResults
          .map(sanitizeQuizResult)
          .filter((r): r is QuizResult => r !== null)
          .slice(-MAX_QUIZ_RESULTS)
      : [],
    aiPractice: Array.isArray(raw.aiPractice)
      ? raw.aiPractice
          .flatMap((e) =>
            isRecord(e) && isIso(e.at) && AI_MODES.includes(e.mode as AiMode)
              ? [{ at: e.at as string, mode: e.mode as AiMode }]
              : [],
          )
          .slice(-MAX_AI_EVENTS)
      : [],
    preferences: sanitizePreferences(raw.preferences),
  };
}

/** Versioned migration entry point. Add new `case`s when bumping the version. */
export function migrate(raw: unknown): ProgressState | null {
  if (!isRecord(raw)) return null;
  switch (raw.version) {
    case 1:
      return sanitizeState(raw);
    default:
      return null;
  }
}

/* ------------------------------ browser I/O ------------------------------- */

export interface LoadResult {
  state: ProgressState;
  available: boolean;
}

export function loadFromStorage(): LoadResult {
  if (typeof window === "undefined") {
    return { state: createDefaultState(), available: false };
  }
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return { state: createDefaultState(), available: false };
  }
  if (!raw) return { state: createDefaultState(), available: probeStorage() };

  try {
    const migrated = migrate(JSON.parse(raw));
    if (migrated) return { state: migrated, available: true };
  } catch {
    /* fall through to backup */
  }
  try {
    window.localStorage.setItem(BACKUP_KEY, raw);
  } catch {
    /* ignore */
  }
  return { state: createDefaultState(), available: true };
}

export function probeStorage(): boolean {
  try {
    const k = `${STORAGE_KEY}:probe`;
    window.localStorage.setItem(k, "1");
    window.localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

export function saveToStorage(state: ProgressState): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function clearStorage(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(BACKUP_KEY);
  } catch {
    /* ignore */
  }
}
