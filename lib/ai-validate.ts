import { AI_LIMITS, AI_MODES, type PracticeRequest } from "@/lib/ai";
import type { AiMode } from "@/types";

export type ValidationResult =
  | { ok: true; value: PracticeRequest }
  | { ok: false; error: string; status: 400 | 413 };

const fail = (error: string, status: 400 | 413 = 400): ValidationResult => ({ ok: false, error, status });

/**
 * Strict validation of an untrusted request body.
 * Only `mode`, `messages` and an optional `question` are read; every other field is ignored, so the
 * client can never supply a model name, system prompt or OpenAI parameter.
 */
export function validatePracticeRequest(body: unknown): ValidationResult {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return fail("Invalid request.");
  }
  const { mode, messages, question } = body as Record<string, unknown>;

  if (typeof mode !== "string" || !AI_MODES.includes(mode as AiMode)) {
    return fail("Unknown practice mode.");
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return fail("Please write a message first.");
  }
  if (messages.length > AI_LIMITS.maxMessages) {
    return fail("This conversation is too long. Please start a new one.", 413);
  }

  const clean: PracticeRequest["messages"] = [];
  let total = 0;
  for (const m of messages) {
    if (typeof m !== "object" || m === null || Array.isArray(m)) return fail("Invalid message.");
    const { role, content } = m as Record<string, unknown>;
    if (role !== "user" && role !== "assistant") return fail("Invalid message role.");
    if (typeof content !== "string") return fail("Invalid message content.");
    const trimmed = content.trim();
    if (trimmed.length === 0) {
      return fail(role === "user" ? "Please write your answer first." : "Invalid message content.");
    }
    const cap = role === "user" ? AI_LIMITS.maxMessageChars : AI_LIMITS.maxAssistantChars;
    if (trimmed.length > cap) {
      return fail(
        role === "user"
          ? `Messages can be up to ${AI_LIMITS.maxMessageChars} characters long. Please shorten your text.`
          : "Invalid message content.",
        413,
      );
    }
    total += trimmed.length;
    clean.push({ role, content: trimmed });
  }

  if (total > AI_LIMITS.maxTotalChars) {
    return fail("This conversation is too long. Please start a new one.", 413);
  }
  if (clean[clean.length - 1].role !== "user") {
    return fail("The last message must come from you.");
  }

  let cleanQuestion: string | undefined;
  if (question !== undefined && question !== null) {
    if (typeof question !== "string") return fail("Invalid question.");
    const q = question.trim();
    if (q.length > AI_LIMITS.maxQuestionChars) return fail("The interview question is too long.", 413);
    if (q.length > 0) cleanQuestion = q;
  }

  return { ok: true, value: { mode: mode as AiMode, messages: clean, question: cleanQuestion } };
}
