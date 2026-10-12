/**
 * Minimal in-memory sliding-window rate limiter.
 *
 * Note: on serverless platforms each instance keeps its own counters, so this
 * is a best-effort guard against accidental or casual abuse. For strict limits
 * across instances, back it with a shared store (e.g. Upstash Redis / Vercel KV).
 */
export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the caller may retry (0 when allowed). */
  retryAfterSec: number;
}

export function createRateLimiter(options: { windowMs: number; max: number }) {
  const hits = new Map<string, number[]>();
  const MAX_KEYS = 5000;

  return function check(key: string, now = Date.now()): RateLimitResult {
    const cutoff = now - options.windowMs;
    const recent = (hits.get(key) ?? []).filter((t) => t > cutoff);

    if (recent.length >= options.max) {
      hits.set(key, recent);
      const retryAfterMs = recent[0] + options.windowMs - now;
      return { allowed: false, retryAfterSec: Math.max(1, Math.ceil(retryAfterMs / 1000)) };
    }

    recent.push(now);
    hits.set(key, recent);

    // Opportunistic cleanup so the map cannot grow without bound.
    if (hits.size > MAX_KEYS) {
      for (const [k, times] of hits) {
        if (times.every((t) => t <= cutoff)) hits.delete(k);
        if (hits.size <= MAX_KEYS / 2) break;
      }
    }
    return { allowed: true, retryAfterSec: 0 };
  };
}
