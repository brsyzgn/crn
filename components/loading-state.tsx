import { cn } from "@/lib/utils";

/** Skeleton shown while saved progress is read from the browser after hydration. */
export function LoadingState({
  label = "Loading your progress…",
  rows = 3,
  className,
}: {
  label?: string;
  rows?: number;
  className?: string;
}) {
  return (
    <div role="status" aria-live="polite" className={cn("space-y-4", className)}>
      <span className="sr-only">{label}</span>
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          className="h-28 animate-shimmer rounded-3xl border border-border-soft bg-white/70"
          style={{ animationDelay: `${i * 120}ms` }}
        />
      ))}
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent",
        className,
      )}
    />
  );
}
