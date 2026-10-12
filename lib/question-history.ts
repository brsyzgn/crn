/**
 * "Recently answered" history for Practice and the randomized tests.
 *
 * It lives under its own versioned localStorage key, so the main progress store and its
 * migration path are untouched. Losing this key only means questions may repeat sooner.
 */

export const HISTORY_KEY = "ceren-english-club:question-history";
const VERSION = 1;
/** Plenty for the whole bank (about 610 questions) while keeping the key small. */
export const MAX_HISTORY_ENTRIES = 800;

export function parseHistory(raw: string | null): Map<string, number> {
  const out = new Map<string, number>();
  if (!raw) return out;
  try {
    const data: unknown = JSON.parse(raw);
    if (typeof data !== "object" || data === null) return out;
    const { version, seen } = data as { version?: unknown; seen?: unknown };
    if (version !== VERSION || typeof seen !== "object" || seen === null) return out;
    for (const [id, at] of Object.entries(seen as Record<string, unknown>)) {
      if (typeof at === "number" && Number.isFinite(at) && at > 0) out.set(id, at);
    }
  } catch {
    // Corrupt data is treated as an empty history.
  }
  return out;
}

export function serializeHistory(seen: ReadonlyMap<string, number>): string {
  const newest = [...seen.entries()].sort((a, b) => b[1] - a[1]).slice(0, MAX_HISTORY_ENTRIES);
  return JSON.stringify({ version: VERSION, seen: Object.fromEntries(newest) });
}

export function loadSeen(): Map<string, number> {
  if (typeof window === "undefined") return new Map();
  try {
    return parseHistory(window.localStorage.getItem(HISTORY_KEY));
  } catch {
    return new Map();
  }
}

export function markSeen(ids: readonly string[], now: number = Date.now()): void {
  if (typeof window === "undefined" || ids.length === 0) return;
  try {
    const seen = parseHistory(window.localStorage.getItem(HISTORY_KEY));
    for (const id of ids) seen.set(id, now);
    window.localStorage.setItem(HISTORY_KEY, serializeHistory(seen));
  } catch {
    // Storage may be full or blocked (private mode). Practice still works without history.
  }
}
