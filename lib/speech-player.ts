import type { SpeechLang } from "@/types";

/**
 * Client-side pronunciation player (single shared instance, so audio never overlaps).
 *
 * 1. Preferred: natural female voice from the server TTS route (/api/tts), when configured.
 * 2. Fallback: browser SpeechSynthesis, using only voices from a curated list of known female
 *    English voices. The Web Speech API does not expose gender, so unknown voices are never
 *    assumed to be female; if none match, the best English voice is used and reported as such.
 */

export type VoiceQuality = "server" | "browser-female" | "browser-other" | "none";

const RATE = 0.93;

// ---------- Browser voice selection ----------

/** Known female English voices (Apple, Microsoft, Google, Android). Order = preference. */
const FEMALE_VOICE_NAMES = [
  "Microsoft Aria Online (Natural)",
  "Microsoft Jenny Online (Natural)",
  "Microsoft Sonia Online (Natural)",
  "Microsoft Libby Online (Natural)",
  "Ava (Premium)",
  "Ava (Enhanced)",
  "Samantha (Enhanced)",
  "Allison (Enhanced)",
  "Serena (Premium)",
  "Serena (Enhanced)",
  "Kate (Enhanced)",
  "Google US English",
  "Google UK English Female",
  "Samantha",
  "Ava",
  "Allison",
  "Susan",
  "Zoe",
  "Serena",
  "Kate",
  "Stephanie",
  "Martha",
  "Microsoft Zira",
  "Microsoft Michelle",
  "Microsoft Aria",
  "Microsoft Jenny",
  "Microsoft Sonia",
  "Microsoft Libby",
  "Microsoft Hazel",
  "Microsoft Susan",
  "Karen",
  "Tessa",
  "Moira",
  "Fiona",
  "Female",
] as const;

/** Voices that are male, novelty, or known to sound robotic/breathy. Never chosen. */
const EXCLUDED_VOICE = /\b(alex|daniel|fred|david|mark|guy|ryan|george|james|oliver|thomas|rishi|arthur|aaron|eddy|reed|rocko|grandpa|grandma|flo|sandy|shelley|whisper|bad news|good news|bahh|bells|boing|bubbles|cellos|deranged|hysterical|jester|organ|superstar|trinoids|wobble|zarvox|albert|junior|ralph|kathy|princess|male)\b/i;

function isEnglish(v: SpeechSynthesisVoice) {
  return v.lang.toLowerCase().replace("_", "-").startsWith("en");
}

function langMatches(v: SpeechSynthesisVoice, lang: SpeechLang) {
  return v.lang.replace("_", "-").toLowerCase() === lang.toLowerCase();
}

export function pickBrowserVoice(
  voices: readonly SpeechSynthesisVoice[],
  lang: SpeechLang,
): { voice: SpeechSynthesisVoice | null; female: boolean } {
  const english = voices.filter((v) => isEnglish(v) && !EXCLUDED_VOICE.test(v.name));

  for (const sameLangOnly of [true, false]) {
    const pool = sameLangOnly ? english.filter((v) => langMatches(v, lang)) : english;
    for (const name of FEMALE_VOICE_NAMES) {
      const needle = name.toLowerCase();
      const hit = pool.find((v) => v.name.toLowerCase().includes(needle));
      if (hit) return { voice: hit, female: true };
    }
  }

  // No known female voice: best-effort English voice in the right accent. Prefer high quality.
  const sameLang = english.filter((v) => langMatches(v, lang));
  const fallback =
    sameLang.find((v) => /natural|premium|enhanced|neural/i.test(v.name)) ?? sameLang[0] ?? english[0] ?? null;
  return { voice: fallback, female: false };
}

// ---------- Shared state ----------

let current: HTMLAudioElement | null = null;
let token = 0;
let serverAvailable: boolean | null = null;
let probe: Promise<void> | null = null;
let browserVoices: SpeechSynthesisVoice[] = [];
let voicesBound = false;
let lastQuality: VoiceQuality = "none";
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function subscribeSpeech(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function getSpeechQuality(): VoiceQuality {
  return lastQuality;
}

export function isSpeechSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "speechSynthesis" in window || typeof Audio !== "undefined";
}

function loadVoices() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const synth = window.speechSynthesis;
  browserVoices = synth.getVoices();
  if (!voicesBound) {
    voicesBound = true;
    // Voices load asynchronously in Chrome/Safari.
    synth.addEventListener?.("voiceschanged", () => {
      browserVoices = synth.getVoices();
    });
  }
}

