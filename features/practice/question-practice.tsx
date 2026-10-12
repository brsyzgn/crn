"use client";

import { BookOpenCheck, Play } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ALL_QUESTIONS, QUESTION_CATEGORY_LABELS } from "@/data/quiz";
import { useProgress } from "@/hooks/use-progress";
import { loadSeen, markSeen } from "@/lib/question-history";
import {
  buildPracticeSession,
  mergeSeen,
  PRACTICE_LEVEL_LABELS,
  practicePool,
  seenFromResults,
  type PracticeCategory,
  type PracticeLevel,
} from "@/lib/question-selection";
import { cn } from "@/lib/utils";
import { QuizEngine } from "@/features/quiz/quiz-engine";
import { QUESTION_CATEGORIES, type QuizSet } from "@/types";

const CATEGORIES: readonly PracticeCategory[] = ["mixed", ...QUESTION_CATEGORIES];
const LEVELS: readonly PracticeLevel[] = ["all", "B1", "B1+", "B2"];
const LENGTHS = [5, 10, 20] as const;

function categoryLabel(c: PracticeCategory): string {
  return c === "mixed" ? "Mixed English" : QUESTION_CATEGORY_LABELS[c];
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "h-10 shrink-0 rounded-full border px-4 text-sm font-medium transition-colors",
        active
          ? "border-blush bg-rose text-plum"
          : "border-border-soft bg-white text-muted-strong hover:border-blush hover:text-plum",
      )}
    >
      {children}
    </button>
  );
}

/**
 * Multiple-choice practice with instant feedback. It reuses the quiz engine (feedback, explanations,
 * review) but is not saved to the test history. Each session draws fresh questions and avoids ones
 * answered recently.
 */
export function QuestionPractice() {
  const { progress } = useProgress();
  const [category, setCategory] = useState<PracticeCategory>("mixed");
  const [level, setLevel] = useState<PracticeLevel>("all");
  const [length, setLength] = useState<(typeof LENGTHS)[number]>(10);
  const [session, setSession] = useState<{ set: QuizSet; key: number } | null>(null);

  const available = useMemo(() => practicePool(ALL_QUESTIONS, category, level).length, [category, level]);

  const start = () => {
    const seen = mergeSeen(seenFromResults(progress.quizResults), loadSeen());
    const questions = buildPracticeSession(ALL_QUESTIONS, category, level, length, seen, Math.random);
    if (questions.length === 0) return;
    const set: QuizSet = {
      id: `practice-${category}-${level}`,
      category: "mixed",
      title: `Practice · ${categoryLabel(category)}${level === "all" ? "" : ` · ${PRACTICE_LEVEL_LABELS[level]}`}`,
      description: "Practice session",
      questionIds: questions.map((q) => q.id),
    };
    setSession((s) => ({ set, key: (s?.key ?? 0) + 1 }));
    window.scrollTo({ top: 0 });
  };

  if (session) {
    return (
      <QuizEngine
        key={session.key}
        set={session.set}
        // Practice sessions are not added to the test history; they only update "recently answered".
        onFinish={(result) => markSeen(result.answers.map((a) => a.questionId))}
        onAnswered={(id) => markSeen([id])}
        onExit={() => setSession(null)}
        onRetake={start}
        labels={{ retake: "Practise again with new questions", exit: "Back to practice setup" }}
      />
    );
  }

  const size = Math.min(length, available);

  return (
    <>
      <PageHeader
        eyebrow="Question practice"
        title="Practise with questions"
        description={`Choose a topic and a level, then answer one question at a time. You see the right answer and an explanation straight away. ${ALL_QUESTIONS.length} questions, and every session uses fresh ones.`}
      />

      <div className="space-y-7">
        <section aria-labelledby="practice-topic">
          <h2 id="practice-topic" className="mb-3 text-sm font-semibold text-plum">
            Topic
          </h2>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Practice category">
            {CATEGORIES.map((c) => (
              <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
                {categoryLabel(c)}
              </Chip>
            ))}
          </div>
        </section>

        <section aria-labelledby="practice-level">
          <h2 id="practice-level" className="mb-3 text-sm font-semibold text-plum">
            Level
          </h2>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Practice difficulty">
            {LEVELS.map((l) => (
              <Chip key={l} active={level === l} onClick={() => setLevel(l)}>
                {PRACTICE_LEVEL_LABELS[l]}
              </Chip>
            ))}
          </div>
        </section>

        <section aria-labelledby="practice-length">
          <h2 id="practice-length" className="mb-3 text-sm font-semibold text-plum">
            Session length
          </h2>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Number of questions">
            {LENGTHS.map((n) => (
              <Chip key={n} active={length === n} onClick={() => setLength(n)}>
                {n} questions
              </Chip>
            ))}
          </div>
        </section>

        <Card>
          <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-rose text-rose-deep">
                <BookOpenCheck className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-lg font-semibold text-plum">
                  {categoryLabel(category)}
                  {level !== "all" && ` · ${PRACTICE_LEVEL_LABELS[level]}`}
                </p>
                <p className="text-sm text-muted-strong" aria-live="polite">
                  {available === 0
                    ? "There are no questions for this combination yet. Try another level."
                    : `${available} questions available · this session has ${category === "reading" ? "about " : ""}${size} questions.`}
                </p>
                <p className="mt-1 text-xs text-muted-strong">Practice sessions are not added to your test history.</p>
              </div>
            </div>
            <Button onClick={start} disabled={available === 0} className="shrink-0">
              <Play /> Start practice
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
