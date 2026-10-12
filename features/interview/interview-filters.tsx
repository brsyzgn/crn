"use client";

import { CategoryFilter, SegmentedControl } from "@/components/category-filter";
import { INTERVIEW_CATEGORIES, type InterviewCategory } from "@/types";

export type CategoryValue = InterviewCategory | "all";
export type StatusValue = "all" | "todo" | "practiced";

interface CategoryDropdownProps {
  value: CategoryValue;
  onChange: (value: CategoryValue) => void;
  /** Number of questions per category under the current status filter. */
  counts: Readonly<Record<string, number>>;
  total: number;
}

/** Interview Practice category picker (shared CategoryFilter with the interview categories). */
export function CategoryDropdown({ value, onChange, counts, total }: CategoryDropdownProps) {
  return (
    <CategoryFilter
      categories={INTERVIEW_CATEGORIES}
      value={value}
      onChange={onChange}
      counts={counts}
      total={total}
      listLabel="Interview categories"
    />
  );
}

const STATUS_OPTIONS: readonly { id: StatusValue; label: string }[] = [
  { id: "all", label: "All" },
  { id: "todo", label: "Not practiced" },
  { id: "practiced", label: "Practiced" },
];

/** A compact segmented control for the practice status. */
export function StatusSegments({ value, onChange }: { value: StatusValue; onChange: (value: StatusValue) => void }) {
  return <SegmentedControl value={value} onChange={onChange} options={STATUS_OPTIONS} groupLabel="Practice status" />;
}
