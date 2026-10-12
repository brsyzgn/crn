# Ceren's English Club ✈️

A personal English-learning web app for a Turkish-speaking learner (CEFR B1–B2) preparing for **cabin crew interviews**.
It is a real, interactive product: flashcards, interview practice, quizzes, progress tracking, and optional AI feedback.

> Made especially for Ceren ♡

## Features

| Route | What it does |
| --- | --- |
| `/` | Welcome page with an aviation-inspired illustration (no external images). |
| `/dashboard` | Daily goal, study checklist, real stats, recent activity, phrase of the day, quick links. |
| `/vocabulary` | 120 B1–B2 entries in 6 categories. Flip cards, search, category/status filters, mark learned, favorites, review learned words, speech synthesis. |
| `/interview` | 32 practice questions in 7 categories. Write and save draft answers, reveal sample answers, tips, common mistakes, Turkish notes, mark as practiced. Optional AI feedback. |
| `/practice` | Two tabs. **AI Practice**: mock interview, conversation, grammar correction, answer improvement (needs `OPENAI_API_KEY`; otherwise shows a clear unavailable state). **Question Practice**: multiple-choice practice by topic (mixed, grammar, vocabulary, reading, everyday, workplace, customer service, cabin crew, situational, sentence completion, error correction) and level (B1, B1+, B2 and above), with instant feedback and explanations. Sessions draw fresh questions and are not added to test history. |
| `/tests` | 8 fixed mini tests plus 8 randomized tests (Mixed B1, B1+, B2, Grammar, Vocabulary and Reading Challenges, Cabin Crew and Customer Service English). 450 reviewed questions (B1–B2+) including 20 reading passages. Instant feedback, final score, answer review, retake with new questions, persistent history. |
| `/progress` | Words learned, quiz attempts and averages, interview practice, 7-day activity chart, achievements. Encouraging empty state. |
| `/settings` | Daily word goal, speech accent, reduced motion, local data info, reset with confirmation. |

**Honest data policy:** every number shown is computed from what the user actually saved. There are no streaks, durations or placeholder statistics, and no simulated AI replies.

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · shadcn/ui-style components (Radix primitives) · Lucide icons · Motion (`LazyMotion`, small bundle) · LocalStorage persistence · OpenAI Responses API (official `openai` SDK, Structured Outputs) via a server route.

## Getting started

Requirements: Node.js 20.9+ (tested on Node 24) and npm.

```bash
npm install
cp .env.example .env.local   # optional: add OPENAI_API_KEY to enable AI practice
npm run dev                  # http://localhost:3000
```

### Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run verify` | Content & logic checks (data integrity, quiz scoring, rate limiter, storage migration) |

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `OPENAI_API_KEY` | No | Enables AI practice. **Server-only**; never exposed to the browser. |
| `OPENAI_MODEL` | No | Model used for AI practice (default `gpt-5-mini`). Chosen on the server; the client cannot override it. |
| `OPENAI_TTS_MODEL` | No | Model for pronunciation audio (default `tts-1`, the low-latency model). |
| `OPENAI_TTS_VOICE` | No | Voice preset for pronunciation audio (default `nova`, a female voice). |

### Pronunciation audio

Pronunciation buttons share one player (`lib/speech-player.ts`, used through `hooks/use-speech.ts`), so audio never overlaps.

1. **Natural female voice (preferred):** when `OPENAI_API_KEY` is set, audio comes from `GET /api/tts` (server-side OpenAI text-to-speech, MP3). The key never reaches the browser. Clips are cached on the server (32 MB LRU) and in the browser (`Cache-Control: immutable`), so each word/sentence is generated once. The route is rate-limited (40/min, 500/hour per client).
2. **Fallback:** the browser's SpeechSynthesis, restricted to English voices and a curated list of known female voice names (Microsoft Aria/Jenny, Apple Ava/Samantha/Allison, Google US English, ...). The Web Speech API does not expose gender, so voices not on the list are never assumed to be female.

