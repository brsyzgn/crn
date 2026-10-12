"use client";

import { useSyncExternalStore } from "react";
import {
  getServerSnapshot,
  getSnapshot,
  progressActions,
  subscribe,
} from "@/lib/store";

const subscribeNoop = () => () => {};

/** True only after the client has hydrated. Safe to branch on without hydration errors. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}

export function useProgress() {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useHydrated();
  return {
    progress: snap.data,
    storageAvailable: snap.storageAvailable,
    hydrated,
    actions: progressActions,
  };
}
