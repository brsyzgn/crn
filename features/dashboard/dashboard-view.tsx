"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  Gauge,
  MessagesSquare,
  Mic,
  Quote,
  Settings,
  Sparkles,
  Target,
} from "lucide-react";
import { DashboardStatCard } from "@/components/dashboard-stat-card";
import { EmptyState } from "@/components/empty-state";
import {
  BoardingPassIllustration,
  ConversationIllustration,
  FlashCardsIllustration,
} from "@/components/illustrations";
import { LoadingState } from "@/components/loading-state";
import { PageHeader } from "@/components/page-header";
import { ProgressRing } from "@/components/progress-ring";
import { Reveal } from "@/components/reveal";
import { SpeakButton } from "@/components/speak-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DAILY_PHRASES } from "@/data/phrases";
import { useProgress } from "@/hooks/use-progress";
import { computeStats, type ActivityType } from "@/lib/stats";
import { cn, dayNumber, formatRelative, pluralize } from "@/lib/utils";

const ACTIVITY_ICONS: Record<ActivityType, typeof BookOpen> = {
  word: BookOpen,
  interview: Mic,
  answer: Mic,
  quiz: ClipboardCheck,
  ai: MessagesSquare,
};

const QUICK_LINKS = [
  { href: "/vocabulary", label: "Vocabulary", icon: BookOpen },
  { href: "/interview", label: "Interview Practice", icon: Mic },
  { href: "/practice", label: "AI Practice", icon: MessagesSquare },
  { href: "/tests", label: "Mini Tests", icon: ClipboardCheck },
  { href: "/progress", label: "Progress", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function DashboardView() {
  const { progress, hydrated } = useProgress();

  if (!hydrated) {
    return (
      <>
        <PageHeader title="Good to see you, Ceren! ✈️" description="Let’s take one step closer to your dream today." />
        <LoadingState />
      </>
    );
  }

  const now = new Date();
  const stats = computeStats(progress, now);
  const goal = progress.preferences.dailyWordGoal;
  const phrase = DAILY_PHRASES[dayNumber(now) % DAILY_PHRASES.length];

  const checklist = [
    {
      id: "words",
      label: `Learn ${goal} new ${pluralize(goal, "word")}`,
      progress: `${Math.min(stats.today.words, goal)} / ${goal}`,
      done: stats.today.words >= goal,
      href: "/vocabulary",
    },
    {
      id: "interview",
      label: "Practice 1 interview question",
      progress: `${Math.min(stats.today.interview, 1)} / 1`,
      done: stats.today.interview >= 1,
      href: "/interview",
    },
    {
      id: "quiz",
      label: "Complete 1 mini test",
      progress: `${Math.min(stats.today.quizzes, 1)} / 1`,
      done: stats.today.quizzes >= 1,
      href: "/tests",
    },
  ];
  const completed = checklist.filter((c) => c.done).length;
  const allDone = completed === checklist.length;

  return (
    <>
      <Reveal>
        <PageHeader
          eyebrow="Dashboard"
          title="Good to see you, Ceren! ✈️"
          description="Let’s take one step closer to your dream today."
          actions={
            <Card className="flex items-center gap-4 px-4 py-3">
              <ProgressRing
                value={completed}
                max={checklist.length}
                size={56}
                strokeWidth={7}
                label={`Daily goal: ${completed} of ${checklist.length} tasks completed`}
              >
                {completed}/{checklist.length}
              </ProgressRing>
              <div>
                <p className="text-sm font-semibold text-plum">Daily goal</p>
                <p className="text-xs text-muted-strong">
                  {completed} of {checklist.length} completed today
                </p>
              </div>
            </Card>
          }
        />
      </Reveal>

      {/* Module cards */}
      <section aria-label="Start learning" className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Cabin Crew Interview Practice",
            text: "Real practice questions, model answers and tips.",
            cta: "Start Practice",
            href: "/interview",
            art: <BoardingPassIllustration className="h-full w-full object-cover" />,
            primary: false,
          },
          {
            title: "Daily Vocabulary",
            text: "Flashcards for aviation, service and everyday life.",
            cta: "Study Words",
            href: "/vocabulary",
            art: <FlashCardsIllustration className="h-full w-full object-cover" />,
            primary: true,
          },
          {
            title: "AI Conversation",
            text: "Practise with written feedback whenever you like.",
            cta: "Start Chat",
            href: "/practice",
            art: <ConversationIllustration className="h-full w-full object-cover" />,
            primary: true,
          },
        ].map((card, i) => (
          <Reveal key={card.title} delay={0.05 * (i + 1)}>
            <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lift">
              <div className="aspect-[16/8] overflow-hidden" aria-hidden="true">
                {card.art}
              </div>
              <CardContent className="pt-5">
                <h2 className="font-display text-lg font-semibold leading-snug text-plum">{card.title}</h2>
                <p className="mt-1 text-sm text-muted-strong">{card.text}</p>
                <Button asChild className="mt-4" variant={card.primary ? "default" : "dark"} size="sm">
                  <Link href={card.href}>
                    {card.cta} <ArrowRight />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </section>

      {/* Stats */}
      <section aria-labelledby="progress-heading" className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="progress-heading" className="font-display text-xl font-semibold text-plum">
            Your progress
          </h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/progress">View details</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-4">
          <DashboardStatCard
            icon={BookOpen}
            tone="rose"
            label="Words learned"
            value={`${stats.wordsLearned}`}
            hint={`of ${stats.totalWords} words`}
          />
          <DashboardStatCard
            icon={CheckCircle2}
            tone="success"
            label="Quizzes completed"
            value={`${stats.quizAttempts}`}
          />
          <DashboardStatCard
            icon={Mic}
            tone="lilac"
            label="Interview questions practiced"
            value={`${stats.questionsPracticed}`}
            hint={stats.savedAnswers > 0 ? `${stats.savedAnswers} saved ${pluralize(stats.savedAnswers, "answer")}` : undefined}
          />
          <DashboardStatCard
            icon={Gauge}
            tone="sky"
            label="Average quiz score"
            value={stats.averageScore === null ? "–" : `${stats.averageScore}%`}
            hint={stats.averageScore === null ? "Take a test to see this" : undefined}
          />
        </div>
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          {/* Today's goal */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-rose-deep">
                <Target className="size-4" aria-hidden="true" />
                <span className="text-xs font-semibold uppercase tracking-[0.12em]">Today’s learning goal</span>
              </div>
              <CardTitle className="text-xl">
                Learn {goal} new {pluralize(goal, "word")}
              </CardTitle>
              <CardDescription>
                You have learned {stats.today.words} {pluralize(stats.today.words, "word")} today.{" "}
                <Link href="/settings" className="font-semibold text-rose-deep underline-offset-4 hover:underline">
                  Change goal
                </Link>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress
                value={Math.min(stats.today.words, goal)}
                max={goal}
                label="Words learned today toward your daily goal"
                className="mb-6 h-2.5"
              />
              <h3 className="mb-3 text-sm font-semibold text-plum">Daily study checklist</h3>
              <ul className="space-y-2">
                {checklist.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition-colors",
                        item.done
                          ? "border-success/25 bg-success-soft/60"
                          : "border-border-soft bg-white hover:border-blush hover:bg-rose-light",
                      )}
                    >
                      {item.done ? (
                        <CheckCircle2 className="size-5 shrink-0 text-success" aria-hidden="true" />
                      ) : (
                        <Circle className="size-5 shrink-0 text-muted" aria-hidden="true" />
                      )}
                      <span className={cn("flex-1 font-medium", item.done ? "text-plum" : "text-plum")}>
                        {item.label}
                        <span className="sr-only">{item.done ? " (done)" : " (not done yet)"}</span>
                      </span>
                      <span className="text-xs font-semibold text-muted-strong">{item.progress}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              {allDone && (
                <p className="mt-4 rounded-2xl bg-success-soft px-4 py-3 text-sm font-medium text-success">
                  You finished today’s plan, Ceren. Well done!
                </p>
              )}
            </CardContent>
          </Card>

          {/* Recent activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent learning activity</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.recent.length === 0 ? (
                <EmptyState
                  icon={Sparkles}
                  title="Your learning story starts here"
                  description="Learn a word, practice a question or take a quiz, and it will show up here."
                  action={
                    <Button asChild size="sm">
                      <Link href="/vocabulary">Learn your first word</Link>
                    </Button>
                  }
                />
              ) : (
                <ul className="divide-y divide-border-soft">
                  {stats.recent.map((item) => {
                    const Icon = ACTIVITY_ICONS[item.type];
                    return (
                      <li key={item.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                        <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-rose text-rose-deep">
                          <Icon className="size-4" aria-hidden="true" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-plum">{item.title}</p>
                          {item.detail && (
                            <p className="truncate text-xs text-muted-strong">{item.detail}</p>
                          )}
                        </div>
                        <time dateTime={item.at} className="shrink-0 text-xs text-muted-strong">
                          {formatRelative(item.at, now)}
                        </time>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Phrase of the day */}
          <Card className="overflow-hidden bg-linear-to-br from-rose-light to-white">
            <CardHeader>
              <div className="flex items-center gap-2 text-rose-deep">
                <Quote className="size-4" aria-hidden="true" />
                <span className="text-xs font-semibold uppercase tracking-[0.12em]">Today’s English phrase</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-display text-2xl font-semibold leading-snug text-plum">“{phrase.phrase}”</p>
              <p className="mt-3 text-sm text-plum-soft">{phrase.turkish}</p>
              <p className="mt-2 text-xs text-muted-strong">{phrase.usage}</p>
              <div className="mt-4">
                <SpeakButton text={phrase.phrase} label="Listen to today’s phrase" />
              </div>
            </CardContent>
          </Card>

          {/* Quick navigation */}
          <Card>
            <CardHeader>
              <CardTitle>Quick navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-2 gap-2.5">
                {QUICK_LINKS.map(({ href, label, icon: Icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="flex h-full min-h-14 items-center gap-2.5 rounded-2xl border border-border-soft bg-white px-3.5 py-2.5 text-sm font-medium text-plum transition-colors hover:border-blush hover:bg-rose-light"
                    >
                      <Icon className="size-4 shrink-0 text-rose-deep" aria-hidden="true" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
