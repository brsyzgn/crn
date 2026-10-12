"use client";

import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, Trophy, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { ProgressRing } from "@/components/progress-ring";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { QUIZ_QUESTIONS_BY_ID } from "@/data/quiz";
import { buildQuizResult, scoreMessage, scoreQuiz } from "@/lib/quiz";
import { cn } from "@/lib/utils";
import type { QuizAnswerRecord, QuizQuestion, QuizResult, QuizSet } from "@/types";
import { QuestionExtrasList } from "./question-extras";
import { QuizReview } from "./quiz-review";

const LETTERS = ["A", "B", "C", "D"] as const;

interface QuizEngineProps {
  set: QuizSet;
  /** Called exactly once, when the user finishes the quiz. */
  onFinish: (result: QuizResult) => void;
  onExit: () => void;
  /** Called when the user chooses to retake. The parent should remount the engine. */
  onRetake: () => void;
  /** Optional: called once for each question the first time it is answered. */
  onAnswered?: (questionId: string) => void;
  /** Optional button wording (Practice uses its own labels). */
  labels?: { retake?: string; exit?: string };
}

export function QuizEngine({ set, onFinish, onExit, onRetake, onAnswered, labels }: QuizEngineProps) {
  const questions = useMemo(
    () => set.questionIds.map((id) => QUIZ_QUESTIONS_BY_ID.get(id)).filter((q): q is QuizQuestion => q !== undefined),
    [set],
  );

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);

  const answerRecords = (): QuizAnswerRecord[] =>
    questions.map((q) => ({ questionId: q.id, selectedIndex: answers[q.id] ?? null }));

  if (finished) {
    const score = scoreQuiz(questions, answerRecords());
    return (
      <div className="space-y-6">
        <Card className="overflow-hidden">
          <div className="flex flex-col items-center gap-5 bg-linear-to-br from-rose-light to-white p-7 text-center sm:flex-row sm:text-left">
            <ProgressRing
              value={score.scorePercent}
              max={100}
              size={112}
              strokeWidth={11}
              label={`Score: ${score.scorePercent} percent`}
            >
              <span className="text-2xl">{score.scorePercent}%</span>
            </ProgressRing>
            <div className="flex-1">
              <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-rose-deep sm:justify-start">
                <Trophy className="size-4" aria-hidden="true" /> {set.title}
              </p>
              <h2 className="mt-1 font-display text-3xl font-semibold text-plum">
                {score.correct} of {score.total} correct
              </h2>
              <p className="mt-1 text-sm text-muted-strong">{scoreMessage(score.scorePercent)}</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                <Badge variant="success">
                  <CheckCircle2 className="size-3" aria-hidden="true" /> {score.correct} correct
                </Badge>
                <Badge variant="danger">
                  <XCircle className="size-3" aria-hidden="true" /> {score.incorrect} incorrect
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5 p-5">
            <Button onClick={onRetake}>
              <RotateCcw /> {labels?.retake ?? "Retake test"}
            </Button>
            <Button variant="outline" onClick={onExit}>
              {labels?.exit ?? "Back to all tests"}
            </Button>
          </div>
        </Card>

        <section aria-labelledby="review-heading">
          <h2 id="review-heading" className="mb-3 font-display text-xl font-semibold text-plum">
            Review your answers
          </h2>
          <QuizReview review={score.review} />
        </section>
      </div>
    );
  }

  const question = questions[index];
  if (!question) {
    return null;
  }
  const selected = answers[question.id];
  const answered = selected !== undefined;
  const isLast = index === questions.length - 1;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  const choose = (choiceIndex: number) => {
    if (answered) return; // answers are locked once chosen so scoring is unambiguous
    setAnswers((a) => ({ ...a, [question.id]: choiceIndex }));
    onAnswered?.(question.id);
  };

  const finish = () => {
    const result = buildQuizResult(set, questions, answerRecords(), new Date());
    onFinish(result);
    setFinished(true);
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate font-display text-xl font-semibold text-plum">{set.title}</h2>
          <p className="text-sm text-muted-strong" aria-live="polite">
            Question {index + 1} of {questions.length}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onExit}>
          Exit
        </Button>
      </div>

      <Progress value={answeredCount} max={questions.length} label="Questions answered" className="mb-5 h-2.5" />

      {/* Question dots */}
      <ol className="mb-5 flex flex-wrap gap-1.5" aria-label="Question navigation">
        {questions.map((q, i) => {
          const a = answers[q.id];
          const reachable = a !== undefined || i === answeredCount;
          return (
            <li key={q.id}>
              <button
                type="button"
                disabled={!reachable}
                onClick={() => setIndex(i)}
                aria-label={`Question ${i + 1}${a === undefined ? "" : a === q.answerIndex ? ", correct" : ", incorrect"}`}
                aria-current={i === index ? "step" : undefined}
                className={cn(
                  "grid size-9 place-items-center rounded-full border text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                  i === index && "ring-2 ring-rose-deep ring-offset-2 ring-offset-cream",
                  a === undefined
                    ? "border-border-soft bg-white text-muted-strong"
                    : a === q.answerIndex
                      ? "border-success/40 bg-success-soft text-success"
                      : "border-danger/40 bg-danger-soft text-danger",
                )}
              >
                {i + 1}
              </button>
            </li>
          );
        })}
      </ol>

      <Card className="p-5 sm:p-7">
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge variant="outline">{question.difficulty}</Badge>
          <Badge variant="outline">{question.topic}</Badge>
        </div>

        {question.passage && (
          <figure className="mb-5">
            {question.passageTitle && (
              <figcaption className="mb-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-rose-deep">
                {question.passageTitle}
              </figcaption>
            )}
            <blockquote className="whitespace-pre-line break-words rounded-2xl border-l-4 border-blush bg-rose-light px-4 py-3.5 text-[15px] leading-relaxed text-plum">
              {question.passage}
            </blockquote>
          </figure>
        )}

        <h3 className="break-words font-display text-xl font-semibold leading-snug text-plum sm:text-2xl">{question.prompt}</h3>

        <ul className="mt-5 space-y-2.5">
          {question.choices.map((choice, i) => {
            const isSelected = selected === i;
            const isCorrect = i === question.answerIndex;
            const showCorrect = answered && isCorrect;
            const showWrong = answered && isSelected && !isCorrect;
            return (
              <li key={choice}>
                <button
                  type="button"
                  onClick={() => choose(i)}
                  disabled={answered && !isSelected && !isCorrect}
                  aria-pressed={isSelected}
                  className={cn(
                    "flex min-h-14 w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-[15px] transition-colors",
                    !answered && "border-border-soft bg-white hover:border-blush hover:bg-rose-light",
                    showCorrect && "border-success bg-success-soft",
                    showWrong && "border-danger bg-danger-soft",
                    answered && !showCorrect && !showWrong && "border-border-soft bg-white opacity-60",
                    answered && "cursor-default",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-full text-sm font-semibold",
                      showCorrect ? "bg-success text-white" : showWrong ? "bg-danger text-white" : "bg-rose text-plum",
                    )}
                    aria-hidden="true"
                  >
                    {LETTERS[i]}
                  </span>
                  <span className="min-w-0 flex-1 break-words font-medium text-plum">{choice}</span>
                  {showCorrect && (
                    <>
                      <CheckCircle2 className="size-5 shrink-0 text-success" aria-hidden="true" />
                      <span className="sr-only">Correct answer</span>
                    </>
                  )}
                  {showWrong && (
                    <>
                      <XCircle className="size-5 shrink-0 text-danger" aria-hidden="true" />
                      <span className="sr-only">Your answer, incorrect</span>
                    </>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <div aria-live="polite">
          {answered && (
            <div
              className={cn(
                "mt-5 rounded-2xl px-4 py-3.5 text-sm leading-relaxed",
                selected === question.answerIndex ? "bg-success-soft text-plum" : "bg-danger-soft text-plum",
              )}
            >
              <p className={cn("mb-1 font-semibold", selected === question.answerIndex ? "text-success" : "text-danger")}>
                {selected === question.answerIndex ? "Correct!" : "Not quite."}
              </p>
              {question.explanation}
              <QuestionExtrasList extras={question.extras} />
            </div>
          )}
        </div>
      </Card>

      <div className="mt-5 flex items-center justify-between gap-3">
        <Button variant="outline" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0}>
          <ArrowLeft /> Previous
        </Button>
        {isLast ? (
          <Button onClick={finish} disabled={!allAnswered}>
            See results <Trophy />
          </Button>
        ) : (
          <Button onClick={() => setIndex((i) => i + 1)} disabled={!answered}>
            Next <ArrowRight />
          </Button>
        )}
      </div>
      {!answered && <p className="mt-3 text-center text-xs text-muted-strong">Choose an answer to continue.</p>}
      {isLast && answered && !allAnswered && (
        <p className="mt-3 text-center text-xs text-muted-strong">Answer every question to see your results.</p>
      )}
    </div>
  );
}
