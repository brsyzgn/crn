"use client";

import { ArrowLeft, ArrowRight, CheckCircle2, ListChecks, PencilLine } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { PageHeader } from "@/components/page-header";
import { useToast } from "@/components/toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { INTERVIEW_QUESTIONS } from "@/data/interview";
import { useProgress } from "@/hooks/use-progress";
import { cn } from "@/lib/utils";
import { CategoryDropdown, StatusSegments, type CategoryValue, type StatusValue } from "./interview-filters";
import { InterviewQuestionCard } from "./interview-question-card";

export function InterviewView() {
  const { progress, hydrated, actions } = useProgress();
  const toast = useToast();

  const [category, setCategory] = useState<CategoryValue>("all");
  const [status, setStatus] = useState<StatusValue>("all");
  const [index, setIndex] = useState(0);
  /** In-progress edits that have not been saved yet, keyed by question id. */
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const list = useMemo(
    () =>
      INTERVIEW_QUESTIONS.filter((q) => {
        if (category !== "all" && q.category !== category) return false;
        const done = q.id in progress.practicedQuestions;
        if (status === "todo" && done) return false;
        if (status === "practiced" && !done) return false;
        return true;
      }),
    [category, status, progress.practicedQuestions],
  );

  /** Questions per category under the current status filter (shown next to each category in the picker). */
  const { categoryCounts, statusTotal } = useMemo(() => {
    const counts: Record<string, number> = {};
    let total = 0;
    for (const q of INTERVIEW_QUESTIONS) {
      const done = q.id in progress.practicedQuestions;
      if (status === "todo" && done) continue;
      if (status === "practiced" && !done) continue;
      counts[q.category] = (counts[q.category] ?? 0) + 1;
      total += 1;
    }
    return { categoryCounts: counts, statusTotal: total };
  }, [status, progress.practicedQuestions]);

  if (!hydrated) {
    return (
      <>
        <PageHeader title="Interview Practice" description="Realistic practice questions with model answers." />
        <LoadingState rows={2} label="Loading interview questions…" />
      </>
    );
  }

  const safeIndex = list.length === 0 ? 0 : Math.min(index, list.length - 1);
  const current = list[safeIndex];
  const practicedCount = INTERVIEW_QUESTIONS.filter((q) => q.id in progress.practicedQuestions).length;
  const savedCount = INTERVIEW_QUESTIONS.filter((q) => q.id in progress.interviewAnswers).length;

  const go = (delta: number) => {
    if (list.length === 0) return;
    setIndex((safeIndex + delta + list.length) % list.length);
  };

  const saved = current ? progress.interviewAnswers[current.id] : undefined;
  const savedText = saved?.text ?? "";
  const draft = current ? (drafts[current.id] ?? savedText) : "";

  const isDirty = (id: string) => id in drafts && drafts[id] !== (progress.interviewAnswers[id]?.text ?? "");

  return (
    <>
      <PageHeader
        eyebrow="Interview practice"
        title="Practice your interview answers"
        description="Realistic practice questions for cabin crew interviews. They are general examples, not questions from any specific airline."
      />

      <Card className="mb-6 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5">
        <div className="flex items-center gap-5">
          <div>
            <p className="font-display text-xl font-semibold leading-none text-plum">
              {practicedCount} <span className="text-sm font-medium text-muted-strong">/ {INTERVIEW_QUESTIONS.length} practiced</span>
            </p>
            <p className="mt-1 text-xs text-muted-strong">{savedCount} saved answer drafts</p>
          </div>
        </div>
        <Progress value={practicedCount} max={INTERVIEW_QUESTIONS.length} label="Interview questions practiced" className="h-2.5 w-full sm:flex-1" />
      </Card>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
        <CategoryDropdown
          value={category}
          onChange={(c) => {
            setCategory(c);
            setIndex(0);
          }}
          counts={categoryCounts}
          total={statusTotal}
        />
        <StatusSegments
          value={status}
          onChange={(s) => {
            setStatus(s);
            setIndex(0);
          }}
        />
        <p className="text-sm text-muted-strong sm:ml-auto" aria-live="polite">
          {list.length} {list.length === 1 ? "question" : "questions"}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section aria-label="Practice question">
          {!current ? (
            <EmptyState
              icon={ListChecks}
              title="No questions match these filters"
              description={
                status === "practiced"
                  ? "You have not practiced any question in this selection yet. Mark a question as practiced and it will appear here."
                  : status === "todo"
                    ? "You have practiced every question in this selection. Amazing work, Ceren!"
                    : "Try a different category."
              }
              action={
                <Button variant="outline" size="sm" onClick={() => { setStatus("all"); setCategory("all"); setIndex(0); }}>
                  Reset filters
                </Button>
              }
            />
          ) : (
            <>
              <InterviewQuestionCard
                key={current.id}
                question={current}
                position={safeIndex + 1}
                total={list.length}
                draft={draft}
                savedText={savedText}
                savedAt={saved?.updatedAt}
                practiced={current.id in progress.practicedQuestions}
                onDraftChange={(text) => setDrafts((d) => ({ ...d, [current.id]: text }))}
                onSave={() => {
                  actions.saveAnswer(current.id, draft);
                  setDrafts((d) => {
                    const next = { ...d };
                    delete next[current.id];
                    return next;
                  });
                  toast("Answer draft saved");
                }}
                onClear={() => {
                  actions.clearAnswer(current.id);
                  setDrafts((d) => {
                    const next = { ...d };
                    delete next[current.id];
                    return next;
                  });
                  toast("Saved answer deleted", "info");
                }}
                onTogglePracticed={() => {
                  const now = actions.togglePracticed(current.id);
                  toast(now ? "Marked as practiced" : "Practice mark removed", now ? "success" : "info");
                }}
              />
              <div className="mt-4 flex items-center justify-between gap-3">
                <Button variant="outline" onClick={() => go(-1)}>
                  <ArrowLeft /> Previous
                </Button>
                <span className="text-sm text-muted-strong" aria-live="polite">
                  {safeIndex + 1} / {list.length}
                </span>
                <Button onClick={() => go(1)}>
                  Next <ArrowRight />
                </Button>
              </div>
            </>
          )}
        </section>

        <section aria-label="Question list">
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-border-soft px-5 py-3.5">
              <h2 className="font-display text-base font-semibold text-plum">All questions</h2>
              <span className="text-xs text-muted-strong">{list.length} shown</span>
            </div>
            <ul className="max-h-[36rem] divide-y divide-border-soft overflow-y-auto">
              {list.map((q, i) => (
                <li key={q.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setIndex(i);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    aria-current={i === safeIndex ? "true" : undefined}
                    className={cn(
                      "flex min-h-14 w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-rose-light",
                      i === safeIndex && "bg-rose-light",
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium leading-snug text-plum">{q.question}</span>
                      <span className="mt-0.5 block text-xs text-muted-strong">{q.category}</span>
                    </span>
                    {isDirty(q.id) && (
                      <PencilLine className="size-4 shrink-0 text-rose-deep" aria-label="Unsaved changes" />
                    )}
                    {q.id in progress.interviewAnswers && !isDirty(q.id) && (
                      <PencilLine className="size-4 shrink-0 text-muted" aria-label="Has a saved answer" />
                    )}
                    {q.id in progress.practicedQuestions && (
                      <CheckCircle2 className="size-4 shrink-0 text-success" aria-label="Practiced" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      </div>
    </>
  );
}
