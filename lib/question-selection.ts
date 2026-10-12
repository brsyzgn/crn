import type { CefrLevel, QuestionCategory, QuizQuestion, QuizResult } from "../types/index.ts";

/**
 * Question selection for Practice sessions and randomized tests.
 *
 * Everything here is pure (the random source is injected) so it can be verified without a browser.
 * Selection prefers questions the learner has not seen recently, mixes levels by weight, and keeps
 * reading questions together with their passage.
 */

export type Rng = () => number;
/** question id -> time (ms since epoch) it was last answered. */
export type SeenMap = ReadonlyMap<string, number>;
export type LevelWeights = Partial<Record<CefrLevel, number>>;

const LEVEL_ORDER: readonly CefrLevel[] = ["B1", "B1+", "B2", "B2+"];

export function shuffle<T>(items: readonly T[], rng: Rng): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Builds a "last seen" map from completed test results (the existing quizResults history). */
export function seenFromResults(results: readonly QuizResult[]): Map<string, number> {
  const seen = new Map<string, number>();
  for (const r of results) {
    const at = Date.parse(r.takenAt);
    if (Number.isNaN(at)) continue;
    for (const a of r.answers) {
      if (a.selectedIndex !== null && (seen.get(a.questionId) ?? 0) < at) seen.set(a.questionId, at);
    }
  }
  return seen;
}

/** Combines several "last seen" maps, keeping the most recent time for each question. */
export function mergeSeen(...maps: ReadonlyMap<string, number>[]): Map<string, number> {
  const out = new Map<string, number>();
  for (const m of maps) for (const [id, at] of m) if ((out.get(id) ?? -1) < at) out.set(id, at);
  return out;
}

/** Unseen questions first (shuffled), then seen ones with the longest-ago answered first. */
export function orderBySeen(pool: readonly QuizQuestion[], seen: SeenMap, rng: Rng): QuizQuestion[] {
  const unseen = shuffle(
    pool.filter((q) => !seen.has(q.id)),
    rng,
  );
  const old = shuffle(
    pool.filter((q) => seen.has(q.id)),
    rng,
  ).sort((a, b) => (seen.get(a.id) ?? 0) - (seen.get(b.id) ?? 0));
  return [...unseen, ...old];
}

function weightedLevel(available: readonly CefrLevel[], weights: LevelWeights, rng: Rng): CefrLevel {
  const total = available.reduce((s, l) => s + (weights[l] ?? 0), 0);
  if (total <= 0) return available[0];
  let r = rng() * total;
  for (const l of available) {
    r -= weights[l] ?? 0;
    if (r < 0) return l;
  }
  return available[available.length - 1];
}

function weightedTarget(weights: LevelWeights): number {
  let sum = 0;
  let total = 0;
  LEVEL_ORDER.forEach((l, i) => {
    const w = weights[l] ?? 0;
    sum += i * w;
    total += w;
  });
  return total > 0 ? sum / total : 1.5;
}

/** Picks `count` questions, choosing levels by weight and preferring unseen questions inside each level. */
export function pickWeighted(
  pool: readonly QuizQuestion[],
  count: number,
  weights: LevelWeights,
  seen: SeenMap,
  rng: Rng,
): QuizQuestion[] {
  const weighted = LEVEL_ORDER.filter((l) => (weights[l] ?? 0) > 0);
  const queues = new Map<CefrLevel, QuizQuestion[]>(
    weighted.map((l) => [
      l,
      orderBySeen(
        pool.filter((q) => q.difficulty === l),
        seen,
        rng,
      ),
    ]),
  );
  // Fallback for pools that are short on the wanted levels: nearest level first.
  const target = weightedTarget(weights);
  const rest = orderBySeen(
    pool.filter((q) => !weighted.includes(q.difficulty)),
    seen,
    rng,
  ).sort((a, b) => Math.abs(LEVEL_ORDER.indexOf(a.difficulty) - target) - Math.abs(LEVEL_ORDER.indexOf(b.difficulty) - target));

  const picked: QuizQuestion[] = [];
  while (picked.length < count) {
    const open = weighted.filter((l) => (queues.get(l)?.length ?? 0) > 0);
    if (open.length > 0) {
      // Use up fresh questions first: only fall back to a seen question when no level has a fresh one left.
      const fresh = open.filter((l) => !seen.has(queues.get(l)![0].id));
      const level = weightedLevel(fresh.length > 0 ? fresh : open, weights, rng);
      picked.push(queues.get(level)!.shift()!);
    } else if (rest.length > 0) {
      picked.push(rest.shift()!);
    } else {
      break;
    }
  }
  return picked;
}

