import "server-only";

import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import type { z } from "zod";
import { isStarterRequest, type PracticeRequest, type PracticeResponse } from "@/lib/ai";
import { buildInstructions, CONVERSATION_TOPICS, promptKind, type PromptKind } from "@/lib/ai-prompts";
import {
  formatConversation,
  formatGrammar,
  formatImprove,
  formatInterviewEval,
  formatInterviewStart,
  MAX_OUTPUT_TOKENS,
  SCHEMAS,
  type Formatted,
} from "@/lib/ai-schemas";

/**
 * Server-only OpenAI integration (official SDK, Responses API with Structured Outputs).
 * The API key and model are read from the environment here and nowhere else.
 */

export const DEFAULT_MODEL = "gpt-5-mini";
const REQUEST_TIMEOUT_MS = 45_000;

/** An error that is safe to show to the learner. Raw provider errors never leave this module. */
export class AiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "AiError";
  }
}

export const UNAVAILABLE_MESSAGE = "AI feedback is temporarily unavailable. Please try again.";

/**
 * Returns the server-side key only if it looks like a real OpenAI key (they all start with "sk-").
 * An empty value or a leftover placeholder such as PASTE_KEY_HERE counts as "not configured", so the
 * UI says so clearly instead of failing on every request.
 */
function readApiKey(): string | undefined {
  const key = process.env.OPENAI_API_KEY?.trim();
  return key && key.startsWith("sk-") ? key : undefined;
}

export function isAiConfigured(): boolean {
  return readApiKey() !== undefined;
}

type InputMessage = { role: "user" | "assistant"; content: string };

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/** Builds the model input. Learner text only ever goes into user-role content. */
function buildInput(kind: PromptKind, req: PracticeRequest): { input: InputMessage[]; learnerText: string | null } {
  const { messages, question } = req;
  const last = messages[messages.length - 1];

  switch (kind) {
    case "interview-start":
      return { input: [{ role: "user", content: "Please begin the interview." }], learnerText: null };
    case "conversation-start":
      return {
        input: [{ role: "user", content: `Please start the conversation. Topic: ${pick(CONVERSATION_TOPICS)}.` }],
        learnerText: null,
      };
    case "interview-eval": {
      const history = messages.slice(0, -1);
      const prev = history[history.length - 1];
      const asked = question ?? (prev?.role === "assistant" ? prev.content : undefined);
      const content = `Interview question:\n${asked ?? "(not provided — treat it as a general cabin crew interview answer)"}\n\nCeren's answer:\n${last.content}`;
      return { input: [...history, { role: "user", content }], learnerText: last.content };
    }
    case "conversation-turn":
      return { input: messages, learnerText: last.content };
    case "grammar":
      return { input: [{ role: "user", content: `Text to check:\n${last.content}` }], learnerText: last.content };
    case "improve": {
      const content = `Interview question:\n${question ?? "(not provided)"}\n\nCeren's answer:\n${last.content}`;
      return { input: [{ role: "user", content }], learnerText: last.content };
    }
  }
}

function supportsReasoning(model: string): boolean {
  return /^(gpt-5|o\d)/i.test(model);
}

/** Maps any SDK/network failure to a safe message. Logs only status/code, never content or the key. */
function toAiError(err: unknown): AiError {
  if (err instanceof AiError) return err;

  if (err instanceof OpenAI.APIUserAbortError) {
    return new AiError("Request cancelled.", 499);
  }
  if (err instanceof OpenAI.APIConnectionTimeoutError) {
    console.error("[ai] provider timeout");
    return new AiError("The AI took too long to answer. Please try again.", 504);
  }
  if (err instanceof OpenAI.APIConnectionError) {
    console.error("[ai] provider unreachable");
    return new AiError(UNAVAILABLE_MESSAGE, 502);
  }
  if (err instanceof OpenAI.APIError) {
    console.error(`[ai] provider error status=${err.status ?? "?"} code=${err.code ?? "?"} type=${err.type ?? "?"}`);
    if (err.status === 429 && err.code !== "insufficient_quota") {
      return new AiError("The AI is busy right now. Please try again in a moment.", 503);
    }
    // 401/403 (bad key), insufficient_quota, 400 (bad model), 5xx: nothing the learner can fix.
    return new AiError(UNAVAILABLE_MESSAGE, 502);
  }

  console.error("[ai] unexpected error");
  return new AiError(UNAVAILABLE_MESSAGE, 502);
}

const MALFORMED = () => new AiError("The AI gave an unexpected answer. Please try again.", 502);

export async function runPractice(req: PracticeRequest, signal?: AbortSignal): Promise<PracticeResponse> {
  const apiKey = readApiKey();
  if (!apiKey) {
    throw new AiError("AI practice is not available because no OpenAI API key has been configured.", 503);
  }
  const model = process.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL;

  const isStart = isStarterRequest(req.mode, req.messages);
  const kind = promptKind(req.mode, isStart);
  const { input, learnerText } = buildInput(kind, req);
  const { name, schema } = SCHEMAS[kind];

  const client = new OpenAI({ apiKey, timeout: REQUEST_TIMEOUT_MS, maxRetries: 0 });

  let parsed: unknown;
  try {
    const response = await client.responses.parse(
      {
        model,
        instructions: buildInstructions(kind),
        input,
        text: { format: zodTextFormat(schema, name) },
        max_output_tokens: MAX_OUTPUT_TOKENS[kind],
        store: false,
        ...(supportsReasoning(model) ? { reasoning: { effort: "low" as const } } : {}),
      },
      { signal },
    );
    if (response.status === "incomplete") {
      console.error(`[ai] incomplete response: ${response.incomplete_details?.reason ?? "unknown"}`);
      throw MALFORMED();
    }
    parsed = response.output_parsed;
  } catch (err) {
    throw toAiError(err);
  }
  if (!parsed) throw MALFORMED();

  let out: Formatted;
  try {
    switch (kind) {
      case "interview-start":
        out = formatInterviewStart(parsed as z.infer<typeof SCHEMAS["interview-start"]["schema"]>);
        break;
      case "interview-eval":
        out = formatInterviewEval(parsed as z.infer<typeof SCHEMAS["interview-eval"]["schema"]>, learnerText ?? "");
        break;
      case "conversation-start":
      case "conversation-turn":
        out = formatConversation(parsed as z.infer<typeof SCHEMAS["conversation-turn"]["schema"]>, learnerText);
        break;
      case "grammar":
        out = formatGrammar(parsed as z.infer<typeof SCHEMAS["grammar"]["schema"]>, learnerText ?? "");
        break;
      case "improve":
        out = formatImprove(parsed as z.infer<typeof SCHEMAS["improve"]["schema"]>);
        break;
    }
  } catch {
    throw MALFORMED();
  }

  if (!out.reply.trim()) throw MALFORMED();
  return { reply: out.reply, ...(out.context ? { context: out.context } : {}) };
}
