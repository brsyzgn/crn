import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  label: string;
  className?: string;
  barClassName?: string;
}

/** Accessible linear progress bar. */
export function Progress({ value, max = 100, label, className, barClassName }: ProgressProps) {
  const pct = max === 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-rose", className)}
    >
      <div
        className={cn("h-full rounded-full bg-blush transition-[width] duration-500 ease-out", barClassName)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
