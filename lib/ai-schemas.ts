import { z } from "zod";
import type { PromptKind } from "@/lib/ai-prompts";

/**
 * Strict output schemas the model must follow (OpenAI Structured Outputs), plus formatters that turn
 * the validated result into the plain text the existing chat UI already renders.
 */

const text = z.string();

const Mistake = z.object({
  original: text.describe("Exact wording copied from the learner's text"),
  corrected: text,
  explanation: text.describe("One short sentence in Turkish"),
});

const Vocab = z.object({
  wordOrPhrase: text,
  meaning: text.describe("Simple English meaning with a Turkish translation"),
  example: text.describe("One short example sentence"),
});

// Plain number (no integer/min/max keywords) keeps the strict JSON schema maximally compatible; values are rounded and clamped to 1-10 below.
const Score = z.number().describe("Whole number from 1 to 10");

export const InterviewStartSchema = z.object({
  greeting: text,
  question: text,
});

export const InterviewEvalSchema = z.object({
  scores: z.object({
    grammar: Score,
    vocabulary: Score,
    relevance: Score,
    structure: Score,
    professionalCommunication: Score,
  }),
  strengths: z.array(text),
  mistakes: z.array(Mistake),
  vocabularySuggestions: z.array(Vocab),
  improvedB1Answer: text,
  improvedB2Answer: text,
  turkishFeedback: text,
  nextQuestion: text,
});

export const ConversationSchema = z.object({
  message: text,
  correction: Mistake.nullable(),
});

export const GrammarSchema = z.object({
  isCorrect: z.boolean(),
  correctedText: text,
  mistakes: z.array(Mistake),
  naturalAlternative: text.nullable(),
  comment: text,
});

export const ImproveSchema = z.object({
  correctedAnswer: text,
  naturalB1Answer: text,
  strongB2Answer: text,
  usefulVocabulary: z.array(Vocab),
  mainImprovements: z.array(text),
});

export const SCHEMAS = {
  "interview-start": { name: "interview_start", schema: InterviewStartSchema },
  "interview-eval": { name: "interview_evaluation", schema: InterviewEvalSchema },
  "conversation-start": { name: "conversation_message", schema: ConversationSchema },
  "conversation-turn": { name: "conversation_message", schema: ConversationSchema },
  grammar: { name: "grammar_coach", schema: GrammarSchema },
  improve: { name: "answer_improvement", schema: ImproveSchema },
} as const satisfies Record<PromptKind, { name: string; schema: z.ZodType }>;

/** Output token ceilings (reasoning + answer). Kept modest to control cost. */
export const MAX_OUTPUT_TOKENS: Record<PromptKind, number> = {
  "interview-start": 1200,
  "interview-eval": 3500,
  "conversation-start": 1200,
  "conversation-turn": 1800,
  grammar: 2500,
  improve: 3000,
};

export interface Formatted {
  reply: string;
  /** Compact text the client sends back as assistant history on the next turn. */
  context?: string;
}

// ---------------------------------------------------------------------------
// Post-processing
// ---------------------------------------------------------------------------

function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/[^\p{L}\p{N}']+/gu, " ")
    .trim();
}

/** Keeps only mistakes whose quoted original really occurs in the learner's text (no invented errors). */
function realMistakes<T extends { original: string; corrected: string }>(items: T[], source: string): T[] {
  const haystack = norm(source);
  return items.filter((m) => {
    const o = norm(m.original);
    return o.length > 0 && norm(m.corrected) !== o && haystack.includes(o);
  });
}

