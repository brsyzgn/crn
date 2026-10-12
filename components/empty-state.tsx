import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-3xl border border-dashed border-blush/60 bg-white/60 px-6 py-10 text-center",
        className,
      )}
    >
      <span className="mb-4 grid size-14 place-items-center rounded-2xl bg-rose text-rose-deep">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <h3 className="font-display text-lg font-semibold text-plum">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-strong">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
