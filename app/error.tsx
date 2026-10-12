"use client";

import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="bg-ambient grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <span className="mx-auto mb-6 grid size-16 place-items-center rounded-3xl bg-danger-soft text-danger">
          <TriangleAlert className="size-7" aria-hidden="true" />
        </span>
        <h1 className="font-display text-3xl font-semibold text-plum">Something went wrong</h1>
        <p className="mx-auto mt-3 max-w-sm text-muted-strong">
          An unexpected error occurred. Your saved progress is safe. Please try again.
        </p>
        <Button className="mt-7" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}
