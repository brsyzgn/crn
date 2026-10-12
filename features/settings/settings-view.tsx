"use client";

import { Database, Gauge, Languages, Sparkles, Trash2, Volume2 } from "lucide-react";
import { useId, useState } from "react";
import { LoadingState } from "@/components/loading-state";
import { PageHeader } from "@/components/page-header";
import { useToast } from "@/components/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useProgress } from "@/hooks/use-progress";
import { useSpeech } from "@/hooks/use-speech";
import { STORAGE_KEY } from "@/lib/storage";
import { cn } from "@/lib/utils";
import type { MotionPreference, SpeechLang } from "@/types";

const GOALS = [3, 5, 10, 15, 20];

function RadioCards<T extends string | number>({
  name,
  legend,
  value,
  options,
  onChange,
}: {
  name: string;
  legend: string;
  value: T;
  options: { value: T; label: string; hint?: string }[];
  onChange: (v: T) => void;
}) {
  const uid = useId();
  return (
    <fieldset>
      <legend className="sr-only">{legend}</legend>
      <div className="flex flex-wrap gap-2.5">
        {options.map((o) => {
          const id = `${uid}-${name}-${o.value}`;
          return (
            <div key={String(o.value)}>
              <input
                id={id}
                type="radio"
                name={`${uid}-${name}`}
                checked={value === o.value}
                onChange={() => onChange(o.value)}
                className="peer sr-only"
              />
              <label
                htmlFor={id}
                className={cn(
                  "flex min-h-12 min-w-16 cursor-pointer flex-col items-center justify-center rounded-2xl border border-border-soft bg-white px-4 py-2 text-center text-sm font-semibold text-muted-strong transition-colors hover:border-blush",
                  "peer-checked:border-blush peer-checked:bg-rose peer-checked:text-plum peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-rose-deep",
                )}
              >
                {o.label}
                {o.hint && <span className="text-xs font-normal">{o.hint}</span>}
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}

export function SettingsView() {
  const { progress, hydrated, storageAvailable, actions } = useProgress();
  const toast = useToast();
  const { supported, speak } = useSpeech(progress.preferences.speechLang);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!hydrated) {
    return (
      <>
        <PageHeader title="Settings" description="Personalize your experience." />
        <LoadingState rows={2} />
      </>
    );
  }

  const prefs = progress.preferences;
  const bytes = new Blob([JSON.stringify(progress)]).size;
  const counts = {
    learned: Object.keys(progress.learnedWords).length,
    favorites: progress.favoriteWords.length,
    answers: Object.keys(progress.interviewAnswers).length,
    practiced: Object.keys(progress.practicedQuestions).length,
    quizzes: progress.quizResults.length,
    ai: progress.aiPractice.length,
  };

  return (
    <>
      <PageHeader
        eyebrow="Settings"
        title="Preferences"
        description="Make the club work the way you like. No personal information is needed."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="size-5 text-rose-deep" aria-hidden="true" /> Daily learning goal
            </CardTitle>
            <CardDescription>How many new words would you like to learn each day?</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioCards
              name="goal"
              legend="Daily word goal"
              value={prefs.dailyWordGoal}
              options={GOALS.map((g) => ({ value: g, label: `${g}`, hint: "words" }))}
              onChange={(v) => {
                actions.setPreferences({ dailyWordGoal: v });
                toast(`Daily goal set to ${v} words`);
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="size-5 text-rose-deep" aria-hidden="true" /> Pronunciation
            </CardTitle>
            <CardDescription>Choose the English accent used when words are read aloud.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioCards<SpeechLang>
              name="speech"
              legend="Speech language"
              value={prefs.speechLang}
              options={[
                { value: "en-US", label: "American", hint: "en-US" },
                { value: "en-GB", label: "British", hint: "en-GB" },
              ]}
              onChange={(v) => {
                actions.setPreferences({ speechLang: v });
                toast(`Pronunciation set to ${v === "en-US" ? "American" : "British"} English`);
              }}
            />
            {supported ? (
              <Button variant="outline" size="sm" onClick={() => speak("Welcome aboard. How may I help you today?")}>
                <Volume2 /> Test the voice
              </Button>
            ) : (
              <p className="rounded-2xl bg-sand px-4 py-3 text-sm text-plum">
                Your browser does not support speech synthesis, so pronunciation buttons are hidden.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-5 text-rose-deep" aria-hidden="true" /> Motion
            </CardTitle>
            <CardDescription>Reduce animations if they feel distracting.</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioCards<MotionPreference>
              name="motion"
              legend="Reduced motion"
              value={prefs.motion}
              options={[
                { value: "system", label: "Match my device" },
                { value: "reduce", label: "Reduce motion" },
                { value: "full", label: "Full animations" },
              ]}
              onChange={(v) => {
                actions.setPreferences({ motion: v });
                toast("Motion preference saved");
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="size-5 text-rose-deep" aria-hidden="true" /> Your data on this device
            </CardTitle>
            <CardDescription>
              {storageAvailable
                ? "Progress is saved in this browser only. There are no accounts and nothing is uploaded."
                : "Your browser is blocking local storage, so progress is only kept until you close this tab."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {[
                ["Learned words", counts.learned],
                ["Favorite words", counts.favorites],
                ["Saved answers", counts.answers],
                ["Practiced questions", counts.practiced],
                ["Quiz results", counts.quizzes],
                ["AI practice replies", counts.ai],
              ].map(([label, n]) => (
                <div key={label} className="flex items-baseline justify-between gap-2 border-b border-border-soft py-1.5">
                  <dt className="text-muted-strong">{label}</dt>
                  <dd className="font-semibold text-plum">{n}</dd>
                </div>
              ))}
            </dl>
            <ul className="mt-4 list-disc space-y-1.5 pl-5 text-xs leading-relaxed text-muted-strong">
              <li>
                Stored under the key <code className="rounded bg-rose-light px-1 py-0.5">{STORAGE_KEY}</code> in LocalStorage
                (about {bytes < 1024 ? `${bytes} bytes` : `${(bytes / 1024).toFixed(1)} KB`}).
              </li>
              <li>Clearing your browser data also clears this progress.</li>
              <li>
                AI practice messages are sent to the server only when you press send. They are not saved in this app.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-danger/25">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-danger">
            <Trash2 className="size-5" aria-hidden="true" /> Reset progress
          </CardTitle>
          <CardDescription>
            Delete learned words, favorites, saved answers, quiz history and activity from this device. Your preferences
            are kept. This cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-danger/40 text-danger hover:bg-danger-soft">
                <Trash2 /> Reset all progress…
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Reset all progress?</DialogTitle>
              <DialogDescription>
                This will permanently delete everything you have learned and saved in this browser. Are you sure,
                Ceren?
              </DialogDescription>
              <div className="mt-6 flex flex-wrap justify-end gap-2.5">
                <DialogClose asChild>
                  <Button variant="outline">Keep my progress</Button>
                </DialogClose>
                <Button
                  variant="danger"
                  onClick={() => {
                    actions.resetProgress();
                    setConfirmOpen(false);
                    toast("Progress reset. A fresh start!", "info");
                  }}
                >
                  Yes, reset everything
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </>
  );
}