Cost: `gpt-4o-mini-tts` is billed per text token plus audio output (roughly US$0.015 per minute of audio, so a single word or short sentence costs a fraction of a cent). Check [OpenAI pricing](https://platform.openai.com/docs/pricing) for current rates. A voice preset name does not guarantee gender; choose the voice by listening and override with `OPENAI_TTS_VOICE` (e.g. `coral`, `nova`, `shimmer`, `sage`).

## Deploy to Vercel

1. Push this project to a Git repository (GitHub, GitLab or Bitbucket).
2. In Vercel choose **Add New → Project** and import the repository. The framework is detected as Next.js; no build settings need to change.
3. (Optional) Under **Settings → Environment Variables** add `OPENAI_API_KEY` (and optionally `OPENAI_MODEL`) for Production/Preview, then redeploy.
4. Click **Deploy**.

Or with the CLI: `npm i -g vercel && vercel` (then `vercel --prod`).

## Architecture

```
app/              Routes (App Router). (app)/ is the shell with sidebar + mobile nav; app/api/practice is the AI route.
components/       Reusable components (AppSidebar, MobileNavigation, DashboardStatCard, ProgressChart, EmptyState, LoadingState, ...)
components/ui/    shadcn-style primitives (button, card, badge, input, switch, dialog, progress)
features/         One folder per module: dashboard, vocabulary (VocabularyFlashcard), interview (InterviewQuestionCard), quiz (QuizEngine), practice, progress, settings
data/             Content only: vocabulary, interview questions, quiz bank, daily phrases
hooks/            useProgress, useSpeech, useAiStatus
lib/              storage (versioned persistence), store, stats, quiz scoring, AI validation/prompts, rate limiter, utils
types/            Strict types for content and persisted progress
scripts/          verify-content.mjs
```

### Persistence

Progress is stored in LocalStorage under `ceren-english-club:progress` as a **versioned** object (`version: 1`).

- Reads are sanitised; corrupt or unknown payloads are backed up (`…:backup`) and never crash the UI.
- Server render uses an empty default snapshot (`useSyncExternalStore`), and data-driven UI renders after hydration, so there are no hydration mismatches.
- If storage is blocked, the app keeps working in memory and shows a notice.
- To change the schema, bump `STORAGE_VERSION` and add a `case` to `migrate()` in `lib/storage.ts`.

### AI route (`POST /api/practice`)

- The key and model are read from `process.env` on the server only (`lib/ai-server.ts`). Instructions and model are server-controlled; the client sends just `mode`, recent `messages` and an optional interview `question`.
- Uses the OpenAI **Responses API** with strict JSON-schema Structured Outputs (`lib/ai-schemas.ts`), formatted into the existing chat bubbles. If the AI call fails, an error is shown; no fallback or fake feedback is ever produced.
- Validates mode, roles, message count and length (≤ 2000 chars per answer, ≤ 10 recent turns); rejects oversized bodies (24 KB) before any OpenAI call. The client sends only a few recent turns, with the tutor's earlier feedback reduced to its next question.
- Abuse protection (no visible daily cap): 12 requests/minute and 200/hour per IP, and at most 2 concurrent requests per IP (in-memory, best effort on serverless; use a shared store such as Upstash Redis or Vercel KV for strict limits).
- Conversation content and provider errors are never logged or returned; only status/error codes are logged.
- `node scripts/ai-smoke-test.mjs http://localhost:3000` runs validation checks and (with a configured key) live checks against the running dev server.
- `GET /api/practice` returns `{ "available": boolean }` so the UI can show the right state.

## Content notes

- Interview questions are **general practice prompts**. They are not claimed to come from any airline, and the app makes no airline-specific hiring claims.
- Sample answers are models; candidates should adapt them to their real experience.

## Known limitations

- Progress lives in one browser; there is no sync across devices (by design for the MVP).
- Speech synthesis depends on the voices available in the user's browser.
- AI practice conversations are not saved.
- The rate limiter is per server instance (see above).
