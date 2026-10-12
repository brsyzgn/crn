"use client";

import {
  ArrowLeft,
  ArrowRight,
  BookCheck,
  CheckCircle2,
  RotateCw,
  Search,
  Star,
  Volume2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { PageHeader } from "@/components/page-header";
import { useToast } from "@/components/toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { CategoryFilter, SegmentedControl } from "@/components/category-filter";
import { VOCABULARY } from "@/data/vocabulary";
import { useProgress } from "@/hooks/use-progress";
import { useSpeech } from "@/hooks/use-speech";
import { cn } from "@/lib/utils";
import { VOCABULARY_CATEGORIES, type VocabularyCategory } from "@/types";
import { VocabularyFlashcard } from "./vocabulary-flashcard";

type DeckMode = "all" | "todo" | "learned" | "favorites";

const MODES: { id: DeckMode; label: string; ariaLabel?: string; icon?: React.ReactNode }[] = [
  { id: "all", label: "All", ariaLabel: "All words" },
  { id: "todo", label: "To learn" },
  { id: "learned", label: "Learned" },
  { id: "favorites", label: "Favorites" },
];

export function VocabularyView() {
  const { progress, hydrated, actions } = useProgress();
  const toast = useToast();
  const { supported: speechSupported, speak, prefetch } = useSpeech(progress.preferences.speechLang);

  const [mode, setMode] = useState<DeckMode>("all");
  const [category, setCategory] = useState<VocabularyCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [flippedId, setFlippedId] = useState<string | null>(null);

  const learnedSet = progress.learnedWords;
  const favoriteSet = useMemo(() => new Set(progress.favoriteWords), [progress.favoriteWords]);

  const deck = useMemo(() => {
    const q = query.trim().toLowerCase();
    return VOCABULARY.filter((w) => {
      if (category !== "all" && w.category !== category) return false;
      if (mode === "todo" && w.id in learnedSet) return false;
      if (mode === "learned" && !(w.id in learnedSet)) return false;
      if (mode === "favorites" && !favoriteSet.has(w.id)) return false;
      if (q && !(w.word.toLowerCase().includes(q) || w.turkish.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [category, mode, query, learnedSet, favoriteSet]);

  // Words per category under the current status and search (what the dropdown shows next to each category).
  const { categoryCounts, categoryTotal } = useMemo(() => {
    const q = query.trim().toLowerCase();
    const counts: Record<string, number> = {};
    let total = 0;
    for (const w of VOCABULARY) {
      if (mode === "todo" && w.id in learnedSet) continue;
      if (mode === "learned" && !(w.id in learnedSet)) continue;
      if (mode === "favorites" && !favoriteSet.has(w.id)) continue;
      if (q && !(w.word.toLowerCase().includes(q) || w.turkish.toLowerCase().includes(q))) continue;
      counts[w.category] = (counts[w.category] ?? 0) + 1;
      total += 1;
    }
    return { categoryCounts: counts, categoryTotal: total };
  }, [mode, query, learnedSet, favoriteSet]);

  const safeIndex = deck.length === 0 ? 0 : Math.min(index, deck.length - 1);
  const current = deck[safeIndex];

  const go = (delta: number) => {
    if (deck.length === 0) return;
    setIndex((safeIndex + delta + deck.length) % deck.length);
  };

  // Arrow keys move between cards unless the user is typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Download the pronunciation of the visible word and its neighbours ahead of time, so tapping the
  // speaker plays immediately instead of waiting for the audio to be generated.
  const currentWord = current?.word;
  const nextWord = deck.length > 1 ? deck[(safeIndex + 1) % deck.length].word : undefined;
  const prevWord = deck.length > 2 ? deck[(safeIndex - 1 + deck.length) % deck.length].word : undefined;
  useEffect(() => {
    if (!currentWord) return;
    const t = window.setTimeout(() => {
      prefetch(currentWord);
      if (nextWord) prefetch(nextWord);
      if (prevWord) prefetch(prevWord);
    }, 150);
    return () => window.clearTimeout(t);
  }, [currentWord, nextWord, prevWord, prefetch]);

  if (!hydrated) {
    return (
      <>
        <PageHeader title="Vocabulary" description="Learn the key words for cabin crew interviews and daily communication." />
        <LoadingState rows={2} label="Loading vocabulary…" />
      </>
    );
  }

  const learnedCount = VOCABULARY.filter((w) => w.id in learnedSet).length;
  const isLearned = current ? current.id in learnedSet : false;
  const isFavorite = current ? favoriteSet.has(current.id) : false;
  const flipped = current ? flippedId === current.id : false;

  const changeMode = (m: DeckMode) => {
    setMode(m);
    setIndex(0);
  };
  const changeCategory = (c: VocabularyCategory | "all") => {
    setCategory(c);
    setIndex(0);
  };

  const emptyCopy: Record<DeckMode, { title: string; description: string }> = {
    all: { title: "No words match your search", description: "Try a different word or clear the filters." },
    todo: { title: "Nothing left to learn here", description: "You have learned every word in this selection. Great work, Ceren!" },
    learned: { title: "No learned words yet", description: "Mark a word as learned and it will appear here for review." },
    favorites: { title: "No favorite words yet", description: "Tap the star on any card to keep a word handy." },
  };

  return (
    <>
      <PageHeader
        eyebrow="Vocabulary"
        title="Words for the cabin and beyond"
        description={`${VOCABULARY.length} B1 to B2+ words and phrases for cabin crew interviews and daily communication.`}
      />

      {/* Progress summary */}
      <Card className="mb-6 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl bg-success-soft text-success">
            <BookCheck className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-xl font-semibold leading-none text-plum">
              {learnedCount} <span className="text-sm font-medium text-muted-strong">/ {VOCABULARY.length} learned</span>
            </p>
            <p className="mt-1 text-xs text-muted-strong">{progress.favoriteWords.length} favorites</p>
          </div>
        </div>
        <Progress
          value={learnedCount}
          max={VOCABULARY.length}
          label="Vocabulary learned"
          className="h-2.5 w-full sm:flex-1"
        />
      </Card>

      {/* Filters */}
      <div className="mb-5 space-y-2.5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <Input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            placeholder="Search in English or Turkish…"
            aria-label="Search vocabulary"
            className="pl-11 pr-11"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setIndex(0);
              }}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muted-strong hover:bg-rose-light"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {/* Category: what kind of vocabulary */}
          <div className="flex w-full min-w-0 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2">
            <span id="vocab-category-label" className="shrink-0 text-xs font-medium text-muted-strong sm:w-[4.25rem]">
              Categories
            </span>
            <CategoryFilter
              categories={VOCABULARY_CATEGORIES}
              value={category}
              onChange={changeCategory}
              counts={categoryCounts}
              total={categoryTotal}
              listLabel="Vocabulary categories"
            />
          </div>

          {/* Status: learning state, with the number of words currently shown */}
          <div className="flex w-full min-w-0 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2">
            <span id="vocab-status-label" className="shrink-0 text-xs font-medium text-muted-strong sm:w-[4.25rem]">
              Status
            </span>
            <SegmentedControl
              value={mode}
              onChange={changeMode}
              labelledBy="vocab-status-label"
              options={MODES.map((m) =>
                m.id === "favorites"
                  ? {
                      ...m,
                      icon: (
                        <Star
                          className={cn("size-3.5 shrink-0", mode === "favorites" && "fill-blush text-rose-deep")}
                          aria-hidden="true"
                        />
                      ),
                    }
                  : m,
              )}
            />
            <p className="text-sm text-muted-strong sm:ml-3 sm:text-[13px]" aria-live="polite">
              {deck.length} {deck.length === 1 ? "word" : "words"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Flashcard */}
        <section aria-label="Flashcards" className="min-w-0">
          {!current ? (
            <EmptyState
              icon={Search}
              title={emptyCopy[mode].title}
              description={emptyCopy[mode].description}
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setQuery("");
                    setCategory("all");
                    setMode("all");
                    setIndex(0);
                  }}
                >
                  Reset filters
                </Button>
              }
            />
          ) : (
            <div>
              <div className="mb-3 flex items-center justify-between text-sm text-muted-strong">
                <span aria-live="polite">
                  Card <strong className="text-plum">{safeIndex + 1}</strong> of {deck.length}
                </span>
                <span className="text-xs">Use ← → keys to move</span>
              </div>

              <VocabularyFlashcard
                entry={current}
                flipped={flipped}
                learned={isLearned}
                onFlip={() => setFlippedId(flipped ? null : current.id)}
              />

              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                <Button variant="outline" size="icon" onClick={() => go(-1)} aria-label="Previous word">
                  <ArrowLeft />
                </Button>
                <Button variant="soft" onClick={() => setFlippedId(flipped ? null : current.id)} aria-pressed={flipped}>
                  <RotateCw /> {flipped ? "Show word" : "Show meaning"}
                </Button>
                <Button variant="outline" size="icon" onClick={() => go(1)} aria-label="Next word">
                  <ArrowRight />
                </Button>

                <div className="ml-auto flex items-center gap-2.5">
                  {speechSupported && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => speak(current.word)}
                      aria-label={`Hear pronunciation of ${current.word}`}
                    >
                      <Volume2 />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    aria-pressed={isFavorite}
                    aria-label={isFavorite ? `Remove ${current.word} from favorites` : `Add ${current.word} to favorites`}
                    onClick={() => {
                      const now = actions.toggleFavorite(current.id);
                      toast(now ? "Added to favorites" : "Removed from favorites", "info");
                    }}
                  >
                    <Star className={cn(isFavorite && "fill-blush text-rose-deep")} />
                  </Button>
                </div>
              </div>

              <Button
                size="lg"
                variant={isLearned ? "soft" : "default"}
                className="mt-4 w-full"
                aria-pressed={isLearned}
                onClick={() => {
                  const now = actions.toggleLearned(current.id);
                  toast(now ? `“${current.word}” marked as learned` : `“${current.word}” moved back to your to-learn list`);
                }}
              >
                <CheckCircle2 /> {isLearned ? "Learned — tap to undo" : "Mark as learned"}
              </Button>
            </div>
          )}
        </section>

        {/* Word list */}
        <section aria-label="Word list" className="min-w-0">
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-border-soft px-5 py-3.5">
              <h2 className="font-display text-base font-semibold text-plum">Word list</h2>
              <span className="text-xs text-muted-strong">{deck.length} shown</span>
            </div>
            {deck.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-muted-strong">No words to show.</p>
            ) : (
              <ul className="max-h-[32rem] divide-y divide-border-soft overflow-y-auto">
                {deck.map((w, i) => (
                  <li key={w.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setIndex(i);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      aria-current={i === safeIndex ? "true" : undefined}
                      className={cn(
                        "flex min-h-14 w-full items-center gap-3 px-5 py-2.5 text-left transition-colors hover:bg-rose-light",
                        i === safeIndex && "bg-rose-light",
                      )}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-plum">{w.word}</span>
                        <span className="block truncate text-xs text-muted-strong">{w.turkish}</span>
                      </span>
                      {favoriteSet.has(w.id) && (
                        <Star className="size-4 shrink-0 fill-blush text-rose-deep" aria-label="Favorite" />
                      )}
                      {w.id in learnedSet && (
                        <CheckCircle2 className="size-4 shrink-0 text-success" aria-label="Learned" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>
      </div>
    </>
  );
}