/** Warms up voice lists and checks (once) whether server audio is configured. Safe to call often. */
export function initSpeech() {
  if (typeof window === "undefined") return;
  loadVoices();
  if (!probe) {
    probe = fetch("/api/tts")
      .then((r) => (r.ok ? r.json() : { available: false }))
      .then((d: { available?: boolean }) => {
        serverAvailable = d.available === true;
      })
      .catch(() => {
        serverAvailable = false;
      })
      .then(() => {
        if (serverAvailable) lastQuality = "server";
        emit();
      });
  }
}

/** Stops any speech or audio that is currently playing. */
export function stopSpeech() {
  token++;
  if (current) {
    current.onended = null;
    current.onerror = null;
    current.pause();
    // Keep the source: the element may be a preloaded clip that should replay instantly.
    try {
      current.currentTime = 0;
    } catch {
      // Not seekable yet (still loading); harmless.
    }
    current = null;
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
}

// ---------- Server audio: preloaded clips ----------

const MAX_PRELOADED = 16;
const clips = new Map<string, HTMLAudioElement>();

function clipUrl(text: string, lang: SpeechLang) {
  return `/api/tts?${new URLSearchParams({ text, lang })}`;
}

/** Returns the (possibly already loaded) audio element for a clip, creating and caching it if needed. */
function getClip(text: string, lang: SpeechLang): HTMLAudioElement {
  const url = clipUrl(text, lang);
  const hit = clips.get(url);
  if (hit) {
    clips.delete(url); // refresh recency
    clips.set(url, hit);
    return hit;
  }
  const audio = new Audio(url);
  audio.preload = "auto";
  clips.set(url, audio);
  if (clips.size > MAX_PRELOADED) {
    const [oldestUrl, oldest] = clips.entries().next().value as [string, HTMLAudioElement];
    if (oldest !== current) {
      oldest.removeAttribute("src");
      oldest.load();
    }
    clips.delete(oldestUrl);
  }
  return audio;
}

function dropClip(text: string, lang: SpeechLang) {
  const url = clipUrl(text, lang);
  const a = clips.get(url);
  if (a) {
    a.removeAttribute("src");
    a.load();
    clips.delete(url);
  }
}

/**
 * Downloads the audio for `text` ahead of time so that tapping the speaker button plays it with no
 * wait. Safe to call often; does nothing when server audio is not configured.
 */
export function prefetchSpeech(text: string, lang: SpeechLang) {
  if (typeof window === "undefined" || typeof Audio === "undefined") return;
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean || clean.length > 600) return;
  if (serverAvailable === null) {
    initSpeech();
    probe?.then(() => {
      if (serverAvailable) getClip(clean, lang);
    });
    return;
  }
  if (serverAvailable) getClip(clean, lang);
}

function speakWithBrowser(text: string, lang: SpeechLang, myToken: number) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const synth = window.speechSynthesis;
  if (browserVoices.length === 0) loadVoices();
  const { voice, female } = pickBrowserVoice(browserVoices, lang);

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = voice?.lang || lang;
  if (voice) utterance.voice = voice;
  utterance.rate = RATE;
  utterance.pitch = 1; // natural pitch; never raised to imitate a female voice
  utterance.volume = 1;

  const quality: VoiceQuality = female ? "browser-female" : "browser-other";
  if (quality !== lastQuality) {
    lastQuality = quality;
    emit();
  }
  if (myToken !== token) return;
  synth.speak(utterance);
}

/** Speaks `text`, first stopping anything already playing. */
export function speakText(text: string, lang: SpeechLang) {
  if (typeof window === "undefined") return;
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return;

  stopSpeech();
  const myToken = token;

  // Server voice: the same female voice every time. The audio element starts synchronously inside the
  // user's tap (mobile autoplay rules). Until the availability probe has answered we optimistically
  // try the server, so the very first tap does not fall back to a different (browser) voice.
  if (serverAvailable !== false && clean.length <= 600 && typeof Audio !== "undefined") {
    if (serverAvailable === null) initSpeech();
    const audio = getClip(clean, lang);
    current = audio;
    let retried = false;
    const fail = () => {
      if (myToken !== token) return;
      // One quiet retry keeps the voice consistent; only then use the browser voice.
      if (!retried && serverAvailable !== false) {
        retried = true;
        dropClip(clean, lang);
        const again = getClip(clean, lang);
        current = again;
        again.onended = audio.onended;
        again.onerror = fail;
        again.play().catch(() => fail());
        return;
      }
      current = null;
      speakWithBrowser(clean, lang, myToken);
    };
    audio.onended = () => {
      if (current === audio) current = null;
    };
    audio.onerror = fail;
    audio.play().catch((err: unknown) => {
      // Autoplay block (NotAllowedError) means the user did not tap; do not double up with another voice.
      if (err instanceof DOMException && (err.name === "NotAllowedError" || err.name === "AbortError")) return;
      fail();
    });
    return;
  }

  speakWithBrowser(clean, lang, myToken);
}
