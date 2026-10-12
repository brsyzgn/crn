"use client";

import Link from "next/link";
import { ClipboardCheck, Mic, RotateCcw, Send, Sparkles, TriangleAlert, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "@/components/loading-state";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { useAiStatus } from "@/hooks/use-ai-status";
import { useProgress } from "@/hooks/use-progress";
import { AI_LIMITS, AI_MODE_INFO, AI_MODES, type ChatMessage } from "@/lib/ai";
import { requestPractice } from "@/lib/ai-client";
import { cn } from "@/lib/utils";
import type { AiMode } from "@/types";

const INPUT_MAX = 1500;

/** A chat turn as shown in the UI. `context` is the compact text sent back to the server as history. */
interface Turn extends ChatMessage {
  context?: string;
  /** Fixed "please start" turns are never sent again as history. */
  skipHistory?: boolean;
}

/** Number of recent turns sent for context (the rest is dropped to save tokens). */
const HISTORY_TURNS = 7;

/**
 * Builds the history sent to the server: only the last few turns, with the tutor's long feedback
 * replaced by its compact context (e.g. just the last question).
 */
function trimHistory(turns: Turn[]): ChatMessage[] {
  const compact: ChatMessage[] = turns
    .filter((t) => !t.skipHistory)
    .map((t) =>
      t.role === "assistant"
        ? { role: "assistant" as const, content: (t.context ?? t.content).slice(0, AI_LIMITS.maxAssistantChars) }
        : { role: "user" as const, content: t.content },
    );
  const picked: ChatMessage[] = [];
  let total = 0;
  for (let i = compact.length - 1; i >= 0; i--) {
    const m = compact[i];
    if (picked.length >= Math.min(HISTORY_TURNS, AI_LIMITS.maxMessages) || total + m.content.length > AI_LIMITS.maxTotalChars) break;
    picked.unshift(m);
    total += m.content.length;
  }
  return picked;
}

function Unavailable() {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col items-center px-6 py-12 text-center sm:py-16">
        <span className="mb-5 grid size-16 place-items-center rounded-3xl bg-rose text-rose-deep">
          <Sparkles className="size-7" aria-hidden="true" />
        </span>
        <h2 className="font-display text-2xl font-semibold text-plum">AI practice isn’t switched on yet</h2>
        <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted-strong">
          This feature needs an OpenAI API key on the server, and none has been set up. Nothing is wrong with your
          account or device. Everything else in the club works as usual.
        </p>
        <p className="mt-3 max-w-md text-sm text-muted-strong">
          Whoever runs this site can enable it by adding <code className="rounded bg-rose-light px-1.5 py-0.5">OPENAI_API_KEY</code>{" "}
          to the environment (see the README).
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-2.5">
          <Button asChild>
            <Link href="/interview">
              <Mic /> Practice interview questions
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/tests">
              <ClipboardCheck /> Take a mini test
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function PracticeView() {
  const status = useAiStatus();
  const { actions } = useProgress();

  const [mode, setMode] = useState<AiMode>("interview");
  const [messages, setMessages] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  /** Synchronous guard so a fast double-click can never send two requests. */
  const sendingRef = useRef(false);

  const info = AI_MODE_INFO[mode];
  const isConversational = mode === "interview" || mode === "conversation";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages, loading]);

  useEffect(() => () => abortRef.current?.abort(), []);

  function reset(nextMode: AiMode = mode) {
    abortRef.current?.abort();
    sendingRef.current = false;
    setMode(nextMode);
    setMessages([]);
    setInput("");
    setError(null);
    setLoading(false);
  }

  async function send(text: string, display?: string) {
    const content = text.trim();
    if (!content || loading || sendingRef.current) return;
    sendingRef.current = true;

    const isStarter = display !== undefined;
    const userMessage: ChatMessage = { role: "user", content };
    const previous = messages;
    const nextThread: Turn[] = [...messages, { role: "user", content: display ?? content, skipHistory: isStarter }];
    // What we send: a few recent turns for chats, only the latest text for one-shot modes.
    const payload = isStarter ? [userMessage] : isConversational ? trimHistory([...messages, userMessage]) : [userMessage];

    setMessages(nextThread);
    setInput("");
    setError(null);
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;
    const result = await requestPractice(mode, payload, controller.signal);
    if (controller.signal.aborted) return;
    sendingRef.current = false;
    setLoading(false);

    if (result.ok) {
      setMessages((m) => [...m, { role: "assistant", content: result.reply, context: result.context }]);
      actions.recordAiPractice(mode);
    } else {
      // Nothing is invented on failure: show the error and give the learner's text back to retry.
      setMessages(previous);
      if (!isStarter) setInput(content);
      setError(result.error);
    }
  }

  if (status === "loading") {
    return (
      <>
        <PageHeader title="AI English Practice" description="Chat with an AI tutor and improve your English." />
        <div role="status" className="flex items-center gap-3 rounded-3xl border border-border-soft bg-white/70 p-6 text-sm text-muted-strong">
          <Spinner className="text-rose-deep" /> Checking whether AI practice is available…
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="AI practice"
        title="AI English Practice"
        description="Practise writing in English and get short, friendly corrections adapted to B1–B2 level."
      />

      {status === "unavailable" ? (
        <Unavailable />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[17rem_1fr]">
          {/* Mode picker */}
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-plum">Practice mode</legend>
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
              {AI_MODES.map((m) => (
                <div key={m}>
                  <input
                    id={`mode-${m}`}
                    type="radio"
                    name="mode"
                    checked={mode === m}
                    onChange={() => reset(m)}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor={`mode-${m}`}
                    className="block h-full cursor-pointer rounded-2xl border border-border-soft bg-white p-4 transition-colors hover:border-blush peer-checked:border-blush peer-checked:bg-rose peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-rose-deep"
                  >
                    <span className="block text-sm font-semibold text-plum">{AI_MODE_INFO[m].label}</span>
                    <span className="mt-1 block text-xs leading-snug text-muted-strong">{AI_MODE_INFO[m].description}</span>
                  </label>
                </div>
              ))}
            </div>
          </fieldset>

          {/* Chat */}
          <Card className="flex min-h-[28rem] flex-col overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-border-soft px-5 py-3.5">
              <div className="min-w-0">
                <h2 className="truncate font-display text-base font-semibold text-plum">{info.label}</h2>
                <p className="text-xs text-muted-strong">Conversations are not saved.</p>
              </div>
              {messages.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => reset()}>
                  <RotateCcw /> New
                </Button>
              )}
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5" aria-live="polite" aria-label="Conversation">
              {messages.length === 0 && !loading && (
                <div className="flex h-full min-h-48 flex-col items-center justify-center text-center">
                  <p className="max-w-sm text-sm leading-relaxed text-muted-strong">{info.description}</p>
                  {info.starter && (
                    <Button
                      className="mt-5"
                      onClick={() =>
                        send(info.starter!, mode === "interview" ? "Please start the mock interview." : "Let’s start the conversation.")
                      }
                    >
                      <Sparkles /> {mode === "interview" ? "Start interview" : "Start conversation"}
                    </Button>
                  )}
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={cn("flex gap-2.5", m.role === "user" && "flex-row-reverse")}>
                  <span
                    className={cn(
                      "mt-1 grid size-8 shrink-0 place-items-center rounded-full",
                      m.role === "user" ? "bg-plum text-white" : "bg-rose text-rose-deep",
                    )}
                    aria-hidden="true"
                  >
                    {m.role === "user" ? <User className="size-4" /> : <Sparkles className="size-4" />}
                  </span>
                  <div
                    className={cn(
                      "max-w-[85%] whitespace-pre-wrap rounded-3xl px-4 py-3 text-[15px] leading-relaxed",
                      m.role === "user"
                        ? "rounded-tr-lg bg-blush text-plum"
                        : "rounded-tl-lg border border-border-soft bg-white text-plum",
                    )}
                  >
                    <span className="sr-only">{m.role === "user" ? "You: " : "Tutor: "}</span>
                    {m.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2.5 text-sm text-muted-strong" role="status">
                  <span className="grid size-8 place-items-center rounded-full bg-rose text-rose-deep">
                    <Spinner />
                  </span>
                  Your tutor is writing…
                </div>
              )}

              {error && (
                <p role="alert" className="flex items-start gap-2 rounded-2xl bg-danger-soft px-4 py-3 text-sm text-danger">
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  {error}
                </p>
              )}
              <div ref={bottomRef} />
            </div>

            <form
              className="border-t border-border-soft bg-white/80 p-3 sm:p-4"
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
            >
              <label htmlFor="practice-input" className="sr-only">
                Your message
              </label>
              <div className="flex items-end gap-2.5">
                <Textarea
                  id="practice-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      void send(input);
                    }
                  }}
                  maxLength={INPUT_MAX}
                  rows={2}
                  placeholder={info.placeholder}
                  className="min-h-14 flex-1 resize-none"
                  disabled={loading}
                />
                <Button type="submit" size="icon" disabled={loading || input.trim() === ""} aria-label="Send message" className="size-14">
                  {loading ? <Spinner /> : <Send />}
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-strong">
                {input.length}/{INPUT_MAX} · Press Ctrl/⌘ + Enter to send. Your text is sent to an AI service to generate feedback.
              </p>
            </form>
          </Card>
        </div>
      )}
    </>
  );
}
