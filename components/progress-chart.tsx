import type { CategoryScore, DailyPoint } from "@/lib/stats";

export const ACTIVITY_SERIES = [
  { key: "words", label: "Words learned", color: "#e986a5" },
  { key: "interview", label: "Interview practice", color: "#8d79b8" },
  { key: "quizzes", label: "Quizzes", color: "#6fb59a" },
  { key: "ai", label: "AI practice", color: "#f0b27a" },
] as const;

/** Stacked bar chart of the last 7 days of real activity. */
export function ProgressChart({ data }: { data: DailyPoint[] }) {
  const width = 560;
  const height = 230;
  const pad = { top: 16, right: 12, bottom: 32, left: 30 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const rawMax = Math.max(...data.map((d) => d.total), 0);
  const max = Math.max(4, Math.ceil(rawMax / 2) * 2);
  const step = innerW / data.length;
  const barW = Math.min(36, step * 0.55);
  const ticks = [0, max / 2, max];

  return (
    <figure>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label="Bar chart of learning activity over the last 7 days"
      >
        {ticks.map((t) => {
          const y = pad.top + innerH - (t / max) * innerH;
          return (
            <g key={t}>
              <line x1={pad.left} x2={width - pad.right} y1={y} y2={y} stroke="#f0dde4" strokeDasharray={t === 0 ? undefined : "4 5"} />
              <text x={pad.left - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#6a5f67">
                {t}
              </text>
            </g>
          );
        })}
        {data.map((d, i) => {
          const x = pad.left + i * step + (step - barW) / 2;
          let acc = 0;
          return (
            <g key={d.date}>
              {ACTIVITY_SERIES.map((s) => {
                const v = d[s.key];
                if (v === 0) return null;
                const h = (v / max) * innerH;
                const y = pad.top + innerH - ((acc + v) / max) * innerH;
                acc += v;
                return <rect key={s.key} x={x} y={y} width={barW} height={Math.max(h - 1.5, 2)} rx={4} fill={s.color} />;
              })}
              <text x={x + barW / 2} y={height - 10} textAnchor="middle" fontSize="12" fill="#6a5f67">
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-strong">
        {ACTIVITY_SERIES.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: s.color }} aria-hidden="true" />
            {s.label}
          </span>
        ))}
      </figcaption>
      <table className="sr-only">
        <caption>Learning activity for the last 7 days</caption>
        <thead>
          <tr>
            <th>Day</th>
            {ACTIVITY_SERIES.map((s) => (
              <th key={s.key}>{s.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.date}>
              <td>{d.date}</td>
              {ACTIVITY_SERIES.map((s) => (
                <td key={s.key}>{d[s.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  vocabulary: "#e986a5",
  grammar: "#8d79b8",
  reading: "#6fb59a",
  "cabin-crew": "#f0b27a",
};

/** Horizontal bars with the real average score per quiz category. */
export function CategoryScoreChart({ scores }: { scores: CategoryScore[] }) {
  return (
    <ul className="space-y-4">
      {scores.map((s) => (
        <li key={s.category}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
            <span className="font-medium text-plum">{s.label}</span>
            <span className="text-xs text-muted-strong">
              {s.average === null ? "Not taken yet" : `${s.average}% avg · ${s.attempts} ${s.attempts === 1 ? "attempt" : "attempts"}`}
            </span>
          </div>
          <div
            role="progressbar"
            aria-label={`${s.label} average score`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={s.average ?? 0}
            className="h-2.5 overflow-hidden rounded-full bg-rose-light"
          >
            <div
              className="h-full rounded-full transition-[width] duration-700 ease-out"
              style={{ width: `${s.average ?? 0}%`, backgroundColor: CATEGORY_COLORS[s.category] }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
