import { INTERVIEW_BY_ID } from "@/data/interview";
import { QUIZ_CATEGORY_LABELS } from "@/data/quiz";
import { VOCABULARY, VOCABULARY_BY_ID } from "@/data/vocabulary";
import { INTERVIEW_CATEGORIES, type AiMode, type ProgressState, type QuizCategory, QUIZ_CATEGORIES } from "@/types";
import { lastDateKeys, toDateKey } from "@/lib/utils";

/**
 * Every number below is derived from data the user has actually saved.
 * Nothing is estimated, simulated or pre-filled. No streaks or durations.
 */

export interface DailyPoint {
  date: string;
  /** Short weekday label, e.g. "Mon" */
  label: string;
  words: number;
  interview: number;
  quizzes: number;
  ai: number;
  total: number;
}

export type ActivityType = "word" | "interview" | "answer" | "quiz" | "ai";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  detail?: string;
  at: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  /** ISO timestamp when unlocked, or null when still locked. */
  unlockedAt: string | null;
}

export interface CategoryScore {
  category: QuizCategory;
  label: string;
  attempts: number;
  average: number | null;
}

export interface Stats {
  wordsLearned: number;
  totalWords: number;
  favorites: number;
  questionsPracticed: number;
  savedAnswers: number;
  quizAttempts: number;
  averageScore: number | null;
  aiSessions: number;
  today: { words: number; interview: number; quizzes: number };
  daily: DailyPoint[];
  categoryScores: CategoryScore[];
  recent: ActivityItem[];
  achievements: Achievement[];
  hasActivity: boolean;
}

const AI_LABELS: Record<AiMode, string> = {
  interview: "Mock interview",
  conversation: "Everyday conversation",
  grammar: "Grammar correction",
  improve: "Answer improvement",
};

