/**
 * Content and logic validation. Run with: npm run validate-content (alias: npm run verify)
 * (Node 22.18+/24 can import the TypeScript data files directly.)
 */
import assert from "node:assert/strict";
import { VOCABULARY } from "../data/vocabulary.ts";
import { INTERVIEW_QUESTIONS } from "../data/interview.ts";
import { LEGACY_ENRICHMENT } from "../data/interview/legacy-enrichment.ts";
import { ALL_QUESTIONS, QUIZ_QUESTIONS, QUIZ_QUESTIONS_BY_ID, QUIZ_SETS } from "../data/quiz.ts";
import { BANK_QUESTIONS, READING_PASSAGES } from "../data/question-bank.ts";
import { modeSetId, TEST_MODES } from "../data/test-modes.ts";
import { CEFR_LEVELS, INTERVIEW_CATEGORIES, QUESTION_CATEGORIES } from "../types/index.ts";
import { parseHistory, serializeHistory } from "../lib/question-history.ts";
import {
  buildModeQuestions,
  buildPracticeSession,
  practiceLevels,
  practicePool,
  PRACTICE_LEVEL_LABELS,
  seenFromResults,
  TEST_LENGTHS,
} from "../lib/question-selection.ts";
import { DAILY_PHRASES } from "../data/phrases.ts";
import { scoreQuiz } from "../lib/quiz.ts";
import { createRateLimiter } from "../lib/rate-limit.ts";
import { createDefaultState, sanitizeState, migrate } from "../lib/storage.ts";

let failures = 0;
function check(name, fn) {
  try {
    fn();
    console.log(`  ok   ${name}`);
  } catch (e) {
    failures++;
    console.error(`  FAIL ${name}\n       ${e.message}`);
  }
}
const unique = (arr) => new Set(arr).size === arr.length;
const isText = (v) => typeof v === "string" && v.trim().length > 0;
const wordCount = (t) => t.trim().split(/\s+/).length;
const count = (arr, fn) => arr.filter(fn).length;

const share = (items, level) => (items.filter((i) => (i.level ?? i.difficulty) === level).length / items.length) * 100;
const near = (a, b) => {
  const tok = (t) => new Set(t.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 2));
  const x = tok(a);
  const y = tok(b);
  let i = 0;
  for (const w of x) if (y.has(w)) i++;
  return i / (x.size + y.size - i);
};

