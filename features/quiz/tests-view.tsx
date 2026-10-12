"use client";

import { ChevronDown, ClipboardCheck, History, Play } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { PageHeader } from "@/components/page-header";
import { useToast } from "@/components/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ALL_QUESTIONS, QUIZ_CATEGORY_LABELS, QUIZ_QUESTIONS_BY_ID, QUIZ_SETS } from "@/data/quiz";
import { modeSetId, TEST_MODES, type TestMode } from "@/data/test-modes";
import { useProgress } from "@/hooks/use-progress";
import { loadSeen, markSeen } from "@/lib/question-history";
import { buildModeQuestions, mergeSeen, seenFromResults, TEST_LENGTHS } from "@/lib/question-selection";
import { scoreQuiz } from "@/lib/quiz";
import { cn } from "@/lib/utils";
import { QUIZ_CATEGORIES, type QuizQuestion, type QuizSet, type ResultCategory } from "@/types";
import { QuizEngine } from "./quiz-engine";
import { QuizReview } from "./quiz-review";

/** The original four categories, plus the two families added by the randomized test modes. */
const TEST_TABS: readonly ResultCategory[] = [...QUIZ_CATEGORIES, "customer-service", "mixed"];

function scoreVariant(p: number) {
  return p >= 80 ? "success" : p >= 60 ? "sand" : "danger";
}

