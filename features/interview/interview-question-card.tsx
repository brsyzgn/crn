"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  Lightbulb,
  Save,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { AiFeedback } from "@/components/ai-feedback";
import { SpeakButton } from "@/components/speak-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { AnswerFramework, InterviewQuestion } from "@/types";

const FRAMEWORK_STEPS: Record<Exclude<AnswerFramework, "NONE">, { label: string; steps: [string, string][] }> = {
  STAR: {
    label: "STAR method",
    steps: [
      ["Situation", "Set the scene briefly."],
      ["Task", "What did you need to achieve?"],
      ["Action", "What did YOU do? Be specific."],
      ["Result", "What happened, and what did you learn?"],
    ],
  },
  "SITUATION-ACTION-RESULT": {
    label: "Situation – Action – Result",
    steps: [
      ["Situation", "Give one short, real example."],
      ["Action", "Say what you did."],
      ["Result", "Finish with the outcome."],
    ],
  },
  "OPINION-REASON-EXAMPLE": {
    label: "Opinion – Reason – Example",
    steps: [
      ["Opinion", "Give your answer clearly."],
      ["Reason", "Explain why you think so."],
      ["Example", "Add a short example, then conclude."],
    ],
  },
};

export const ANSWER_MAX_CHARS = 2000;

interface InterviewQuestionCardProps {
  question: InterviewQuestion;
  position: number;
  total: number;
  /** Current text in the editor (may be unsaved). */
  draft: string;
  savedText: string;
  savedAt?: string;
  practiced: boolean;
  onDraftChange: (text: string) => void;
  onSave: () => void;
  onClear: () => void;
  onTogglePracticed: () => void;
}

