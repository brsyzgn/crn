import { AI_LIMITS } from "@/lib/ai";
import { validatePracticeRequest } from "@/lib/ai-validate";
import { AiError, isAiConfigured, runPractice } from "@/lib/ai-server";
import { createRateLimiter } from "@/lib/rate-limit";

/**
 * AI practice endpoint (the only route that talks to OpenAI).
 * - The OpenAI key and model come from process.env on the server only.
 * - The client can send just: mode, messages (recent turns) and an optional interview question.
 *   Model, system instructions and all OpenAI parameters are server-controlled.
 * - Requests are validated, size-limited and abuse-protected. There is no visible daily limit; the
 *   limits below only stop accidental loops and scripted abuse, not normal practice.
 * - Conversation content and errors from the provider are never logged or returned.
 */

export const maxDuration = 60;

// Generous for a single learner (a request every ~5 s) but stops loops/scripts.
const perMinute = createRateLimiter({ windowMs: 60_000, max: 12 });
const perHour = createRateLimiter({ windowMs: 60 * 60_000, max: 200 });

// At most 2 simultaneous requests per client (2 so "New" right after a cancel never gets blocked).
const MAX_IN_FLIGHT = 2;
const inFlight = new Map<string, number>();

const NO_STORE = { "Cache-Control": "no-store" } as const;

function json(body: unknown, status = 200, extra: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { ...NO_STORE, ...extra } });
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

/** Lets the UI know whether AI practice is configured, without revealing the key. */
export async function GET() {
  return json({ available: isAiConfigured() });
}

export async function POST(request: Request) {
  if (!isAiConfigured()) {
    return json(
      { error: "AI practice is not available because no OpenAI API key has been configured." },
      503,
    );
  }

  // Reject oversized bodies early (declared length), then enforce on the actual text.
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > AI_LIMITS.maxBodyBytes) {
    return json({ error: "That request is too large." }, 413);
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
  if (raw.length > AI_LIMITS.maxBodyBytes) {
    return json({ error: "That request is too large." }, 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  // Validate before touching the rate limiter or OpenAI, so bad input never costs anything.
  const parsed = validatePracticeRequest(body);
  if (!parsed.ok) return json({ error: parsed.error }, parsed.status);

  const key = clientKey(request);
  const minute = perMinute(key);
  const hour = minute.allowed ? perHour(key) : { allowed: true, retryAfterSec: 0 };
  if (!minute.allowed || !hour.allowed) {
    const retry = Math.max(minute.retryAfterSec, hour.retryAfterSec);
    return json(
      { error: "You're going a little fast. Please wait a moment and try again." },
      429,
      { "Retry-After": String(retry) },
    );
  }

  if ((inFlight.get(key) ?? 0) >= MAX_IN_FLIGHT) {
    return json({ error: "Your previous message is still being answered. Please wait a moment." }, 429, {
      "Retry-After": "5",
    });
  }
  inFlight.set(key, (inFlight.get(key) ?? 0) + 1);

  try {
    const result = await runPractice(parsed.value, request.signal);
    return json(result);
  } catch (err) {
    const e = err instanceof AiError ? err : new AiError("AI feedback is temporarily unavailable. Please try again.", 502);
    return json({ error: e.message }, e.status === 499 ? 400 : e.status);
  } finally {
    const left = (inFlight.get(key) ?? 1) - 1;
    if (left <= 0) inFlight.delete(key);
    else inFlight.set(key, left);
  }
}
