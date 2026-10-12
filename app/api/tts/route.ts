import { createRateLimiter } from "@/lib/rate-limit";
import { isTtsConfigured, synthesizeSpeech, TtsError, TTS_MAX_CHARS, type TtsAccent } from "@/lib/tts-server";

/**
 * Pronunciation audio endpoint (OpenAI text-to-speech).
 * - GET /api/tts                      -> { available } (never reveals the key)
 * - GET /api/tts?text=...&lang=en-US  -> audio/mpeg
 * GET (not POST) lets an <audio> element play it inside the user's tap, which mobile Safari
 * requires, and lets the browser cache each clip forever. Clips are also cached on the server.
 */

export const maxDuration = 30;

// Cached clips cost nothing, but new clips are billable, so keep generous-but-finite limits.
const perMinute = createRateLimiter({ windowMs: 60_000, max: 120 });
const perHour = createRateLimiter({ windowMs: 60 * 60_000, max: 1500 });

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

function json(body: unknown, status = 200, extra: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...extra } });
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const rawText = params.get("text");

  if (rawText === null) return json({ available: isTtsConfigured() });

  if (!isTtsConfigured()) return json({ error: "Speech audio is not configured." }, 503);

  const text = rawText.replace(/\s+/g, " ").trim();
  if (!text || text.length > TTS_MAX_CHARS) return json({ error: "Invalid text." }, 400);
  const lang = params.get("lang");
  const accent: TtsAccent = lang === "en-GB" ? "en-GB" : "en-US";

  // Browser revalidation of an already-cached clip.
  const etag = request.headers.get("if-none-match");

  const key = clientKey(request);
  const minute = perMinute(key);
  const hour = minute.allowed ? perHour(key) : { allowed: true, retryAfterSec: 0 };
  if (!minute.allowed || !hour.allowed) {
    const retry = Math.max(minute.retryAfterSec, hour.retryAfterSec);
    return json({ error: "Too many requests." }, 429, { "Retry-After": String(retry) });
  }

  try {
    const { audio, etag: tag } = await synthesizeSpeech(text, accent);
    if (etag === tag) return new Response(null, { status: 304, headers: { ETag: tag } });
    return new Response(new Uint8Array(audio), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(audio.byteLength),
        "Cache-Control": "public, max-age=31536000, immutable",
        ETag: tag,
      },
    });
  } catch (err) {
    const e = err instanceof TtsError ? err : new TtsError("Speech audio is temporarily unavailable.", 502);
    return json({ error: e.message }, e.status);
  }
}
