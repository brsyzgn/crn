import type { QuestionExtras } from "@/types";

const LABELS: { key: keyof QuestionExtras; label: string }[] = [
  { key: "rule", label: "Grammar rule" },
  { key: "phrase", label: "Useful phrase" },
  { key: "note", label: "Vocabulary note" },
  { key: "whyNot", label: "Why the others don't fit" },
];

/** Optional teaching notes shown under an explanation (grammar rule, useful phrase, why the others are wrong). */
export function QuestionExtrasList({ extras }: { extras?: QuestionExtras }) {
  if (!extras) return null;
  const items = LABELS.filter(({ key }) => extras[key]);
  if (items.length === 0) return null;
  return (
    <dl className="mt-3 space-y-1.5 border-t border-plum/10 pt-3 text-[13px] leading-relaxed text-plum-soft">
      {items.map(({ key, label }) => (
        <div key={key}>
          <dt className="inline font-semibold text-plum">{label}: </dt>
          <dd className="inline">{extras[key]}</dd>
        </div>
      ))}
    </dl>
  );
}
