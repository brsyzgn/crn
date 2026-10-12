"use client";

import { AnimatePresence, m } from "motion/react";
import { Check, ChevronDown, Search } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const ALL_LABEL = "All categories";

interface CategoryFilterProps<T extends string> {
  /** Every selectable category (the "All categories" row is added automatically). */
  categories: readonly T[];
  value: T | "all";
  onChange: (value: T | "all") => void;
  /** Number of items per category under the current filters. */
  counts: Readonly<Record<string, number>>;
  /** Number of items across all categories under the current filters. */
  total: number;
  /** Accessible name of the list, e.g. "Interview categories". */
  listLabel: string;
}

/**
 * A compact category picker: a button that opens a searchable list (listbox pattern).
 * Focus stays in the search field while the list is open and the highlighted row is announced
 * through aria-activedescendant. Escape, Tab and outside clicks close it.
 *
 * Shared by Interview Practice and Vocabulary; each page owns its own category data and state.
 */
export function CategoryFilter<T extends string>({
  categories,
  value,
  onChange,
  counts,
  total,
  listLabel,
}: CategoryFilterProps<T>) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const uid = useId();
  const listId = `${uid}-list`;

  const allOptions = useMemo<(T | "all")[]>(() => ["all", ...categories], [categories]);
  const labelOf = (o: T | "all") => (o === "all" ? ALL_LABEL : o);
  const countOf = (o: T | "all") => (o === "all" ? total : (counts[o] ?? 0));

  const options = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allOptions.filter((o) => q === "" || (o === "all" ? ALL_LABEL : o).toLowerCase().includes(q));
  }, [query, allOptions]);

  const optionId = (index: number) => `${uid}-opt-${index}`;

  const close = (returnFocus: boolean) => {
    setOpen(false);
    setQuery("");
    if (returnFocus) triggerRef.current?.focus();
  };

  const openList = () => {
    setQuery("");
    setActive(Math.max(0, allOptions.indexOf(value)));
    setOpen(true);
  };

  const select = (o: T | "all") => {
    onChange(o);
    close(true);
  };

  // Move focus into the search field when the list opens.
  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  // Close on a click or tap outside the control.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) close(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Keep the highlighted row visible.
  useEffect(() => {
    if (!open) return;
    document.getElementById(optionId(active))?.scrollIntoView({ block: "nearest" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, open, options]);

  const safeActive = options.length === 0 ? -1 : Math.min(active, options.length - 1);

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (options.length) setActive((safeActive + 1) % options.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        if (options.length) setActive((safeActive - 1 + options.length) % options.length);
        break;
      case "Enter":
        e.preventDefault();
        if (safeActive >= 0) select(options[safeActive]);
        break;
      case "Escape":
        e.preventDefault();
        e.stopPropagation();
        close(true);
        break;
      case "Tab":
        close(false);
        break;
    }
  };

  const selected = value !== "all";

  return (
    <div ref={rootRef} className="relative w-full sm:w-72">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={`Category: ${labelOf(value)}. Change category`}
        onClick={() => (open ? close(false) : openList())}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !open) {
            e.preventDefault();
            openList();
          }
        }}
        className={cn(
          "flex h-11 w-full items-center justify-between gap-3 rounded-full border bg-white px-4 text-left text-sm font-medium shadow-soft transition-colors hover:border-blush focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-deep",
          selected || open ? "border-blush text-plum" : "border-border-soft text-plum",
          selected && "bg-rose-light",
        )}
      >
        <span className="truncate">{labelOf(value)}</span>
        <ChevronDown
          className={cn("size-4 shrink-0 text-rose-deep transition-transform duration-150", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            key="panel"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 top-full z-30 mt-2 w-full overflow-hidden rounded-2xl border border-border-soft bg-white shadow-lift sm:w-[22rem] sm:max-w-[calc(100vw-2rem)]"
          >
            <div className="border-b border-border-soft p-2.5">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
                  aria-hidden="true"
                />
                <input
                  ref={searchRef}
                  type="text"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls={listId}
                  aria-autocomplete="list"
                  aria-activedescendant={safeActive >= 0 ? optionId(safeActive) : undefined}
                  aria-label="Search categories"
                  placeholder="Search categories..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActive(0);
                  }}
                  onKeyDown={onSearchKeyDown}
                  autoComplete="off"
                  spellCheck={false}
                  className="h-10 w-full rounded-xl border border-border-soft bg-cream pl-9 pr-3 text-base text-plum placeholder:text-muted-strong/70 focus-visible:border-blush focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-rose-deep/60 sm:text-sm"
                />
              </div>
            </div>

            <ul id={listId} role="listbox" aria-label={listLabel} className="max-h-72 overflow-y-auto p-1.5">
              {options.length === 0 && (
                <li role="presentation" className="px-3 py-6 text-center text-sm text-muted-strong">
                  No categories found
                </li>
              )}
              {options.map((o, i) => {
                const isSelected = o === value;
                const isActive = i === safeActive;
                return (
                  <li
                    key={o}
                    id={optionId(i)}
                    role="option"
                    aria-selected={isSelected}
                    onPointerDown={(e) => e.preventDefault()}
                    onClick={() => select(o)}
                    onMouseMove={() => setActive(i)}
                    className={cn(
                      "flex min-h-10 cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors",
                      isSelected ? "bg-rose font-semibold text-plum" : "text-plum-soft",
                      isActive && !isSelected && "bg-rose-light text-plum",
                    )}
                  >
                    <span className="min-w-0 flex-1 truncate">{labelOf(o)}</span>
                    <span className="shrink-0 text-xs tabular-nums text-muted-strong">{countOf(o)}</span>
                    <Check
                      className={cn("size-4 shrink-0 text-rose-deep", isSelected ? "opacity-100" : "opacity-0")}
                      aria-hidden="true"
                    />
                  </li>
                );
              })}
            </ul>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface SegmentedOption<T extends string> {
  id: T;
  label: string;
  ariaLabel?: string;
  icon?: React.ReactNode;
}

/** A compact pill-shaped segmented control (a group of toggle buttons with aria-pressed). */
export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  groupLabel,
  labelledBy,
}: {
  value: T;
  onChange: (value: T) => void;
  options: readonly SegmentedOption<T>[];
  groupLabel?: string;
  labelledBy?: string;
}) {
  return (
    <div
      role="group"
      aria-label={groupLabel}
      aria-labelledby={labelledBy}
      className="inline-flex w-full rounded-full border border-border-soft bg-white/70 p-1 sm:w-auto"
    >
      {options.map((s) => (
        <button
          key={s.id}
          type="button"
          aria-pressed={value === s.id}
          aria-label={s.ariaLabel}
          onClick={() => onChange(s.id)}
          className={cn(
            "inline-flex h-9 min-w-0 flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-full px-2 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-rose-deep sm:flex-none sm:gap-1.5 sm:px-4 sm:text-sm",
            value === s.id ? "bg-rose text-plum shadow-sm" : "text-muted-strong hover:text-plum",
          )}
        >
          {s.icon}
          {s.label}
        </button>
      ))}
    </div>
  );
}
