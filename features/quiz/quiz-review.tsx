import { CheckCircle2, XCircle } from "lucide-react";
import type { ScoredAnswer } from "@/lib/quiz";
import { cn } from "@/lib/utils";
import { QuestionExtrasList } from "./question-extras";

const LETTERS = ["A", "B", "C", "D"] as const;

/** Question-by-question review with correct and incorrect answers. */
export function QuizReview({ review }: { review: ScoredAnswer[] }) {
  return (
    <ol className="space-y-4">
      {review.map(({ question, selectedIndex, isCorrect }, i) => (
        <li
          key={question.id}
          className={cn(
            "rounded-3xl border p-4 sm:p-5",
            isCorrect ? "border-success/30 bg-success-soft/50" : "border-danger/25 bg-danger-soft/50",
          )}
        >
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
            ) : (
              <XCircle className="mt-0.5 size-5 shrink-0 text-danger" aria-hidden="true" />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-muted-strong">
                Question {i + 1} · {isCorrect ? "Correct" : selectedIndex === null ? "Not answered" : "Incorrect"}
              </p>
              {question.passageTitle && (
                <p className="mt-1 text-xs text-muted-strong">From the passage “{question.passageTitle}”</p>
              )}
              <p className="mt-1 break-words text-[15px] font-medium leading-snug text-plum">{question.prompt}</p>
              <dl className="mt-3 space-y-1.5 text-sm">
                {!isCorrect && (
                  <div className="flex gap-2">
                    <dt className="shrink-0 font-semibold text-danger">Your answer:</dt>
                    <dd className="text-plum">
                      {selectedIndex === null
                        ? "—"
                        : `${LETTERS[selectedIndex]}. ${question.choices[selectedIndex]}`}
                    </dd>
                  </div>
                )}
                <div className="flex gap-2">
                  <dt className="shrink-0 font-semibold text-success">Correct answer:</dt>
                  <dd className="text-plum">
                    {LETTERS[question.answerIndex]}. {question.choices[question.answerIndex]}
                  </dd>
                </div>
              </dl>
              <p className="mt-3 text-sm leading-relaxed text-plum-soft">{question.explanation}</p>
              <QuestionExtrasList extras={question.extras} />
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
