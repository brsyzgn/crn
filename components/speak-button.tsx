"use client";

import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/hooks/use-progress";
import { useSpeech } from "@/hooks/use-speech";

/** Pronounce text with the browser's speech synthesis. Hidden when unsupported. */
export function SpeakButton({ text, label, className }: { text: string; label?: string; className?: string }) {
  const { progress } = useProgress();
  const { supported, speak } = useSpeech(progress.preferences.speechLang);
  if (!supported) return null;
  return (
    <Button
      variant="soft"
      size="icon-sm"
      className={className}
      aria-label={label ?? `Listen: ${text}`}
      onClick={(e) => {
        e.stopPropagation();
        speak(text);
      }}
    >
      <Volume2 />
    </Button>
  );
}
