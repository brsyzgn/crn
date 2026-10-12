import "server-only";

import { createHash } from "node:crypto";
import OpenAI from "openai";

/**
 * Server-only OpenAI text-to-speech. The API key never leaves the server.
 *
 * Defaults: model `tts-1` (low latency), voice `nova` (female). Override with the optional
 * OPENAI_TTS_MODEL / OPENAI_TTS_VOICE environment variables. A voice preset name does not
 * guarantee a gender, so the voice must be chosen by listening (see README "Pronunciation audio").
 *
 * Cost control: generated MP3s are cached in memory (per server instance) and the route sends
 * long-lived Cache-Control headers so browsers never re-request the same word.
 */

export type TtsAccent = "en-US" | "en-GB";

export const TTS_MAX_CHARS = 600;

// tts-1 is OpenAI's low-latency model (clips start in well under a second for single words);
// "nova" is a consistently female voice. Both can be overridden through the environment.
const DEFAULT_MODEL = "tts-1";
const DEFAULT_VOICE = "nova";
const REQUEST_TIMEOUT_MS = 20_000;

const ACCENT_STYLE: Record<TtsAccent, string> = {
  "en-US": "a clear, natural American English accent",
  "en-GB": "a clear, natural British English (Received Pronunciation) accent",
};

export function isTtsConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export class TtsError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "TtsError";
  }
}

// --- In-memory cache (bounded by total bytes, least-recently-used eviction) ---
const CACHE_MAX_BYTES = 32 * 1024 * 1024;
const cache = new Map<string, Buffer>();
let cacheBytes = 0;

function cacheGet(key: string): Buffer | undefined {
  const hit = cache.get(key);
  if (hit) {
    cache.delete(key);
    cache.set(key, hit);
  }
  return hit;
}

function cacheSet(key: string, value: Buffer) {
  cache.set(key, value);
  cacheBytes += value.byteLength;
  for (const [k, v] of cache) {
    if (cacheBytes <= CACHE_MAX_BYTES) break;
    cache.delete(k);
    cacheBytes -= v.byteLength;
  }
}

// Concurrent requests for the same clip share one provider call.
const pending = new Map<string, Promise<Buffer>>();

function modelAndVoice() {
  const model = process.env.OPENAI_TTS_MODEL?.trim() || DEFAULT_MODEL;
  const voice = process.env.OPENAI_TTS_VOICE?.trim() || DEFAULT_VOICE;
  return { model, voice };
}

export function ttsCacheKey(text: string, accent: TtsAccent): string {
  const { model, voice } = modelAndVoice();
  return createHash("sha256").update(`${model}|${voice}|${accent}|${text}`).digest("hex");
}

export async function synthesizeSpeech(text: string, accent: TtsAccent): Promise<{ audio: Buffer; etag: string }> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) throw new TtsError("Speech audio is not configured.", 503);

  const key = ttsCacheKey(text, accent);
  const etag = `"${key.slice(0, 32)}"`;

  const cached = cacheGet(key);
  if (cached) return { audio: cached, etag };

  let job = pending.get(key);
  if (!job) {
    job = generate(apiKey, text, accent)
      .then((audio) => {
        cacheSet(key, audio);
        return audio;
      })
      .finally(() => pending.delete(key));
    pending.set(key, job);
  }
  return { audio: await job, etag };
}

async function generate(apiKey: string, text: string, accent: TtsAccent): Promise<Buffer> {
  const { model, voice } = modelAndVoice();
  const client = new OpenAI({ apiKey, timeout: REQUEST_TIMEOUT_MS, maxRetries: 1 });
  try {
    const response = await client.audio.speech.create({
      model,
      voice,
      input: text,
      response_format: "mp3",
      // Normal pace: single words are short, and a slower clip only adds waiting time.
      speed: 1,
      // `instructions` is only supported by the gpt-4o-mini-tts family.
      ...(model.startsWith("gpt-4o")
        ? {
            instructions: `Speak as a warm, professional female English teacher with ${ACCENT_STYLE[accent]}. Pronounce every word clearly and naturally at a smooth, steady pace. Keep a natural, pleasant tone with no breathiness and no dramatic expression. Read the text exactly as written, with nothing added.`,
          }
        : {}),
    });
    const audio = Buffer.from(await response.arrayBuffer());
    if (audio.byteLength === 0) throw new TtsError("Speech audio is temporarily unavailable.", 502);
    return audio;
  } catch (err) {
    if (err instanceof TtsError) throw err;
    if (err instanceof OpenAI.APIError) {
      console.error(`[tts] provider error status=${err.status ?? "?"} code=${err.code ?? "?"}`);
    } else {
      console.error("[tts] unexpected error");
    }
    throw new TtsError("Speech audio is temporarily unavailable.", 502);
  }
}