/** Reading questions are grouped by passage so that a passage is never split across the whole pool. */
export function passageKey(q: QuizQuestion): string {
  return q.passageId ?? q.passage ?? q.id;
}

export function groupByPassage(questions: readonly QuizQuestion[]): QuizQuestion[][] {
  const groups = new Map<string, QuizQuestion[]>();
  for (const q of questions) {
    const key = passageKey(q);
    const list = groups.get(key);
    if (list) list.push(q);
    else groups.set(key, [q]);
  }
  return [...groups.values()];
}

/** Picks whole passages (preferring fresh ones) until `count` questions are collected. */
export function pickPassages(
  pool: readonly QuizQuestion[],
  count: number,
  weights: LevelWeights,
  seen: SeenMap,
  rng: Rng,
): QuizQuestion[] {
  const groups = groupByPassage(pool);
  const levelOf = (g: QuizQuestion[]) => g[0].difficulty;
  const freshness = (g: QuizQuestion[]) => g.filter((q) => !seen.has(q.id)).length / g.length;
  const lastSeen = (g: QuizQuestion[]) => Math.max(0, ...g.map((q) => seen.get(q.id) ?? 0));

  const order = (list: QuizQuestion[][]) =>
    shuffle(list, rng).sort((a, b) => freshness(b) - freshness(a) || lastSeen(a) - lastSeen(b));

  const weighted = LEVEL_ORDER.filter((l) => (weights[l] ?? 0) > 0);
  const queues = new Map<CefrLevel, QuizQuestion[][]>(
    weighted.map((l) => [l, order(groups.filter((g) => levelOf(g) === l))]),
  );
  const target = weightedTarget(weights);
  const rest = order(groups.filter((g) => !weighted.includes(levelOf(g)))).sort(
    (a, b) => Math.abs(LEVEL_ORDER.indexOf(levelOf(a)) - target) - Math.abs(LEVEL_ORDER.indexOf(levelOf(b)) - target),
  );

  const picked: QuizQuestion[] = [];
  while (picked.length < count) {
    const open = weighted.filter((l) => (queues.get(l)?.length ?? 0) > 0);
    let group: QuizQuestion[] | undefined;
    if (open.length > 0) {
      const fresh = open.filter((l) => queues.get(l)![0].every((q) => !seen.has(q.id)));
      group = queues.get(weightedLevel(fresh.length > 0 ? fresh : open, weights, rng))!.shift();
    }
    else group = rest.shift();
    if (!group) break;
    const need = count - picked.length;
    if (group.length <= need) {
      picked.push(...group);
    } else {
      // Take the freshest questions of the passage, but keep them in reading order.
      const chosen = orderBySeen(group, seen, rng).slice(0, need);
      picked.push(...group.filter((q) => chosen.includes(q)));
    }
  }
  return picked;
}

/* -------------------------------------------------------------------------- */
/*  Composition of mixed sets                                                 */
/* -------------------------------------------------------------------------- */

export interface Slot {
  key: string;
  categories: readonly QuestionCategory[];
  count: number;
  min: number;
  max: number;
  /** Reading slots pick whole passages. */
  reading?: boolean;
  /**
   * Optional topic filter. A question is allowed when its topic starts with `topicPrefix`
   * or is listed in `topics`. Used by the Interview Vocabulary Test.
   */
  topicPrefix?: string;
  topics?: readonly string[];
}

