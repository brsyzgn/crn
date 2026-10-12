import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardStatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  tone?: "rose" | "success" | "lilac" | "sky" | "sand";
}

const TONES = {
  rose: "bg-rose text-rose-deep",
  success: "bg-success-soft text-success",
  lilac: "bg-lilac text-plum-soft",
  sky: "bg-sky text-plum-soft",
  sand: "bg-sand text-plum-soft",
} as const;

export function DashboardStatCard({ label, value, hint, icon: Icon, tone = "rose" }: DashboardStatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-3xl border border-border-soft bg-white/90 p-4 shadow-soft sm:p-5">
      <span className={cn("grid size-12 shrink-0 place-items-center rounded-2xl", TONES[tone])}>
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="font-display text-2xl font-semibold leading-none text-plum">{value}</p>
        <p className="mt-1.5 text-[13px] font-medium text-muted-strong">{label}</p>
        {hint && <p className="mt-0.5 text-xs text-muted-strong">{hint}</p>}
      </div>
    </div>
  );
}
