"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  initSpeech,
  isSpeechSupported,
  prefetchSpeech,
  speakText,
  stopSpeech,
  subscribeSpeech,
  getSpeechQuality,
} from "@/lib/speech-player";
import type { SpeechLang } from "@/types";

const subscribeNoop = () => () => {};

/**
 * Pronunciation hook. Plays a natural female English voice (server TTS when configured, otherwise
 * the best curated browser voice). One shared player, so repeated clicks never overlap.
 */
export function useSpeech(lang: SpeechLang) {
  const supported = useSyncExternalStore(subscribeNoop, isSpeechSupported, () => false);
  const quality = useSyncExternalStore(subscribeSpeech, getSpeechQuality, () => "none" as const);

  useEffect(() => {
    initSpeech();
  }, []);

  const speak = useCallback((text: string) => speakText(text, lang), [lang]);

  /** Downloads the audio ahead of time so the next tap on the speaker plays instantly. */
  const prefetch = useCallback((text: string) => prefetchSpeech(text, lang), [lang]);

  return { supported, speak, prefetch, stop: stopSpeech, quality };
}
