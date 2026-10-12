import {
  MAX_AI_EVENTS,
  MAX_ANSWER_LENGTH,
  MAX_QUIZ_RESULTS,
  STORAGE_KEY,
  clearStorage,
  createDefaultState,
  loadFromStorage,
  sanitizePreferences,
  saveToStorage,
} from "@/lib/storage";
import type { AiMode, Preferences, ProgressState, QuizResult } from "@/types";

/**
 * A tiny external store (consumed through useSyncExternalStore) wrapping the
 * LocalStorage persistence layer. Snapshots are immutable and only replaced
 * when something changes, so React can compare them by reference.
 */

export interface StoreSnapshot {
  data: ProgressState;
  /** False when LocalStorage cannot be used (data lives in memory only). */
  storageAvailable: boolean;
}

const SERVER_SNAPSHOT: StoreSnapshot = {
  data: createDefaultState(),
  storageAvailable: true,
};

let snapshot: StoreSnapshot = SERVER_SNAPSHOT;
let loaded = false;
const listeners = new Set<() => void>();
let storageListenerAttached = false;

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  const { state, available } = loadFromStorage();
  snapshot = { data: state, storageAvailable: available };
  loaded = true;
}

function emit() {
  listeners.forEach((l) => l());
}

function commit(next: ProgressState) {
  ensureLoaded();
  const ok = saveToStorage(next);
  snapshot = {
    data: next,
    // Once a write fails we report storage as unavailable; a later success restores it.
    storageAvailable: ok,
  };
  emit();
}

function handleStorageEvent(e: StorageEvent) {
  if (e.key !== null && e.key !== STORAGE_KEY) return;
  const { state, available } = loadFromStorage();
  snapshot = { data: state, storageAvailable: available };
  loaded = true;
  emit();
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (!storageListenerAttached && typeof window !== "undefined") {
    window.addEventListener("storage", handleStorageEvent);
    storageListenerAttached = true;
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && storageListenerAttached) {
      window.removeEventListener("storage", handleStorageEvent);
      storageListenerAttached = false;
    }
  };
}

export function getSnapshot(): StoreSnapshot {
  ensureLoaded();
  return snapshot;
}

export function getServerSnapshot(): StoreSnapshot {
  return SERVER_SNAPSHOT;
}

function current(): ProgressState {
  ensureLoaded();
  return snapshot.data;
}

/* -------------------------------- actions --------------------------------- */

export const progressActions = {
  /** Returns the new learned state. */
  toggleLearned(wordId: string): boolean {
    const s = current();
    const learned = { ...s.learnedWords };
    const nowLearned = !(wordId in learned);
    if (nowLearned) learned[wordId] = new Date().toISOString();
    else delete learned[wordId];
    commit({ ...s, learnedWords: learned });
    return nowLearned;
  },

  toggleFavorite(wordId: string): boolean {
    const s = current();
    const isFav = s.favoriteWords.includes(wordId);
    commit({
      ...s,
      favoriteWords: isFav
        ? s.favoriteWords.filter((id) => id !== wordId)
        : [...s.favoriteWords, wordId],
    });
    return !isFav;
  },

  saveAnswer(questionId: string, text: string) {
    const s = current();
    const trimmed = text.slice(0, MAX_ANSWER_LENGTH);
    const answers = { ...s.interviewAnswers };
    if (trimmed.trim() === "") delete answers[questionId];
    else answers[questionId] = { text: trimmed, updatedAt: new Date().toISOString() };
    commit({ ...s, interviewAnswers: answers });
  },

  clearAnswer(questionId: string) {
    const s = current();
    const answers = { ...s.interviewAnswers };
    delete answers[questionId];
    commit({ ...s, interviewAnswers: answers });
  },

  togglePracticed(questionId: string): boolean {
    const s = current();
    const practiced = { ...s.practicedQuestions };
    const now = !(questionId in practiced);
    if (now) practiced[questionId] = new Date().toISOString();
    else delete practiced[questionId];
    commit({ ...s, practicedQuestions: practiced });
    return now;
  },

  addQuizResult(result: QuizResult) {
    const s = current();
    commit({
      ...s,
      quizResults: [...s.quizResults, result].slice(-MAX_QUIZ_RESULTS),
    });
  },

  recordAiPractice(mode: AiMode) {
    const s = current();
    commit({
      ...s,
      aiPractice: [...s.aiPractice, { at: new Date().toISOString(), mode }].slice(
        -MAX_AI_EVENTS,
      ),
    });
  },

  setPreferences(patch: Partial<Preferences>) {
    const s = current();
    commit({
      ...s,
      preferences: sanitizePreferences({ ...s.preferences, ...patch }),
    });
  },

  /** Wipes learning progress but keeps preferences. */
  resetProgress() {
    const s = current();
    const fresh = createDefaultState();
    clearStorage();
    commit({ ...fresh, preferences: s.preferences });
  },
};

export type ProgressActions = typeof progressActions;
