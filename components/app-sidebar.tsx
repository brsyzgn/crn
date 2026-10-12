"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { Brand } from "@/components/brand";
import { useProgress } from "@/hooks/use-progress";
import { NAV_ITEMS, isActivePath } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/**
 * Desktop/tablet navigation. On tablets (md) it is always an icon rail; on
 * large screens it can be collapsed or expanded, and the choice is persisted.
 */
export function AppSidebar() {
  const pathname = usePathname();
  const { progress, actions } = useProgress();
  const collapsed = progress.preferences.sidebarCollapsed;

  return (
    <aside
      aria-label="Primary"
      className={cn(
        "sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-border-soft bg-white/70 px-3 py-5 backdrop-blur-md transition-[width] duration-300 md:flex md:w-[76px]",
        collapsed ? "lg:w-[76px]" : "lg:w-64 lg:px-4",
      )}
    >
      <div className={cn("mb-8 px-1", !collapsed && "lg:px-2")}>
        <div className="lg:hidden">
          <Brand href="/dashboard" compact />
        </div>
        <div className="hidden lg:block">
          <Brand href="/dashboard" compact={collapsed} />
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActivePath(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              title={label}
              className={cn(
                "group flex h-11 items-center gap-3 rounded-2xl px-3.5 text-sm font-medium transition-colors",
                active
                  ? "bg-rose text-plum shadow-[inset_0_0_0_1px_rgb(233_134_165/0.35)]"
                  : "text-muted-strong hover:bg-rose-light hover:text-plum",
              )}
            >
              <Icon
                className={cn("size-[18px] shrink-0", active ? "text-rose-deep" : "text-muted group-hover:text-rose-deep")}
                aria-hidden="true"
              />
              <span className={cn("truncate", collapsed ? "sr-only" : "sr-only lg:not-sr-only")}>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3">
        <p className={cn("hidden px-3 text-xs text-muted-strong", !collapsed && "lg:block")}>
          Made especially for Ceren ♡
        </p>
        <button
          type="button"
          onClick={() => actions.setPreferences({ sidebarCollapsed: !collapsed })}
          aria-pressed={collapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden h-10 w-full items-center gap-3 rounded-2xl px-3.5 text-sm text-muted-strong transition-colors hover:bg-rose-light hover:text-plum lg:flex"
        >
          {collapsed ? (
            <ChevronsRight className="size-[18px]" aria-hidden="true" />
          ) : (
            <>
              <ChevronsLeft className="size-[18px]" aria-hidden="true" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
