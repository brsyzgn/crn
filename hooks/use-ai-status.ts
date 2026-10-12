"use client";

import { useEffect, useState } from "react";

export type AiStatus = "loading" | "available" | "unavailable";

// Remember the answer for the lifetime of the page so navigating between cards doesn't refetch.
let cached: Exclude<AiStatus, "loading"> | null = null;

/** Asks the server whether an OpenAI key is configured. Never sees the key itself. */
export function useAiStatus(): AiStatus {
  const [status, setStatus] = useState<AiStatus>(cached ?? "loading");

  useEffect(() => {
    if (cached) return;
    const controller = new AbortController();
    fetch("/api/practice", { signal: controller.signal, cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("bad status"))))
      .then((data: { available?: boolean }) => {
        cached = data.available === true ? "available" : "unavailable";
        setStatus(cached);
      })
      .catch((err: unknown) => {
        if ((err as { name?: string })?.name !== "AbortError") setStatus("unavailable");
      });
    return () => controller.abort();
  }, []);

  return status;
}