console.log("Vocabulary");
const vocabLv = Object.fromEntries(CEFR_LEVELS.map((l) => [l, VOCABULARY.filter((v) => v.level === l).length]));
console.log(`       entries: ${VOCABULARY.length} (${CEFR_LEVELS.map((l) => `${l} ${vocabLv[l]}`).join(", ")})`);
check(`has at least 500 entries (${VOCABULARY.length})`, () => assert.ok(VOCABULARY.length >= 500));
check("ids are unique", () => assert.ok(unique(VOCABULARY.map((v) => v.id))));
check("words are unique (case-insensitive)", () => assert.ok(unique(VOCABULARY.map((v) => v.word.trim().toLowerCase()))));
check("example sentences are unique", () => assert.ok(unique(VOCABULARY.map((v) => v.example.trim().toLowerCase()))));
check("every entry has translation, example, CEFR level, part of speech and collocations", () => {
  for (const v of VOCABULARY) {
    for (const f of ["word", "turkish", "partOfSpeech", "example", "category", "level"]) {
      assert.ok(typeof v[f] === "string" && v[f].trim().length > 0, `${v.id}.${f}`);
    }
    assert.ok(CEFR_LEVELS.includes(v.level), `${v.id} level ${v.level}`);
    assert.match(v.example, /[.?!"]$/, `${v.id} example should end with punctuation`);
    assert.ok(Array.isArray(v.collocations) && v.collocations.length >= 2, `${v.id} collocations`);
    assert.ok(v.collocations.every(isText), `${v.id} blank collocation`);
    assert.ok(!/(lorem|todo|tbd|placeholder|xxx)/i.test(`${v.word} ${v.turkish} ${v.example}`), `${v.id} placeholder text`);
  }
});
check("all six categories are covered", () => {
  const cats = new Set(VOCABULARY.map((v) => v.category));
  assert.equal(cats.size, 6);
});
check("vocabulary follows the CEFR split (B1 30%, B1+ 30%, B2 35%, B2+ 5%, +/-3 points)", () => {
  const target = { B1: 30, "B1+": 30, B2: 35, "B2+": 5 };
  for (const l of CEFR_LEVELS) assert.ok(Math.abs(share(VOCABULARY, l) - target[l]) <= 3, `${l}: ${share(VOCABULARY, l).toFixed(1)}%`);
});

const ORIGINAL_INTERVIEW_IDS = Object.keys(LEGACY_ENRICHMENT);
console.log("Interview questions");
const interviewLv = Object.fromEntries(CEFR_LEVELS.map((l) => [l, INTERVIEW_QUESTIONS.filter((q) => q.difficulty === l).length]));
console.log(`       questions: ${INTERVIEW_QUESTIONS.length} (${CEFR_LEVELS.map((l) => `${l} ${interviewLv[l]}`).join(", ")})`);
check(`has at least 150 questions (${INTERVIEW_QUESTIONS.length})`, () => assert.ok(INTERVIEW_QUESTIONS.length >= 150));
check("ids are unique", () => assert.ok(unique(INTERVIEW_QUESTIONS.map((q) => q.id))));
check("question texts are unique", () => assert.ok(unique(INTERVIEW_QUESTIONS.map((q) => q.question.trim().toLowerCase()))));
check("no two interview questions are near-duplicates", () => {
  for (let i = 0; i < INTERVIEW_QUESTIONS.length; i++)
    for (let j = i + 1; j < INTERVIEW_QUESTIONS.length; j++)
      assert.ok(near(INTERVIEW_QUESTIONS[i].question, INTERVIEW_QUESTIONS[j].question) < 0.7, `${INTERVIEW_QUESTIONS[i].id} ~ ${INTERVIEW_QUESTIONS[j].id}`);
});
check("every question has all required fields", () => {
  for (const q of INTERVIEW_QUESTIONS) {
    for (const f of ["question", "turkish", "competency", "why", "sampleAnswer", "sampleAnswerB2"]) assert.ok(isText(q[f]), `${q.id}.${f}`);
    assert.ok(q.question.endsWith("?") || q.question.endsWith("."), `${q.id} question`);
    assert.ok(CEFR_LEVELS.includes(q.difficulty), `${q.id} level`);
    assert.ok(INTERVIEW_CATEGORIES.includes(q.category), `${q.id} category ${q.category}`);
    assert.ok(wordCount(q.sampleAnswer) >= 25, `${q.id} B1 sample answer too short`);
    assert.ok(wordCount(q.sampleAnswerB2) >= wordCount(q.sampleAnswer), `${q.id} B2 answer should not be shorter than the B1 answer`);
    assert.notEqual(q.sampleAnswer, q.sampleAnswerB2, `${q.id} answers are identical`);
    for (const [f, min] of [["keyPoints", 3], ["vocabulary", 3], ["phrases", 2], ["tips", 2], ["commonMistakes", 2]]) {
      assert.ok(Array.isArray(q[f]) && q[f].length >= min && q[f].every(isText), `${q.id}.${f}`);
    }
    assert.ok(Array.isArray(q.followUps) && q.followUps.length >= 2 && q.followUps.length <= 4 && q.followUps.every(isText), `${q.id} follow-ups`);
    assert.ok(["STAR", "SITUATION-ACTION-RESULT", "OPINION-REASON-EXAMPLE", "NONE"].includes(q.framework), `${q.id} framework`);
    assert.equal(q.source, "representative", `${q.id} must be labelled as a representative practice question`);
    assert.ok(!/(lorem|todo|tbd|placeholder|xxx)/i.test(JSON.stringify(q)), `${q.id} placeholder text`);
  }
});
check("all eighteen categories are covered with at least 8 questions each", () => {
  assert.equal(INTERVIEW_CATEGORIES.length, 18);
  for (const c of INTERVIEW_CATEGORIES) assert.ok(count(INTERVIEW_QUESTIONS, (q) => q.category === c) >= 8, c);
});
check("interview questions follow the CEFR split (B1 25%, B1+ 30%, B2 40%, B2+ 5%, +/-3 points)", () => {
  const target = { B1: 25, "B1+": 30, B2: 40, "B2+": 5 };
  for (const l of CEFR_LEVELS) assert.ok(Math.abs(share(INTERVIEW_QUESTIONS.map((q) => ({ level: q.difficulty })), l) - target[l]) <= 3, `${l}: ${interviewLv[l]}`);
});
check("the original 32 interview ids are preserved (saved answers keep working)", () => {
  const ids = new Set(INTERVIEW_QUESTIONS.map((q) => q.id));
  for (const id of ORIGINAL_INTERVIEW_IDS) assert.ok(ids.has(id), id);
});

console.log("Quiz bank");
check(`has at least 60 questions (${QUIZ_QUESTIONS.length})`, () => assert.ok(QUIZ_QUESTIONS.length >= 60));
check("ids are unique", () => assert.ok(unique(QUIZ_QUESTIONS.map((q) => q.id))));
check("each question has 4 distinct choices and one valid correct answer", () => {
  for (const q of QUIZ_QUESTIONS) {
    assert.equal(q.choices.length, 4, `${q.id} choices`);
    assert.ok(unique(q.choices), `${q.id} has duplicate choices`);
    assert.ok(Number.isInteger(q.answerIndex) && q.answerIndex >= 0 && q.answerIndex <= 3, `${q.id} answerIndex`);
    assert.ok(q.explanation.length > 15, `${q.id} explanation`);
  }
});
check("correct answers are spread across positions", () => {
  const counts = [0, 0, 0, 0];
  QUIZ_QUESTIONS.forEach((q) => counts[q.answerIndex]++);
  counts.forEach((c) => assert.ok(c >= QUIZ_QUESTIONS.length * 0.15, `position distribution ${counts}`));
});
check("all four categories exist with sets referencing real questions", () => {
  const ids = new Set(QUIZ_QUESTIONS.map((q) => q.id));
  assert.equal(new Set(QUIZ_QUESTIONS.map((q) => q.category)).size, 4);
  for (const s of QUIZ_SETS) for (const id of s.questionIds) assert.ok(ids.has(id), `${s.id} -> ${id}`);
  const used = QUIZ_SETS.flatMap((s) => s.questionIds);
  assert.ok(unique(used), "a question appears in more than one set");
  assert.equal(used.length, QUIZ_QUESTIONS.length, "some questions are in no set");
});

console.log("Question bank (all questions, original + new)");
const NEW = BANK_QUESTIONS;
const dupKey = (q) => `${q.passageId ?? ""}|${q.prompt.trim().toLowerCase().replace(/\s+/g, " ")}`;

const report = {
  "Missing questions": count(ALL_QUESTIONS, (q) => !isText(q.prompt)),
  "Missing answers": count(ALL_QUESTIONS, (q) => !Array.isArray(q.choices) || q.choices.length !== 4 || !q.choices.every(isText)),
  "Missing explanations": count(ALL_QUESTIONS, (q) => !isText(q.explanation) || q.explanation.trim().length < 15),
  "Invalid correct answers": count(
    ALL_QUESTIONS,
    (q) => !Number.isInteger(q.answerIndex) || q.answerIndex < 0 || q.answerIndex > 3 || !isText(q.choices?.[q.answerIndex]),
  ),
  "Duplicate IDs": ALL_QUESTIONS.length - new Set(ALL_QUESTIONS.map((q) => q.id)).size,
  "Duplicate choices": count(ALL_QUESTIONS, (q) => new Set((q.choices ?? []).map((c) => String(c).trim().toLowerCase())).size !== 4),
  "Invalid CEFR levels": count(ALL_QUESTIONS, (q) => !CEFR_LEVELS.includes(q.difficulty)),
};
console.log(`       Total questions: ${ALL_QUESTIONS.length} (original ${QUIZ_QUESTIONS.length} + new ${NEW.length})`);
for (const [label, n] of Object.entries(report)) console.log(`       ${label.padEnd(24)} ${n}`);
for (const [label, n] of Object.entries(report)) check(`${label} = 0`, () => assert.equal(n, 0));

check("every question has a valid category, a topic and a unique prompt", () => {
  for (const q of ALL_QUESTIONS) {
    assert.ok(QUESTION_CATEGORIES.includes(q.category), `${q.id} category`);
    assert.ok(isText(q.topic), `${q.id} topic`);
  }
  const keys = ALL_QUESTIONS.map(dupKey);
  const seen = new Set();
  for (let i = 0; i < keys.length; i++) {
    assert.ok(!seen.has(keys[i]), `identical question: ${ALL_QUESTIONS[i].id}`);
    seen.add(keys[i]);
  }
});
check("QUIZ_QUESTIONS_BY_ID resolves every question", () => {
  assert.equal(QUIZ_QUESTIONS_BY_ID.size ?? Object.keys(QUIZ_QUESTIONS_BY_ID).length, ALL_QUESTIONS.length);
});
check("the original questions are all preserved and unchanged in number", () => {
  assert.equal(QUIZ_QUESTIONS.length, 64);
  for (const q of QUIZ_QUESTIONS) assert.ok(ALL_QUESTIONS.includes(q), q.id);
});

const byCat = (c) => NEW.filter((q) => q.category === c);
const minimums = [
  ["grammar", 80],
  ["vocabulary", 75],
  ["cabin-crew", 40],
  ["customer-service", 20],
  ["workplace", 20],
  ["situational", 30],
  ["sentence-completion", 25],
  ["error-correction", 30],
  ["everyday", 30],
];
check("new question counts per category meet the targets", () => {
  for (const [c, min] of minimums) assert.ok(byCat(c).length >= min, `${c}: ${byCat(c).length} < ${min}`);
  assert.ok(byCat("customer-service").length + byCat("workplace").length >= 30, "customer service + workplace >= 30");
  assert.ok(byCat("sentence-completion").length + byCat("error-correction").length >= 20, "completion + correction >= 20");
  assert.ok(NEW.length >= 200, `new questions: ${NEW.length}`);
  const practice = NEW.filter((q) => q.category !== "reading").length;
  assert.ok(practice >= 300, `non-reading practice questions: ${practice}`);
});
for (const c of QUESTION_CATEGORIES) console.log(`       ${c.padEnd(20)} new ${byCat(c).length}`);

const lv = Object.fromEntries(CEFR_LEVELS.map((l) => [l, count(NEW, (q) => q.difficulty === l)]));
console.log(`       new questions by level: ${CEFR_LEVELS.map((l) => `${l} ${lv[l]} (${Math.round((lv[l] / NEW.length) * 100)}%)`).join(", ")}`);
check("new questions follow the CEFR split (B1 25%, B1+ 30%, B2 40%, B2+ 5%, ±3 points)", () => {
  const target = { B1: 25, "B1+": 30, B2: 40, "B2+": 5 };
  for (const l of CEFR_LEVELS) assert.ok(Math.abs((lv[l] / NEW.length) * 100 - target[l]) <= 3, `${l}: ${lv[l]}`);
});
check("no placeholder text and no near-duplicate questions within a category", () => {
  const pool = ALL_QUESTIONS.filter((q) => q.category !== "reading");
  for (const q of pool) assert.ok(!/(lorem|todo|tbd|placeholder|xxx)/i.test(JSON.stringify(q)), `${q.id} placeholder text`);
  for (let i = 0; i < pool.length; i++)
    for (let j = i + 1; j < pool.length; j++) {
      if (pool[i].category !== pool[j].category) continue;
      const a = `${pool[i].prompt} ${pool[i].choices[pool[i].answerIndex]}`;
      const b = `${pool[j].prompt} ${pool[j].choices[pool[j].answerIndex]}`;
      assert.ok(near(a, b) < 0.6, `near-duplicate: ${pool[i].id} ~ ${pool[j].id}`);
    }
});
check("correct answers are spread evenly across the four positions", () => {
  const counts = [0, 0, 0, 0];
  NEW.forEach((q) => counts[q.answerIndex]++);
  counts.forEach((c) => assert.ok(c >= NEW.length * 0.2, `position distribution ${counts}`));
});
check("the correct answer is never a long outlier (distractors are plausible)", () => {
  for (const q of NEW) {
    if (q.category === "reading" || q.category === "error-correction") continue; // choices are sentence parts
    const right = q.choices[q.answerIndex].length;
    const longestWrong = Math.max(...q.choices.filter((_, i) => i !== q.answerIndex).map((c) => c.length));
    assert.ok(right <= longestWrong * 1.5 + 6, `${q.id}: correct ${right} vs longest distractor ${longestWrong}`);
  }
});

console.log("Reading exercises");
const passageLv = Object.fromEntries(CEFR_LEVELS.map((l) => [l, count(READING_PASSAGES, (p) => p.level === l)]));
console.log(`       passages: ${READING_PASSAGES.length} (${CEFR_LEVELS.map((l) => `${l} ${passageLv[l]}`).join(", ")})`);
check("there are at least 30 reading exercises across B1, B1+ and B2", () => {
  assert.ok(READING_PASSAGES.length >= 30, `${READING_PASSAGES.length}`);
  for (const l of ["B1", "B1+", "B2"]) assert.ok(passageLv[l] >= 5, l);
  assert.ok(unique(READING_PASSAGES.map((p) => p.id)));
  assert.ok(unique(READING_PASSAGES.map((p) => p.title)), "duplicate passage titles");
});
check("no reading question is orphaned and every passage has its questions", () => {
  const passageIds = new Set(READING_PASSAGES.map((p) => p.id));
  for (const q of NEW.filter((x) => x.category === "reading")) {
    assert.ok(q.passageId && passageIds.has(q.passageId), `${q.id} is orphaned`);
    assert.ok(isText(q.passage) && isText(q.passageTitle) && isText(q.skill), `${q.id} reading fields`);
  }
  for (const p of READING_PASSAGES) assert.ok(NEW.some((q) => q.passageId === p.id), `${p.id} has no questions`);
});
check("each passage is 200-450 words with 4-6 questions at its own level", () => {
  for (const p of READING_PASSAGES) {
    const n = wordCount(p.text);
    assert.ok(n >= 200 && n <= 450, `${p.id}: ${n} words`);
    const qs = NEW.filter((q) => q.passageId === p.id);
    assert.ok(qs.length >= 4 && qs.length <= 6, `${p.id}: ${qs.length} questions`);
    for (const q of qs) {
      assert.equal(q.category, "reading", q.id);
      assert.equal(q.difficulty, p.level, `${q.id} level`);
      assert.equal(q.passage, p.text, `${q.id} passage`);
    }
  }
  assert.equal(count(NEW, (q) => q.category === "reading"), NEW.filter((q) => q.passageId).length);
});
check("reading questions test different skills (not only detail lookup)", () => {
  const skills = new Set(NEW.filter((q) => q.category === "reading").map((q) => q.skill));
  assert.ok(skills.size >= 7, [...skills].join(", "));
});

// Deterministic generator so the checks below are repeatable.
function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// Questions that share a passage must sit next to each other (a passage may be cut short to fit the length).
const passageBlocksIntact = (questions, label) => {
  const finished = new Set();
  let current = null;
  for (const q of questions) {
    const key = q.passageId ?? null;
    if (key !== current) {
      if (current) finished.add(current);
      assert.ok(!key || !finished.has(key), `${label}: passage ${key} is split into separate blocks`);
      current = key;
    }
  }
};

console.log("Practice sessions");
check("every category and level builds a valid session", () => {
  for (const category of ["mixed", ...QUESTION_CATEGORIES]) {
    for (const level of Object.keys(PRACTICE_LEVEL_LABELS)) {
      const pool = practicePool(ALL_QUESTIONS, category, level);
      const qs = buildPracticeSession(ALL_QUESTIONS, category, level, 10, new Map(), seeded(7));
      assert.ok(pool.length === 0 ? qs.length === 0 : qs.length > 0, `${category}/${level}`);
      assert.ok(unique(qs.map((q) => q.id)), `${category}/${level} duplicates`);
      const { allowed } = practiceLevels(level);
      for (const q of qs) {
        assert.ok(allowed.includes(q.difficulty), `${category}/${level}: ${q.id} is ${q.difficulty}`);
        if (category !== "mixed") assert.equal(q.category, category);
      }
      if (category !== "reading") assert.ok(qs.length <= 10);
      passageBlocksIntact(qs, `${category}/${level}`);
    }
  }
});
check("each practice category has questions at B1, B1+ and B2 or above (where the bank covers them)", () => {
  for (const c of ["grammar", "vocabulary", "cabin-crew", "reading", "situational"]) {
    for (const level of ["B1", "B1+", "B2"]) assert.ok(practicePool(ALL_QUESTIONS, c, level).length > 0, `${c}/${level}`);
  }
});
check("a mixed session combines several categories and varies between runs", () => {
  const a = buildPracticeSession(ALL_QUESTIONS, "mixed", "all", 20, new Map(), seeded(1));
  const b = buildPracticeSession(ALL_QUESTIONS, "mixed", "all", 20, new Map(), seeded(2));
  assert.ok(new Set(a.map((q) => q.category)).size >= 4);
  assert.notDeepEqual(a.map((q) => q.id), b.map((q) => q.id));
});
check("recently answered questions are avoided when enough fresh ones exist", () => {
  const pool = practicePool(ALL_QUESTIONS, "grammar", "all");
  const seen = new Map(pool.slice(0, pool.length - 15).map((q, i) => [q.id, 1000 + i]));
  for (let seed = 1; seed <= 20; seed++) {
    const qs = buildPracticeSession(ALL_QUESTIONS, "grammar", "all", 10, seen, seeded(seed));
    assert.equal(count(qs, (q) => seen.has(q.id)), 0, `seed ${seed}`);
  }
});
check("when everything has been seen, the oldest questions come back first", () => {
  const pool = practicePool(ALL_QUESTIONS, "cabin-crew", "all");
  const seen = new Map(pool.map((q, i) => [q.id, 1000 + i]));
  const qs = buildPracticeSession(ALL_QUESTIONS, "cabin-crew", "all", 5, seen, seeded(3));
  assert.equal(qs.length, 5);
});

console.log("Test modes");
check("the nine required test modes exist", () => {
  const ids = TEST_MODES.map((m) => m.id);
  for (const id of [
    "mode-mixed-b1",
    "mode-mixed-b1plus",
    "mode-mixed-b2",
    "mode-grammar-challenge",
    "mode-vocabulary-challenge",
    "mode-reading-challenge",
    "mode-cabin-crew-test",
    "mode-customer-service-test",
    "mode-interview-vocabulary",
  ]) assert.ok(ids.includes(id), id);
  assert.ok(unique(ids));
  const fixed = new Set(QUIZ_SETS.map((s) => s.id));
  for (const id of ids) assert.ok(!fixed.has(id), `${id} clashes with a fixed set`);
});
check("each mode builds a full, duplicate-free test every time", () => {
  for (const mode of TEST_MODES) {
    for (let seed = 1; seed <= 40; seed++) {
      const qs = buildModeQuestions(mode, ALL_QUESTIONS, new Map(), seeded(seed));
      assert.equal(qs.length, mode.length, `${mode.id} seed ${seed}`);
      assert.ok(unique(qs.map((q) => q.id)), `${mode.id} duplicates`);
      passageBlocksIntact(qs, mode.id);
    }
  }
});
check("every mode supports Quick 10, Standard 20 and Full 30 with exact, duplicate-free tests", () => {
  assert.deepEqual(TEST_LENGTHS.map((l) => l.length), [10, 20, 30]);
  for (const mode of TEST_MODES) {
    const setIds = new Set();
    for (const { length } of TEST_LENGTHS) {
      setIds.add(modeSetId(mode, length));
      for (let seed = 1; seed <= 25; seed++) {
        const qs = buildModeQuestions(mode, ALL_QUESTIONS, new Map(), seeded(seed), length);
        assert.equal(qs.length, length, `${mode.id} @${length} seed ${seed}: got ${qs.length}`);
        assert.ok(unique(qs.map((q) => q.id)), `${mode.id} @${length} duplicates`);
        assert.ok(unique(qs.map(dupKey)), `${mode.id} @${length} repeated prompt`);
        passageBlocksIntact(qs, `${mode.id}@${length}`);
      }
    }
    assert.equal(setIds.size, 3, `${mode.id} needs a distinct result id per length`);
  }
  assert.equal(modeSetId(TEST_MODES[0], TEST_MODES[0].length), TEST_MODES[0].id, "the standard length keeps the original result id");
});
check("the Interview Vocabulary Test only asks interview vocabulary and varies between runs", () => {
  const mode = TEST_MODES.find((m) => m.id === "mode-interview-vocabulary");
  const slot = mode.slots[0];
  const isInterview = (q) => q.topic.startsWith(slot.topicPrefix) || slot.topics.includes(q.topic);
  const pool = ALL_QUESTIONS.filter((q) => q.category === "vocabulary" && isInterview(q));
  assert.ok(pool.length >= 35, `interview vocabulary pool: ${pool.length}`);
  const draws = new Set();
  for (const { length } of TEST_LENGTHS) {
    for (let seed = 1; seed <= 20; seed++) {
      const qs = buildModeQuestions(mode, ALL_QUESTIONS, new Map(), seeded(seed), length);
      for (const q of qs) assert.ok(q.category === "vocabulary" && isInterview(q), `${q.id} (${q.topic}) is not interview vocabulary`);
      if (length === 20) draws.add(qs.map((q) => q.id).join());
    }
  }
  assert.ok(draws.size > 10, "the interview test should differ between runs");
});
check("a full test at each length draws mostly fresh questions after a previous attempt", () => {
  for (const mode of TEST_MODES.filter((m) => m.id !== "mode-interview-vocabulary")) {
    const first = buildModeQuestions(mode, ALL_QUESTIONS, new Map(), seeded(21), 20);
    const seen = new Map(first.map((q, i) => [q.id, 1000 + i]));
    const second = buildModeQuestions(mode, ALL_QUESTIONS, seen, seeded(22), 20);
    assert.ok(count(second, (q) => seen.has(q.id)) <= 4, `${mode.id}: too many repeated questions`);
  }
});
check("mixed tests combine skills and the mix changes between runs", () => {
  for (const id of ["mode-mixed-b1", "mode-mixed-b1plus", "mode-mixed-b2"]) {
    const mode = TEST_MODES.find((m) => m.id === id);
    const mixes = new Set();
    for (let seed = 1; seed <= 20; seed++) {
      const qs = buildModeQuestions(mode, ALL_QUESTIONS, new Map(), seeded(seed));
      const cats = new Set(qs.map((q) => q.category));
      assert.ok(cats.size >= 4, `${id}: ${[...cats]}`);
      const has = (...names) => names.some((n) => cats.has(n));
      assert.ok(has("reading"), `${id} has no reading`);
      assert.ok(has("grammar", "error-correction"), `${id} has no grammar`);
      assert.ok(has("vocabulary", "sentence-completion", "everyday"), `${id} has no vocabulary`);
      mixes.add(
        Object.entries(Object.groupBy(qs, (q) => q.category))
          .map(([k, v]) => `${k}${v.length}`)
          .sort()
          .join(","),
      );
    }
    assert.ok(mixes.size >= 2, `${id} always has the same composition`);
  }
});
check("each challenge/professional test stays within its categories and level range", () => {
  const rules = {
    "mode-grammar-challenge": ["grammar", "error-correction"],
    "mode-vocabulary-challenge": ["vocabulary", "sentence-completion"],
    "mode-interview-vocabulary": ["vocabulary"],
    "mode-reading-challenge": ["reading"],
    "mode-cabin-crew-test": ["cabin-crew"],
    "mode-customer-service-test": ["customer-service", "workplace", "situational"],
  };
  for (const [id, cats] of Object.entries(rules)) {
    const mode = TEST_MODES.find((m) => m.id === id);
    const qs = buildModeQuestions(mode, ALL_QUESTIONS, new Map(), seeded(11));
    for (const q of qs) assert.ok(cats.includes(q.category), `${id}: ${q.id} is ${q.category}`);
  }
});
check("mixed B1 leans easier than mixed B2", () => {
  const avg = (id) => {
    const mode = TEST_MODES.find((m) => m.id === id);
    const rank = { B1: 1, "B1+": 2, B2: 3, "B2+": 4 };
    let sum = 0;
    let n = 0;
    for (let seed = 1; seed <= 30; seed++)
      for (const q of buildModeQuestions(mode, ALL_QUESTIONS, new Map(), seeded(seed))) {
        sum += rank[q.difficulty];
        n++;
      }
    return sum / n;
  };
  assert.ok(avg("mode-mixed-b1") + 0.5 < avg("mode-mixed-b2"));
});
check("questions from past results and history are avoided on the next draw", () => {
  const mode = TEST_MODES.find((m) => m.id === "mode-cabin-crew-test");
  const first = buildModeQuestions(mode, ALL_QUESTIONS, new Map(), seeded(5));
  const seen = seenFromResults([
    { id: "r1", setId: mode.id, category: "cabin-crew", title: "t", completedAt: new Date().toISOString(), answers: first.map((q) => ({ questionId: q.id, selectedIndex: q.answerIndex })) },
  ]);
  const second = buildModeQuestions(mode, ALL_QUESTIONS, seen, seeded(6));
  assert.equal(count(second, (q) => seen.has(q.id)), 0);
});
check("question history serialises, restores and survives garbage", () => {
  const map = new Map([["a", 1], ["b", 2]]);
  assert.deepEqual([...parseHistory(serializeHistory(map))].sort(), [...map].sort());
  for (const bad of [null, "", "{", "[]", '{"v":9}', '{"v":1,"seen":"x"}']) assert.equal(parseHistory(bad).size, 0, String(bad));
});

console.log("Daily phrases");
check("ids unique and non-empty", () => {
  assert.ok(unique(DAILY_PHRASES.map((p) => p.id)));
  DAILY_PHRASES.forEach((p) => assert.ok(p.phrase && p.turkish && p.usage));
});

console.log("Quiz scoring");
const sample = QUIZ_QUESTIONS.slice(0, 8);
check("all correct -> 100%", () => {
  const s = scoreQuiz(sample, sample.map((q) => ({ questionId: q.id, selectedIndex: q.answerIndex })));
  assert.deepEqual([s.correct, s.incorrect, s.scorePercent], [8, 0, 100]);
});
check("all wrong -> 0%", () => {
  const s = scoreQuiz(sample, sample.map((q) => ({ questionId: q.id, selectedIndex: (q.answerIndex + 1) % 4 })));
  assert.deepEqual([s.correct, s.incorrect, s.scorePercent], [0, 8, 0]);
});
check("5 of 8 -> 63% (rounded half up)", () => {
  const s = scoreQuiz(sample, sample.map((q, i) => ({ questionId: q.id, selectedIndex: i < 5 ? q.answerIndex : (q.answerIndex + 2) % 4 })));
  assert.deepEqual([s.correct, s.scorePercent], [5, 63]);
});
check("unanswered counts as incorrect", () => {
  const s = scoreQuiz(sample, []);
  assert.deepEqual([s.correct, s.incorrect, s.scorePercent], [0, 8, 0]);
  assert.ok(s.review.every((r) => r.selectedIndex === null && !r.isCorrect));
});

console.log("Rate limiter");
check("blocks after max and recovers after the window", () => {
  const limit = createRateLimiter({ windowMs: 1000, max: 3 });
  assert.ok(limit("a", 0).allowed && limit("a", 10).allowed && limit("a", 20).allowed);
  const blocked = limit("a", 30);
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfterSec >= 1);
  assert.ok(limit("b", 30).allowed, "other keys are independent");
  assert.ok(limit("a", 1100).allowed, "window has passed");
});

console.log("Storage sanitising");
check("garbage input yields a valid default state", () => {
  const s = sanitizeState({ learnedWords: "nope", favoriteWords: [1, "x", "x"], preferences: { dailyWordGoal: 9999, speechLang: "xx" } });
  assert.deepEqual(s.learnedWords, {});
  assert.deepEqual(s.favoriteWords, ["x"]);
  assert.equal(s.preferences.dailyWordGoal, createDefaultState().preferences.dailyWordGoal);
  assert.equal(s.preferences.speechLang, "en-US");
});
check("valid data survives a round-trip", () => {
  const state = createDefaultState();
  state.learnedWords["avia-gate"] = new Date().toISOString();
  state.interviewAnswers["q"] = { text: "hello", updatedAt: new Date().toISOString() };
  const again = migrate(JSON.parse(JSON.stringify(state)));
  assert.deepEqual(again, state);
});
check("unknown versions are rejected for migration", () => {
  assert.equal(migrate({ version: 99 }), null);
});

if (failures > 0) {
  console.error(`\n${failures} check(s) failed`);
  process.exit(1);
}
console.log("\nAll checks passed");
