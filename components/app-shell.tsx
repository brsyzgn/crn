"use client";

import { TriangleAlert } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { MobileNavigation } from "@/components/mobile-navigation";
import { useProgress } from "@/hooks/use-progress";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { storageAvailable, hydrated } = useProgress();

  return (
    <div className="bg-ambient min-h-dvh md:flex">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-plum focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        {hydrated && !storageAvailable && (
          <div
            role="alert"
            className="flex items-start gap-2.5 border-b border-danger/20 bg-danger-soft px-4 py-2.5 text-sm text-danger sm:px-8"
          >
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <p>
              Your browser is blocking local storage, so progress can&apos;t be saved after you close this tab.
              Everything else still works.
            </p>
          </div>
        )}
        <main
          id="main"
          className="mx-auto w-full max-w-6xl flex-1 px-4 pb-32 pt-6 sm:px-6 md:pb-12 lg:px-10 lg:pt-10"
        >
          {children}
        </main>
        <footer className="px-4 pb-28 text-center text-xs text-muted-strong md:pb-8">
          Made especially for Ceren ♡
        </footer>
      </div>
      <MobileNavigation />
    </div>
  );
}
