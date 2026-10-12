"use client";

import { CheckCircle2, Info, TriangleAlert } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type ToastKind = "success" | "info" | "error";
interface ToastItem {
  id: number;
  message: string;
  kind: ToastKind;
}

const ToastContext = createContext<(message: string, kind?: ToastKind) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastItem | null>(null);
  const counter = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((message: string, kind: ToastKind = "success") => {
    counter.current += 1;
    setToast({ id: counter.current, message, kind });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const Icon = toast?.kind === "error" ? TriangleAlert : toast?.kind === "info" ? Info : CheckCircle2;

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4 md:bottom-8"
      >
        {toast && (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex max-w-sm items-center gap-2.5 rounded-full border bg-white px-4 py-2.5 text-sm font-medium text-plum shadow-lift",
              toast.kind === "error" ? "border-danger/40" : "border-border-soft",
            )}
          >
            <Icon
              className={cn(
                "size-4 shrink-0",
                toast.kind === "error" ? "text-danger" : toast.kind === "info" ? "text-muted-strong" : "text-success",
              )}
              aria-hidden="true"
            />
            {toast.message}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}
