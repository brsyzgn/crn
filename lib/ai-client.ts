import type { ChatMessage } from "@/lib/ai";
import type { AiMode } from "@/types";

export type PracticeResult =
  | { ok: true; reply: string; context?: string }
  | { ok: false; status: number; error: string };

/** Calls our own server route. The OpenAI key never reaches the browser. */
export async function requestPractice(
  mode: AiMode,
  messages: ChatMessage[],
  signal?: AbortSignal,
  question?: string,
): Promise<PracticeResult> {
  try {
    const res = await fetch("/api/practice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode, messages, ...(question ? { question } : {}) }),
      signal,
    });
    const data = (await res.json().catch(() => null)) as {
      reply?: string;
      context?: string;
      error?: string;
    } | null;
    if (res.ok && data && typeof data.reply === "string") {
      return {
        ok: true,
        reply: data.reply,
        ...(typeof data.context === "string" ? { context: data.context } : {}),
      };
    }
    return {
      ok: false,
      status: res.status,
      error: data?.error ?? "AI feedback is temporarily unavailable. Please try again.",
    };
  } catch (err) {
    if ((err as { name?: string })?.name === "AbortError") {
      return { ok: false, status: 0, error: "Request cancelled." };
    }
    return {
      ok: false,
      status: 0,
      error: "Could not reach the server. Check your connection and try again.",
    };
  }
}