export function computeStats(p: ProgressState, now: Date): Stats {
  const learned = Object.entries(p.learnedWords).filter(([id]) => VOCABULARY_BY_ID.has(id));
  const practiced = Object.entries(p.practicedQuestions).filter(([id]) =>
    INTERVIEW_BY_ID.has(id),
  );
  const answers = Object.entries(p.interviewAnswers).filter(([id]) => INTERVIEW_BY_ID.has(id));
  const favorites = p.favoriteWords.filter((id) => VOCABULARY_BY_ID.has(id));

  const quizAttempts = p.quizResults.length;
  const averageScore =
    quizAttempts === 0
      ? null
      : Math.round(p.quizResults.reduce((s, r) => s + r.scorePercent, 0) / quizAttempts);

  /* ------------------------------- daily ---------------------------------- */
  const keys = lastDateKeys(7, now);
  const index = new Map(keys.map((k, i) => [k, i]));
  const daily: DailyPoint[] = keys.map((date) => {
    const [y, m, d] = date.split("-").map(Number);
    return {
      date,
      label: new Date(y, m - 1, d).toLocaleDateString("en-GB", { weekday: "short" }),
      words: 0,
      interview: 0,
      quizzes: 0,
      ai: 0,
      total: 0,
    };
  });
  const bump = (iso: string, field: "words" | "interview" | "quizzes" | "ai") => {
    const i = index.get(toDateKey(iso));
    if (i === undefined) return;
    daily[i][field] += 1;
    daily[i].total += 1;
  };
  learned.forEach(([, at]) => bump(at, "words"));
  practiced.forEach(([, at]) => bump(at, "interview"));
  answers.forEach(([, a]) => bump(a.updatedAt, "interview"));
  p.quizResults.forEach((r) => bump(r.takenAt, "quizzes"));
  p.aiPractice.forEach((e) => bump(e.at, "ai"));

  const todayKey = toDateKey(now);
  const practicedToday = practiced.filter(([, at]) => toDateKey(at) === todayKey).length;

  /* ---------------------------- category scores --------------------------- */
  const categoryScores: CategoryScore[] = QUIZ_CATEGORIES.map((category) => {
    const results = p.quizResults.filter((r) => r.category === category);
    return {
      category,
      label: QUIZ_CATEGORY_LABELS[category],
      attempts: results.length,
      average:
        results.length === 0
          ? null
          : Math.round(results.reduce((s, r) => s + r.scorePercent, 0) / results.length),
    };
  });

  /* ------------------------------ recent feed ----------------------------- */
  const feed: ActivityItem[] = [];
  learned.forEach(([id, at]) => {
    const w = VOCABULARY_BY_ID.get(id)!;
    feed.push({ id: `w-${id}`, type: "word", title: `Learned “${w.word}”`, detail: w.category, at });
  });
  practiced.forEach(([id, at]) => {
    const qn = INTERVIEW_BY_ID.get(id)!;
    feed.push({ id: `p-${id}`, type: "interview", title: "Practiced an interview question", detail: qn.question, at });
  });
  answers.forEach(([id, a]) => {
    const qn = INTERVIEW_BY_ID.get(id)!;
    feed.push({ id: `a-${id}`, type: "answer", title: "Saved an answer draft", detail: qn.question, at: a.updatedAt });
  });
  p.quizResults.forEach((r) => {
    feed.push({
      id: `q-${r.id}`,
      type: "quiz",
      title: `Completed ${r.title}`,
      detail: `${r.correct}/${r.total} correct · ${r.scorePercent}%`,
      at: r.takenAt,
    });
  });
  p.aiPractice.forEach((e, i) => {
    feed.push({ id: `ai-${i}-${e.at}`, type: "ai", title: `AI practice: ${AI_LABELS[e.mode]}`, at: e.at });
  });
  feed.sort((a, b) => Date.parse(b.at) - Date.parse(a.at));

  /* ----------------------------- achievements ----------------------------- */
  const learnedTimes = learned.map(([, at]) => at).sort();
  const practicedSorted = [...practiced].sort((a, b) => a[1].localeCompare(b[1]));
  const nth = (list: string[], n: number) => (list.length >= n ? list[n - 1] : null);

  const wordMilestone = (n: number, title: string): Achievement => ({
    id: `words-${n}`,
    title,
    description: `Learn ${n} ${n === 1 ? "word" : "words"}.`,
    unlockedAt: nth(learnedTimes, n),
  });

  const categoryFirstTimes = new Map<string, string>();
  practicedSorted.forEach(([id, at]) => {
    const cat = INTERVIEW_BY_ID.get(id)!.category;
    if (!categoryFirstTimes.has(cat)) categoryFirstTimes.set(cat, at);
  });
  const allCategoriesAt =
    categoryFirstTimes.size === INTERVIEW_CATEGORIES.length
      ? [...categoryFirstTimes.values()].sort().at(-1) ?? null
      : null;

  const quizzesByTime = [...p.quizResults].sort((a, b) => a.takenAt.localeCompare(b.takenAt));
  const firstQuiz = quizzesByTime[0]?.takenAt ?? null;
  const firstGood = quizzesByTime.find((r) => r.scorePercent >= 80)?.takenAt ?? null;
  const firstPerfect = quizzesByTime.find((r) => r.scorePercent === 100)?.takenAt ?? null;
  const firstAi = p.aiPractice[0]?.at ?? null;

  const achievements: Achievement[] = [
    wordMilestone(1, "First word"),
    wordMilestone(10, "Ten words"),
    wordMilestone(25, "Word collector"),
    wordMilestone(50, "Half-way to 100"),
    wordMilestone(100, "Vocabulary star"),
    { id: "interview-1", title: "First practice", description: "Mark one interview question as practiced.", unlockedAt: practicedSorted[0]?.[1] ?? null },
    { id: "interview-10", title: "Interview ready", description: "Practice 10 interview questions.", unlockedAt: practicedSorted[9]?.[1] ?? null },
    { id: "interview-all-categories", title: "Well-rounded", description: "Practice at least one question from every interview category.", unlockedAt: allCategoriesAt },
    { id: "quiz-1", title: "First quiz", description: "Complete a mini test.", unlockedAt: firstQuiz },
    { id: "quiz-80", title: "High scorer", description: "Score 80% or more on a mini test.", unlockedAt: firstGood },
    { id: "quiz-100", title: "Perfect score", description: "Score 100% on a mini test.", unlockedAt: firstPerfect },
    { id: "ai-1", title: "AI practice", description: "Complete an AI practice conversation.", unlockedAt: firstAi },
  ];

  const hasActivity =
    learned.length > 0 ||
    practiced.length > 0 ||
    answers.length > 0 ||
    quizAttempts > 0 ||
    p.aiPractice.length > 0 ||
    favorites.length > 0;

  return {
    wordsLearned: learned.length,
    totalWords: VOCABULARY.length,
    favorites: favorites.length,
    questionsPracticed: practiced.length,
    savedAnswers: answers.length,
    quizAttempts,
    averageScore,
    aiSessions: p.aiPractice.length,
    today: {
      words: learned.filter(([, at]) => toDateKey(at) === todayKey).length,
      interview: practicedToday,
      quizzes: p.quizResults.filter((r) => toDateKey(r.takenAt) === todayKey).length,
    },
    daily,
    categoryScores,
    recent: feed.slice(0, 8),
    achievements,
    hasActivity,
  };
}
