"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { VocabularyEntry } from "@/types";

interface VocabularyFlashcardProps {
  entry: VocabularyEntry;
  flipped: boolean;
  learned: boolean;
  onFlip: () => void;
}

/** A two-sided flashcard with a 3D flip. The hidden face is removed from the accessibility tree. */
export function VocabularyFlashcard({ entry, flipped, learned, onFlip }: VocabularyFlashcardProps) {
  return (
    <div className="flip-scene">
      <div
        className="flip-card grid cursor-pointer"
        data-flipped={flipped}
        onClick={onFlip}
        // Keyboard users flip with the dedicated button; this click target is a mouse/touch convenience.
      >
        {/* Front */}
        <div
          aria-hidden={flipped}
          className={cn(
            "flip-face flex min-h-[19rem] flex-col items-center justify-center rounded-[2rem] border border-border-soft bg-linear-to-br from-white to-rose-light p-8 text-center shadow-soft [grid-area:1/1] sm:min-h-[21rem]",
            learned && "ring-2 ring-success/40",
          )}
        >
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
            <Badge>{entry.category}</Badge>
            <Badge variant="outline">{entry.level}</Badge>
            {learned && <Badge variant="success">Learned</Badge>}
          </div>
          <p className="font-display text-4xl font-semibold leading-tight tracking-tight text-plum sm:text-5xl">
            {entry.word}
          </p>
          <p className="mt-3 text-sm italic text-muted-strong">{entry.partOfSpeech}</p>
          <p className="mt-8 text-xs font-medium text-muted-strong">Tap the card to see the meaning</p>
        </div>

        {/* Back */}
        <div
          aria-hidden={!flipped}
          className="flip-face flip-back flex min-h-[19rem] flex-col justify-center rounded-[2rem] border border-border-soft bg-white p-6 shadow-soft [grid-area:1/1] sm:min-h-[21rem] sm:p-8"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rose-deep">Turkish</p>
          <p className="mt-1 font-display text-3xl font-semibold leading-snug text-plum">{entry.turkish}</p>
          <div className="my-5 h-px bg-border-soft" />
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rose-deep">Example</p>
          <p className="mt-1 text-[17px] leading-relaxed text-plum">{entry.example}</p>
          {entry.collocations && entry.collocations.length > 0 && (
            <p className="mt-3 text-sm leading-relaxed text-plum-soft">
              <span className="font-semibold text-rose-deep">Often used: </span>
              {entry.collocations.join(" · ")}
            </p>
          )}
          {entry.turkishNote && (
            <p className="mt-4 rounded-2xl bg-rose-light px-4 py-3 text-sm leading-relaxed text-plum-soft">
              <span className="font-semibold">Not: </span>
              {entry.turkishNote}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