export function InterviewQuestionCard({
  question,
  position,
  total,
  draft,
  savedText,
  savedAt,
  practiced,
  onDraftChange,
  onSave,
  onClear,
  onTogglePracticed,
}: InterviewQuestionCardProps) {
  const [showSample, setShowSample] = useState(false);
  const [answerLevel, setAnswerLevel] = useState<"b1" | "b2">(
    question.difficulty === "B1" || question.difficulty === "B1+" ? "b1" : "b2",
  );
  const sample = answerLevel === "b1" ? question.sampleAnswer : question.sampleAnswerB2;
  const framework = question.framework === "NONE" ? null : FRAMEWORK_STEPS[question.framework];
  const dirty = draft !== savedText;
  const fieldId = `answer-${question.id}`;

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-border-soft bg-linear-to-br from-rose-light to-white p-5 sm:p-7">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted-strong">
            Question {position} of {total}
          </span>
          <Badge>{question.category}</Badge>
          <Badge variant="outline">{question.difficulty}</Badge>
          {practiced && (
            <Badge variant="success">
              <CheckCircle2 className="size-3" aria-hidden="true" /> Practiced
            </Badge>
          )}
        </div>
        <div className="flex items-start gap-3">
          <h2 className="flex-1 font-display text-2xl font-semibold leading-snug tracking-tight text-plum sm:text-[1.75rem]">
            {question.question}
          </h2>
          <SpeakButton text={question.question} label="Listen to the question" />
        </div>
        <details className="mt-4 group">
          <summary className="cursor-pointer text-sm font-semibold text-rose-deep marker:text-rose-deep">
            Türkçe açıklama
          </summary>
          <p className="mt-2 text-sm leading-relaxed text-plum">{question.turkish}</p>
          {question.turkishNote && <p className="mt-2 text-sm leading-relaxed text-plum-soft">{question.turkishNote}</p>}
        </details>
      </div>

      <div className="space-y-6 p-5 sm:p-7">
        {/* Writing area */}
        <div>
          <label htmlFor={fieldId} className="mb-2 block text-sm font-semibold text-plum">
            Your answer
          </label>
          <Textarea
            id={fieldId}
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            maxLength={ANSWER_MAX_CHARS}
            rows={6}
            placeholder="Write your answer in English. Try to use 3–5 clear sentences."
          />
          <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
            <Button size="sm" onClick={onSave} disabled={!dirty || draft.trim() === ""}>
              <Save /> Save draft
            </Button>
            {savedText !== "" && (
              <Button size="sm" variant="ghost" onClick={onClear}>
                <Trash2 /> Delete saved answer
              </Button>
            )}
            <span
              aria-live="polite"
              className={cn("ml-auto text-xs", dirty ? "font-semibold text-rose-deep" : "text-muted-strong")}
            >
              {dirty
                ? "Unsaved changes"
                : savedAt
                  ? `Saved ${new Date(savedAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}`
                  : `${draft.length}/${ANSWER_MAX_CHARS}`}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2.5">
          <Button variant="soft" onClick={() => setShowSample((v) => !v)} aria-expanded={showSample}>
            {showSample ? <EyeOff /> : <Eye />}
            {showSample ? "Hide sample answer" : "Show sample answer"}
          </Button>
          <Button variant={practiced ? "soft" : "dark"} onClick={onTogglePracticed} aria-pressed={practiced}>
            <CheckCircle2 /> {practiced ? "Practiced — tap to undo" : "Mark as practiced"}
          </Button>
        </div>

        {showSample && (
          <section aria-label="Sample answer" className="space-y-5 rounded-3xl border border-border-soft bg-white p-5">
            <div className="rounded-2xl bg-rose-light/60 p-4 text-sm leading-relaxed text-plum">
              <p>
                <span className="font-semibold text-rose-deep">Why interviewers ask this: </span>
                {question.why}
              </p>
              <p className="mt-1.5 text-xs text-muted-strong">Competency: {question.competency}</p>
              <h3 className="mb-1 mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-rose-deep">Include in your answer</h3>
              <ul className="list-disc space-y-1 pl-5 marker:text-rose-deep">
                {question.keyPoints.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>

            {framework && (
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-rose-deep">{framework.label}</h3>
                <ol className="grid gap-2 sm:grid-cols-2">
                  {framework.steps.map(([name, hint]) => (
                    <li key={name} className="rounded-2xl border border-border-soft bg-white px-4 py-3 text-sm leading-snug text-plum">
                      <span className="font-semibold">{name}: </span>
                      {hint}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-rose-deep">Sample answer</h3>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1" role="group" aria-label="Answer level">
                    {(
                      [
                        ["b1", "B1 / B1+"],
                        ["b2", "B2"],
                      ] as const
                    ).map(([id, label]) => (
                      <Button
                        key={id}
                        size="sm"
                        variant={answerLevel === id ? "soft" : "outline"}
                        aria-pressed={answerLevel === id}
                        onClick={() => setAnswerLevel(id)}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                  <SpeakButton text={sample} label="Listen to the sample answer" />
                </div>
              </div>
              <p className="text-[15px] leading-relaxed text-plum">{sample}</p>
              <p className="mt-3 text-xs text-muted-strong">
                A model answer for practice only. This is a representative practice question, not one reported by any airline or candidate. Use your own real experience in the interview.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-rose-deep">Useful vocabulary</h3>
                <p className="flex flex-wrap gap-1.5">
                  {question.vocabulary.map((v) => (
                    <Badge key={v} variant="outline">
                      {v}
                    </Badge>
                  ))}
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-rose-deep">Useful phrases</h3>
                <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-plum marker:text-rose-deep">
                  {question.phrases.map((v) => (
                    <li key={v}>{v}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-success-soft/70 p-4">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-success">
                  <Lightbulb className="size-4" aria-hidden="true" /> Answering tips
                </h3>
                <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-plum marker:text-success">
                  {question.tips.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-danger-soft/70 p-4">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-danger">
                  <AlertTriangle className="size-4" aria-hidden="true" /> Common mistakes
                </h3>
                <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-plum marker:text-danger">
                  {question.commonMistakes.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-rose-deep">
                Possible follow-up questions
              </h3>
              <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-plum marker:text-rose-deep">
                {question.followUps.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <AiFeedback question={question.question} answer={draft} />
      </div>
    </Card>
  );
}
