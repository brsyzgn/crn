import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Local-timezone calendar key, e.g. "2026-10-12". */
export function toDateKey(input: Date | string | number): string {
  const d = input instanceof Date ? input : new Date(input);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Date keys for the last `days` days, oldest first, ending with today. */
export function lastDateKeys(days: number, now: Date): string[] {
  const keys: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    keys.push(toDateKey(d));
  }
  return keys;
}

/** Whole local days since the Unix epoch — used for deterministic daily picks. */
export function dayNumber(now: Date): number {
  return Math.floor(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86_400_000,
  );
}

export function formatRelative(iso: string, now: Date): string {
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24 && toDateKey(then) === toDateKey(now)) {
    return `${hours} hr ago`;
  }
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  if (toDateKey(then) === toDateKey(yesterday)) return "Yesterday";
  return then.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function pluralize(n: number, singular: string, plural?: string) {
  return n === 1 ? singular : (plural ?? `${singular}s`);
}
