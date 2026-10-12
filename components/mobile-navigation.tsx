"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MOBILE_PRIMARY_HREFS, NAV_ITEMS, isActivePath } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function MobileNavigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const primary = NAV_ITEMS.filter((i) => (MOBILE_PRIMARY_HREFS as readonly string[]).includes(i.href));
  const more = NAV_ITEMS.filter((i) => !(MOBILE_PRIMARY_HREFS as readonly string[]).includes(i.href));
  const moreActive = more.some((i) => isActivePath(pathname, i.href));

  const itemClass = (active: boolean) =>
    cn(
      "flex min-h-14 flex-1 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-semibold transition-colors",
      active ? "text-rose-deep" : "text-muted-strong",
    );

  return (
    <nav
      aria-label="Primary"
      className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-border-soft bg-white/95 px-2 pt-1.5 backdrop-blur-md md:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch">
        {primary.map(({ href, short, icon: Icon }) => {
          const active = isActivePath(pathname, href);
          return (
            <li key={href} className="flex flex-1">
              <Link href={href} aria-current={active ? "page" : undefined} className={itemClass(active)}>
                <span className={cn("grid h-8 w-12 place-items-center rounded-full transition-colors", active && "bg-rose")}>
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                {short}
              </Link>
            </li>
          );
        })}
        <li className="flex flex-1">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button type="button" className={itemClass(moreActive)} aria-label="More pages">
                <span className={cn("grid h-8 w-12 place-items-center rounded-full transition-colors", moreActive && "bg-rose")}>
                  <MoreHorizontal className="size-5" aria-hidden="true" />
                </span>
                More
              </button>
            </DialogTrigger>
            <DialogContent variant="sheet">
              <DialogTitle>More</DialogTitle>
              <DialogDescription>Jump to another part of Ceren&apos;s English Club.</DialogDescription>
              <ul className="mt-5 grid gap-2">
                {more.map(({ href, label, icon: Icon }) => {
                  const active = isActivePath(pathname, href);
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex h-14 items-center gap-3 rounded-2xl border px-4 text-[15px] font-semibold",
                          active ? "border-blush bg-rose text-plum" : "border-border-soft bg-white text-plum",
                        )}
                      >
                        <Icon className="size-5 text-rose-deep" aria-hidden="true" />
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </DialogContent>
          </Dialog>
        </li>
      </ul>
    </nav>
  );
}