function matchesTopic(slot: Slot, q: QuizQuestion): boolean {
  if (slot.topicPrefix === undefined && slot.topics === undefined) return true;
  return (
    (slot.topicPrefix !== undefined && q.topic.startsWith(slot.topicPrefix)) ||
    (slot.topics !== undefined && slot.topics.includes(q.topic))
  );
}

/** Moves one or two questions between slots so that mixed tests are not always built the same way. */
export function jitterSlots(slots: readonly Slot[], rng: Rng): Slot[] {
  const out = slots.map((s) => ({ ...s }));
  const moves = 1 + Math.floor(rng() * 2);
  for (let i = 0; i < moves; i++) {
    const from = shuffle(
      out.filter((s) => s.count > s.min),
      rng,
    )[0];
    const to = shuffle(
      out.filter((s) => s !== from && s.count < s.max),
      rng,
    )[0];
    if (!from || !to) break;
    from.count -= 1;
    to.count += 1;
  }
  return out;
}

export function composeQuestions(
  pool: readonly QuizQuestion[],
  slots: readonly Slot[],
  weights: LevelWeights,
  length: number,
  seen: SeenMap,
  rng: Rng,
): QuizQuestion[] {
  const used = new Set<string>();
  const standard: QuizQuestion[] = [];
  const reading: QuizQuestion[] = [];

  for (const slot of slots) {
    if (slot.count <= 0) continue;
    const candidates = pool.filter((q) => slot.categories.includes(q.category) && !used.has(q.id) && matchesTopic(slot, q));
    const chosen = slot.reading
      ? pickPassages(candidates, slot.count, weights, seen, rng)
      : pickWeighted(candidates, slot.count, weights, seen, rng);
    chosen.forEach((q) => used.add(q.id));
    (slot.reading ? reading : standard).push(...chosen);
  }

  // If a slot could not be filled (small pool), top up from the non-reading questions that are left.
  const missing = length - standard.length - reading.length;
  if (missing > 0) {
    const filler = pool.filter(
      (q) => q.category !== "reading" && !used.has(q.id) && slots.some((s) => s.categories.includes(q.category) && matchesTopic(s, q)),
    );
    standard.push(...pickWeighted(filler, missing, weights, seen, rng));
  }

  // Standard questions are shuffled; a reading passage stays together at the end.
  return [...shuffle(standard, rng), ...reading].slice(0, length);
}

/* -------------------------------------------------------------------------- */
/*  Practice sessions                                                          */
/* -------------------------------------------------------------------------- */

export type PracticeLevel = "all" | "B1" | "B1+" | "B2";

export const PRACTICE_LEVEL_LABELS: Record<PracticeLevel, string> = {
  all: "All levels",
  B1: "B1",
  "B1+": "B1+",
  B2: "B2 and above",
};

/** The real mix of the new bank (25 / 30 / 40 / 5) is used when no level is chosen. */
const ALL_LEVEL_WEIGHTS: LevelWeights = { B1: 25, "B1+": 30, B2: 40, "B2+": 5 };

export function practiceLevels(level: PracticeLevel): { allowed: readonly CefrLevel[]; weights: LevelWeights } {
  switch (level) {
    case "B1":
      return { allowed: ["B1"], weights: { B1: 1 } };
    case "B1+":
      return { allowed: ["B1+"], weights: { "B1+": 1 } };
    case "B2":
      return { allowed: ["B2", "B2+"], weights: { B2: 85, "B2+": 15 } };
    default:
      return { allowed: LEVEL_ORDER, weights: ALL_LEVEL_WEIGHTS };
  }
}

export type PracticeCategory = QuestionCategory | "mixed";

