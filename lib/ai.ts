import type { AiMode } from "@/types";

/** Shared (client + server safe) constants and types for the AI practice feature. */

export const AI_MODES: readonly AiMode[] = ["interview", "conversation", "grammar", "improve"];

export const AI_LIMITS = {
  /** Most recent turns accepted per request (keeps context useful without wasting tokens). */
  maxMessages: 10,
  maxMessageChars: 2000,
  /** Assistant turns are only the compact context (e.g. the last question), never the full feedback. */
  maxAssistantChars: 1000,
  maxTotalChars: 8000,
  maxQuestionChars: 400,
  maxBodyBytes: 24_000,
} as const;

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface PracticeRequest {
  mode: AiMode;
  messages: ChatMessage[];
  /** Optional interview question the (last) answer responds to. */
  question?: string;
}

/** Successful server response. `context` is the compact text the client sends back as history. */
export interface PracticeResponse {
  reply: string;
  context?: string;
}

export const AI_MODE_INFO: Record<
  AiMode,
  { label: string; description: string; placeholder: string; starter?: string }
> = {
  interview: {
    label: "Mock Cabin Crew Interview",
    description: "Answer interview questions one at a time and get short feedback after each answer.",
    placeholder: "Type your answer in English…",
    starter: "Please start the mock cabin crew interview with your first question.",
  },
  conversation: {
    label: "Everyday English Conversation",
    description: "Chat naturally about travel, work or daily life. Big mistakes are gently corrected.",
    placeholder: "Write a message in English…",
    starter: "Hi! Let's have a friendly conversation in English. Please start with a simple question.",
  },
  grammar: {
    label: "Grammar Correction",
    description: "Paste a sentence or short paragraph and see corrections with simple explanations.",
    placeholder: "Write or paste your English text here…",
  },
  improve: {
    label: "Answer Improvement",
    description: "Paste an interview answer and receive a clearer, more natural B1–B2 version.",
    placeholder: "Paste your interview answer here…",
  },
};

/** True when the request is just the fixed "please start" message of a chat mode. */
export function isStarterRequest(mode: AiMode, messages: ChatMessage[]): boolean {
  const starter = AI_MODE_INFO[mode].starter;
  return Boolean(starter) && messages.length === 1 && messages[0].role === "user" && messages[0].content === starter;
}
