import Link from "next/link";
import { Plane } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-blush to-blush-soft text-plum shadow-[0_8px_18px_-8px_rgb(233_134_165/0.9)]",
        className,
      )}
    >
      <Plane className="size-5 -rotate-12" strokeWidth={2.2} />
    </span>
  );
}

export function Brand({
  href = "/",
  compact = false,
  className,
}: {
  href?: string;
  compact?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label="Ceren's English Club home"
      className={cn("flex items-center gap-3 rounded-2xl", className)}
    >
      <BrandMark />
      {!compact && (
        <span className="font-display text-[17px] font-semibold leading-tight tracking-tight text-plum">
          Ceren&apos;s
          <br />
          <span className="text-[13px] font-medium text-muted-strong">English Club</span>
        </span>
      )}
    </Link>
  );
}
