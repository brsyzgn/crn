import type { QuizAnswerRecord, QuizQuestion, QuizResult, QuizSet } from "@/types";

export interface ScoredAnswer {
  question: QuizQuestion;
  selectedIndex: number | null;
  isCorrect: boolean;
}

export interface QuizScore {
  total: number;
  correct: number;
  incorrect: number;
  /** Integer percentage (0–100), rounded half up. */
  scorePercent: number;
  review: ScoredAnswer[];
}

/**
 * Pure, deterministic scoring. A question is correct only when the selected
 * index equals the question's single correct index.
 */
export function scoreQuiz(
  questions: readonly QuizQuestion[],
  answers: readonly QuizAnswerRecord[],
): QuizScore {
  const byId = new Map(answers.map((a) => [a.questionId, a.selectedIndex]));
  const review: ScoredAnswer[] = questions.map((question) => {
    const selected = byId.get(question.id) ?? null;
    return {
      question,
      selectedIndex: selected,
      isCorrect: selected === question.answerIndex,
    };
  });
  const total = questions.length;
  const correct = review.filter((r) => r.isCorrect).length;
  return {
    total,
    correct,
    incorrect: total - correct,
    scorePercent: total === 0 ? 0 : Math.floor((correct * 100) / total + 0.5),
    review,
  };
}

export function buildQuizResult(
  set: QuizSet,
  questions: readonly QuizQuestion[],
  answers: readonly QuizAnswerRecord[],
  takenAt: Date,
): QuizResult {
  const score = scoreQuiz(questions, answers);
  return {
    id: `${set.id}-${takenAt.getTime()}`,
    setId: set.id,
    category: set.category,
    title: set.title,
    takenAt: takenAt.toISOString(),
    total: score.total,
    correct: score.correct,
    scorePercent: score.scorePercent,
    answers: answers.map((a) => ({ ...a })),
  };
}

export function scoreMessage(percent: number): string {
  if (percent === 100) return "Perfect score. Excellent work, Ceren!";
  if (percent >= 80) return "Great result. You are really getting the hang of this.";
  if (percent >= 60) return "Good effort. Review the explanations and try again.";
  return "A good start. Read the explanations, then retake the test to improve.";
}
