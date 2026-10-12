"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import { useEffect } from "react";
import { ToastProvider } from "@/components/toast";
import { useProgress } from "@/hooks/use-progress";

/** Applies the reduced-motion preference to both CSS and the motion library. */
export function Providers({ children }: { children: React.ReactNode }) {
  const { progress } = useProgress();
  const motion = progress.preferences.motion;

  useEffect(() => {
    document.documentElement.dataset.motion = motion === "system" ? "" : motion;
  }, [motion]);

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig
        reducedMotion={motion === "reduce" ? "always" : motion === "full" ? "never" : "user"}
      >
        <ToastProvider>{children}</ToastProvider>
      </MotionConfig>
    </LazyMotion>
  );
}
