import type { InterviewRow } from "./helpers.ts";
import { ROWS_A } from "./rows-a.ts";
import { ROWS_B } from "./rows-b.ts";
import { ROWS_C } from "./rows-c.ts";
import { ROWS_D } from "./rows-d.ts";
import { ROWS_E } from "./rows-e.ts";
import { ROWS_F } from "./rows-f.ts";
import { ROWS_G } from "./rows-g.ts";
import { ROWS_H } from "./rows-h.ts";

/** The expanded interview rows (120 questions) in authoring order. */
export const INTERVIEW_ROWS: readonly InterviewRow[] = [
  ...ROWS_A,
  ...ROWS_B,
  ...ROWS_C,
  ...ROWS_D,
  ...ROWS_E,
  ...ROWS_F,
  ...ROWS_G,
  ...ROWS_H,
];