const clamp = (n: number) => Math.min(10, Math.max(1, Math.round(n)));
const clean = (s: string) => s.replace(/\*\*|__|^#+\s*/gm, "").trim();

// ---------------------------------------------------------------------------
// Formatters (plain text for the existing chat bubbles)
// ---------------------------------------------------------------------------

function lines(...parts: (string | null | false | undefined)[]): string {
  return parts.filter((p): p is string => Boolean(p)).join("\n");
}

function mistakeLines(items: { original: string; corrected: string; explanation: string }[]): string {
  return items
    .map((m) => lines(`- "${clean(m.original)}" → "${clean(m.corrected)}"`, m.explanation.trim() && `  Türkçe: ${clean(m.explanation)}`))
    .join("\n");
}

function vocabLines(items: { wordOrPhrase: string; meaning: string; example: string }[]): string {
  return items
    .map((v) => lines(`- ${clean(v.wordOrPhrase)}: ${clean(v.meaning)}`, v.example.trim() && `  e.g. ${clean(v.example)}`))
    .join("\n");
}

export function formatInterviewStart(d: z.infer<typeof InterviewStartSchema>): Formatted {
  const question = clean(d.question);
  return { reply: `${clean(d.greeting)}\n\nQuestion: ${question}`, context: question };
}

export function formatInterviewEval(d: z.infer<typeof InterviewEvalSchema>, answer: string): Formatted {
  const s = d.scores;
  const mistakes = realMistakes(d.mistakes, answer).slice(0, 4);
  const strengths = d.strengths.map(clean).filter(Boolean).slice(0, 3);
  const vocab = d.vocabularySuggestions.filter((v) => v.wordOrPhrase.trim()).slice(0, 3);
  const question = clean(d.nextQuestion);

  const reply = [
    lines(
      "Scores (1-10)",
      `Grammar ${clamp(s.grammar)} · Vocabulary ${clamp(s.vocabulary)} · Relevance ${clamp(s.relevance)} · Structure ${clamp(s.structure)} · Professional communication ${clamp(s.professionalCommunication)}`,
    ),
    strengths.length > 0 && lines("Strengths:", ...strengths.map((x) => `- ${x}`)),
    lines("Corrections:", mistakes.length > 0 ? mistakeLines(mistakes) : "- No clear grammar mistakes found."),
    vocab.length > 0 && lines("Useful phrases:", vocabLines(vocab)),
    lines("Better B1 version:", clean(d.improvedB1Answer)),
    lines("Better B2 version:", clean(d.improvedB2Answer)),
    d.turkishFeedback.trim() && lines("Türkçe:", clean(d.turkishFeedback)),
    `Next question: ${question}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  return { reply, context: question };
}

export function formatConversation(d: z.infer<typeof ConversationSchema>, userText: string | null): Formatted {
  const message = clean(d.message);
  const correction = d.correction && userText ? realMistakes([d.correction], userText)[0] : undefined;
  const reply = correction
    ? `${message}\n\n${lines(
        `Small correction: "${clean(correction.original)}" → "${clean(correction.corrected)}"`,
        correction.explanation.trim() && `Türkçe: ${clean(correction.explanation)}`,
      )}`
    : message;
  return { reply, context: message };
}

export function formatGrammar(d: z.infer<typeof GrammarSchema>, source: string): Formatted {
  const mistakes = d.isCorrect ? [] : realMistakes(d.mistakes, source).slice(0, 6);
  // Only claim "correct" when the corrected text really equals the original (ignoring case/punctuation).
  const noneFound = d.isCorrect || (mistakes.length === 0 && norm(d.correctedText) === norm(source));
  const alternative = d.naturalAlternative?.trim();

  const reply = [
    noneFound ? "No grammar mistakes found — your text is correct." : lines("Corrected text:", clean(d.correctedText)),
    !noneFound && mistakes.length > 0 && lines("Mistakes:", mistakeLines(mistakes)),
    alternative && lines("More natural alternative:", clean(alternative)),
    d.comment.trim() && lines("Türkçe:", clean(d.comment)),
  ]
    .filter(Boolean)
    .join("\n\n");
  return { reply };
}

export function formatImprove(d: z.infer<typeof ImproveSchema>): Formatted {
  const vocab = d.usefulVocabulary.filter((v) => v.wordOrPhrase.trim()).slice(0, 4);
  const notes = d.mainImprovements.map(clean).filter(Boolean).slice(0, 3);
  const reply = [
    lines("Corrected answer:", clean(d.correctedAnswer)),
    lines("More natural B1 version:", clean(d.naturalB1Answer)),
    lines("Strong B2 version:", clean(d.strongB2Answer)),
    vocab.length > 0 && lines("Useful vocabulary:", vocabLines(vocab)),
    notes.length > 0 && lines("What changed (Türkçe):", ...notes.map((n) => `- ${n}`)),
  ]
    .filter(Boolean)
    .join("\n\n");
  return { reply };
}