export function TestsView() {
  const { progress, hydrated, actions } = useProgress();
  const toast = useToast();

  const [category, setCategory] = useState<ResultCategory>("vocabulary");
  const [activeSet, setActiveSet] = useState<QuizSet | null>(null);
  /** Set when the active test is a randomized mode, so "Retake" draws fresh questions. */
  const [activeMode, setActiveMode] = useState<TestMode | null>(null);
  const [runKey, setRunKey] = useState(0);
  /** Length of the randomized tests: Quick 10, Standard 20 or Full 30. */
  const [length, setLength] = useState<number>(20);
  const [activeLength, setActiveLength] = useState<number>(20);

  const history = useMemo(
    () => [...progress.quizResults].sort((a, b) => b.takenAt.localeCompare(a.takenAt)),
    [progress.quizResults],
  );

  const startMode = (mode: TestMode, testLength: number = length) => {
    const seen = mergeSeen(seenFromResults(progress.quizResults), loadSeen());
    const questionIds = buildModeQuestions(mode, ALL_QUESTIONS, seen, Math.random, testLength).map((q) => q.id);
    if (questionIds.length === 0) return;
    const label = TEST_LENGTHS.find((l) => l.length === testLength)?.label;
    setActiveMode(mode);
    setActiveLength(testLength);
    setActiveSet({
      id: modeSetId(mode, testLength),
      category: mode.category,
      title: testLength === mode.length || !label ? mode.title : `${mode.title} · ${label} ${testLength}`,
      description: mode.description,
      questionIds,
    });
    setRunKey((k) => k + 1);
    window.scrollTo({ top: 0 });
  };

  if (!hydrated) {
    return (
      <>
        <PageHeader title="Mini Tests" description="Check your knowledge and track your progress." />
        <LoadingState rows={2} label="Loading tests…" />
      </>
    );
  }

  if (activeSet) {
    return (
      <QuizEngine
        key={`${activeSet.id}-${runKey}`}
        set={activeSet}
        onFinish={(result) => {
          actions.addQuizResult(result);
          toast(`Test saved: ${result.correct}/${result.total} correct`);
        }}
        onAnswered={(id) => markSeen([id])}
        onExit={() => {
          setActiveSet(null);
          setActiveMode(null);
        }}
        onRetake={() => (activeMode ? startMode(activeMode, activeLength) : setRunKey((k) => k + 1))}
      />
    );
  }

  const sets = QUIZ_SETS.filter((s) => s.category === category);
  const modes = TEST_MODES.filter((m) => m.category === category);

  return (
    <>
      <PageHeader
        eyebrow="Mini tests"
        title="Test what you know"
        description={`${ALL_QUESTIONS.length} reviewed questions across vocabulary, grammar, reading, cabin crew and customer service English, including mixed-level tests that draw fresh questions every time. You get instant feedback and an explanation for every question.`}
      />

      <div className="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Test category">
        {TEST_TABS.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
            className={cn(
              "h-10 shrink-0 rounded-full border px-4 text-sm font-medium transition-colors",
              category === c
                ? "border-blush bg-rose text-plum"
                : "border-border-soft bg-white text-muted-strong hover:border-blush hover:text-plum",
            )}
          >
            {QUIZ_CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2" role="group" aria-label="Length of randomized tests">
        <span className="mr-1 text-sm font-medium text-muted-strong">Randomized test length:</span>
        {TEST_LENGTHS.map((l) => (
          <button
            key={l.id}
            type="button"
            aria-pressed={length === l.length}
            onClick={() => setLength(l.length)}
            className={cn(
              "h-9 rounded-full border px-3.5 text-sm font-medium transition-colors",
              length === l.length
                ? "border-blush bg-rose text-plum"
                : "border-border-soft bg-white text-muted-strong hover:border-blush hover:text-plum",
            )}
          >
            {l.label} {l.length}
          </button>
        ))}
      </div>

      <section aria-label="Available tests" className="grid gap-4 sm:grid-cols-2">
        {sets.map((set) => {
          const attempts = progress.quizResults.filter((r) => r.setId === set.id);
          const best = attempts.length ? Math.max(...attempts.map((a) => a.scorePercent)) : null;
          return (
            <Card key={set.id} className="flex flex-col transition-shadow hover:shadow-lift">
              <CardContent className="flex flex-1 flex-col pt-6">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge>{QUIZ_CATEGORY_LABELS[set.category]}</Badge>
                  <Badge variant="outline">{set.questionIds.length} questions</Badge>
                </div>
                <h2 className="font-display text-xl font-semibold text-plum">{set.title}</h2>
                <p className="mt-1.5 flex-1 text-sm text-muted-strong">{set.description}</p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-strong">
                    {attempts.length === 0
                      ? "Not attempted yet"
                      : `Best ${best}% · ${attempts.length} ${attempts.length === 1 ? "attempt" : "attempts"}`}
                  </p>
                  <Button
                    size="sm"
                    onClick={() => {
                      setRunKey((k) => k + 1);
                      setActiveMode(null);
                      setActiveSet(set);
                      window.scrollTo({ top: 0 });
                    }}
                  >
                    <Play /> {attempts.length === 0 ? "Start" : "Retake"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {modes.map((mode) => {
          const attempts = progress.quizResults.filter((r) => r.setId === modeSetId(mode, length));
          const best = attempts.length ? Math.max(...attempts.map((a) => a.scorePercent)) : null;
          return (
            <Card key={mode.id} className="flex flex-col transition-shadow hover:shadow-lift">
              <CardContent className="flex flex-1 flex-col pt-6">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge>{QUIZ_CATEGORY_LABELS[mode.category]}</Badge>
                  <Badge variant="outline">{length} questions</Badge>
                  <Badge variant="outline">New questions each time</Badge>
                </div>
                <h2 className="font-display text-xl font-semibold text-plum">{mode.title}</h2>
                <p className="mt-1.5 flex-1 text-sm text-muted-strong">{mode.description}</p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-strong">
                    {attempts.length === 0
                      ? "Not attempted yet"
                      : `Best ${best}% · ${attempts.length} ${attempts.length === 1 ? "attempt" : "attempts"}`}
                  </p>
                  <Button size="sm" onClick={() => startMode(mode, length)}>
                    <Play /> {attempts.length === 0 ? "Start" : "Retake"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section aria-labelledby="history-heading" className="mt-12">
        <h2 id="history-heading" className="mb-4 flex items-center gap-2 font-display text-xl font-semibold text-plum">
          <History className="size-5 text-rose-deep" aria-hidden="true" /> Quiz history
        </h2>
        {history.length === 0 ? (
          <EmptyState
            icon={ClipboardCheck}
            title="No tests completed yet"
            description="Finish a mini test and your result will be saved here, so you can see how you improve."
          />
        ) : (
          <ul className="space-y-3">
            {history.map((r) => {
              const questions = r.answers
                .map((a) => QUIZ_QUESTIONS_BY_ID.get(a.questionId))
                .filter((q): q is QuizQuestion => q !== undefined);
              return (
                <li key={r.id}>
                  <Card>
                    <details className="group">
                      <summary className="flex cursor-pointer list-none items-center gap-3 p-4 sm:p-5 [&::-webkit-details-marker]:hidden">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[15px] font-semibold text-plum">{r.title}</p>
                          <p className="text-xs text-muted-strong">
                            {new Date(r.takenAt).toLocaleString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            · {r.correct}/{r.total} correct
                          </p>
                        </div>
                        <Badge variant={scoreVariant(r.scorePercent)}>{r.scorePercent}%</Badge>
                        <ChevronDown className="size-4 text-muted-strong transition-transform group-open:rotate-180" aria-hidden="true" />
                        <span className="sr-only">Toggle review</span>
                      </summary>
                      <div className="border-t border-border-soft p-4 sm:p-5">
                        <QuizReview review={scoreQuiz(questions, r.answers).review} />
                      </div>
                    </details>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