/** Slots used by "Mixed English" practice; counts are scaled to the session length. */
export const MIXED_PRACTICE_SLOTS: readonly Omit<Slot, "count" | "min" | "max">[] = [
  { key: "grammar", categories: ["grammar", "error-correction"] },
  { key: "vocabulary", categories: ["vocabulary", "sentence-completion", "everyday"] },
  { key: "service", categories: ["customer-service", "situational", "workplace"] },
  { key: "cabin", categories: ["cabin-crew"] },
  { key: "reading", categories: ["reading"], reading: true },
];

const MIXED_SHARES = [0.3, 0.25, 0.15, 0.1, 0.2];

/** Splits `length` into whole numbers that follow `shares` and add up exactly. */
export function splitCounts(length: number, shares: readonly number[]): number[] {
  const raw = shares.map((s) => s * length);
  const counts = raw.map(Math.floor);
  let left = length - counts.reduce((a, b) => a + b, 0);
  const byRemainder = raw
    .map((r, i) => ({ i, rem: r - Math.floor(r) }))
    .sort((a, b) => b.rem - a.rem);
  for (const { i } of byRemainder) {
    if (left <= 0) break;
    counts[i] += 1;
    left -= 1;
  }
  return counts;
}

export function mixedSlots(length: number): Slot[] {
  const counts = splitCounts(length, MIXED_SHARES);
  return MIXED_PRACTICE_SLOTS.map((s, i) => ({
    ...s,
    count: counts[i],
    min: Math.max(0, counts[i] - 1),
    max: counts[i] + 1,
  }));
}

export function practicePool(pool: readonly QuizQuestion[], category: PracticeCategory, level: PracticeLevel): QuizQuestion[] {
  const { allowed } = practiceLevels(level);
  return pool.filter((q) => allowed.includes(q.difficulty) && (category === "mixed" || q.category === category));
}

/** Builds the question list for a Practice session. */
export function buildPracticeSession(
  bank: readonly QuizQuestion[],
  category: PracticeCategory,
  level: PracticeLevel,
  length: number,
  seen: SeenMap,
  rng: Rng,
): QuizQuestion[] {
  const pool = practicePool(bank, category, level);
  const { weights } = practiceLevels(level);
  const size = Math.min(length, pool.length);
  if (size === 0) return [];
  if (category === "reading") return pickPassages(pool, size, weights, seen, rng);
  if (category === "mixed") return composeQuestions(pool, jitterSlots(mixedSlots(size), rng), weights, size, seen, rng);
  return shuffle(pickWeighted(pool, size, weights, seen, rng), rng);
}

/** The three test lengths offered for every randomized mode. */
export const TEST_LENGTHS = [
  { id: "quick", label: "Quick", length: 10 },
  { id: "standard", label: "Standard", length: 20 },
  { id: "full", label: "Full", length: 30 },
] as const;

export type TestLengthId = (typeof TEST_LENGTHS)[number]["id"];

/** Rescales the slot counts of a mode from its base length to another length (the totals stay exact). */
export function scaleSlots(slots: readonly Slot[], from: number, to: number): Slot[] {
  if (from === to) return slots.map((s) => ({ ...s }));
  const counts = splitCounts(
    to,
    slots.map((s) => s.count / from),
  );
  return slots.map((s, i) => {
    const spread = Math.max(0, s.max - s.count);
    return { ...s, count: counts[i], min: Math.max(0, counts[i] - spread), max: counts[i] + spread };
  });
}

/** Builds the question list for a randomized test mode (see data/test-modes.ts). */
export function buildModeQuestions(
  mode: { length: number; levels: LevelWeights; slots: readonly Slot[] },
  bank: readonly QuizQuestion[],
  seen: SeenMap,
  rng: Rng,
  length: number = mode.length,
): QuizQuestion[] {
  const slots = scaleSlots(mode.slots, mode.length, length);
  return composeQuestions(bank, jitterSlots(slots, rng), mode.levels, length, seen, rng);
}
