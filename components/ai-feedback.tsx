"use client";

import { Sparkles, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { Spinner } from "@/components/loading-state";
import { Button } from "@/components/ui/button";
import { useAiStatus } from "@/hooks/use-ai-status";
import { useProgress } from "@/hooks/use-progress";
import { requestPractice } from "@/lib/ai-client";

interface AiFeedbackProps {
  question: string;
  answer: string;
}

/** Optional written AI feedback for an interview answer. Only active when the server has a key. */
export function AiFeedback({ question, answer }: AiFeedbackProps) {
  const status = useAiStatus();
  const { actions } = useProgress();
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const trimmed = answer.trim();
  const tooShort = trimmed.length < 15;

  async function run() {
    setLoading(true);
    setError(null);
    setReply(null);
    const result = await requestPractice("improve", [{ role: "user", content: trimmed }], undefined, question);
    setLoading(false);
    if (result.ok) {
      setReply(result.reply);
      actions.recordAiPractice("improve");
    } else {
      setError(result.error);
    }
  }

  if (status === "unavailable") {
    return (
      <p className="rounded-2xl border border-border-soft bg-white/70 px-4 py-3 text-sm text-muted-strong">
        <Sparkles className="mr-1.5 inline size-4 text-rose-deep" aria-hidden="true" />
        AI feedback is not available right now because no OpenAI key is configured. Everything else works as usual.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        size="sm"
        onClick={run}
        disabled={status === "loading" || loading || tooShort}
      >
        {loading ? <Spinner /> : <Sparkles />}
        {loading ? "Getting feedback…" : "Get AI feedback on my answer"}
      </Button>
      {tooShort && status === "available" && (
        <p className="text-xs text-muted-strong">Write at least a couple of sentences to get feedback.</p>
      )}
      <div aria-live="polite">
        {error && (
          <p role="alert" className="flex items-start gap-2 rounded-2xl bg-danger-soft px-4 py-3 text-sm text-danger">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}
        {reply && (
          <div className="rounded-2xl border border-blush/40 bg-rose-light px-4 py-3.5">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-rose-deep">AI feedback</p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-plum">{reply}</p>
          </div>
        )}
      </div>
    </div>
  );
}
