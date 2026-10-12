"use client";

import Link from "next/link";
import {
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Gauge,
  Lock,
  MessagesSquare,
  Mic,
  Sprout,
} from "lucide-react";
import { DashboardStatCard } from "@/components/dashboard-stat-card";
import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { PageHeader } from "@/components/page-header";
import { CategoryScoreChart, ProgressChart } from "@/components/progress-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProgress } from "@/hooks/use-progress";
import { computeStats, type ActivityType } from "@/lib/stats";
import { formatRelative, pluralize } from "@/lib/utils";

const ICONS: Record<ActivityType, typeof BookOpen> = {
  word: BookOpen,
  interview: Mic,
  answer: Mic,
  quiz: ClipboardCheck,
  ai: MessagesSquare,
};

export function ProgressView() {
  const { progress, hydrated } = useProgress();

  if (!hydrated) {
    return (
      <>
        <PageHeader title="Your progress" description="Keep going, you’re doing great." />
        <LoadingState />
      </>
    );
  }

  const now = new Date();
  const stats = computeStats(progress, now);
  const unlocked = stats.achievements
    .filter((a) => a.unlockedAt !== null)
    .sort((a, b) => (b.unlockedAt ?? "").localeCompare(a.unlockedAt ?? ""));
  const locked = stats.achievements.filter((a) => a.unlockedAt === null);
  const weekTotal = stats.daily.reduce((s, d) => s + d.total, 0);

  return (
    <>
      <PageHeader
        eyebrow="Progress"
        title="Your learning progress"
        description="Everything here comes from what you have actually done in this app on this device."
      />

      {!stats.hasActivity ? (
        <EmptyState
          icon={Sprout}
          title="Your progress will grow here"
          description="You haven’t started yet, and that’s perfectly fine. Learn a word, practice an interview question or take a quick test, and your progress will appear."
          action={
            <div className="flex flex-wrap justify-center gap-2.5">
              <Button asChild size="sm">
                <Link href="/vocabulary">Learn a word</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/interview">Practice a question</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/tests">Take a test</Link>
              </Button>
            </div>
          }
          className="mb-10"
        />
      ) : (
        <>
          <section aria-label="Summary" className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-4">
            <DashboardStatCard icon={BookOpen} tone="rose" label="Words learned" value={`${stats.wordsLearned}`} hint={`of ${stats.totalWords}`} />
            <DashboardStatCard icon={ClipboardCheck} tone="success" label="Quiz attempts" value={`${stats.quizAttempts}`} />
            <DashboardStatCard
              icon={Gauge}
              tone="sky"
              label="Average quiz score"
              value={stats.averageScore === null ? "–" : `${stats.averageScore}%`}
              hint={stats.averageScore === null ? "No tests yet" : undefined}
            />
            <DashboardStatCard
              icon={Mic}
              tone="lilac"
              label="Interview questions practiced"
              value={`${stats.questionsPracticed}`}
              hint={`${stats.savedAnswers} saved ${pluralize(stats.savedAnswers, "answer")}`}
            />
          </section>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <Card>
              <CardHeader>
                <CardTitle>Daily activity</CardTitle>
                <CardDescription>
                  {weekTotal === 0
                    ? "No activity in the last 7 days."
                    : `${weekTotal} learning ${weekTotal === 1 ? "action" : "actions"} in the last 7 days.`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProgressChart data={stats.daily} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quiz scores by topic</CardTitle>
                <CardDescription>Average of all your attempts.</CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryScoreChart scores={stats.categoryScores} />
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent achievements</CardTitle>
            <CardDescription>
              {unlocked.length} of {stats.achievements.length} unlocked
            </CardDescription>
          </CardHeader>
          <CardContent>
            {unlocked.length === 0 ? (
              <p className="rounded-2xl bg-rose-light px-4 py-4 text-sm text-plum-soft">
                Your first achievement is just one word away.
              </p>
            ) : (
              <ul className="space-y-2.5">
                {unlocked.slice(0, 6).map((a) => (
                  <li key={a.id} className="flex items-center gap-3 rounded-2xl bg-success-soft/60 px-4 py-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-success">
                      <Award className="size-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-plum">{a.title}</p>
                      <p className="text-xs text-muted-strong">{a.description}</p>
                    </div>
                    {a.unlockedAt && (
                      <time dateTime={a.unlockedAt} className="shrink-0 text-xs text-muted-strong">
                        {formatRelative(a.unlockedAt, now)}
                      </time>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {locked.length > 0 && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-semibold text-rose-deep">
                  Goals ahead ({locked.length})
                </summary>
                <ul className="mt-3 space-y-2">
                  {locked.map((a) => (
                    <li key={a.id} className="flex items-center gap-3 rounded-2xl border border-border-soft px-4 py-2.5">
                      <Lock className="size-4 shrink-0 text-muted" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-medium text-plum">{a.title}</p>
                        <p className="text-xs text-muted-strong">{a.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recent.length === 0 ? (
              <p className="rounded-2xl bg-rose-light px-4 py-4 text-sm text-plum-soft">
                Nothing yet. Your latest learning actions will be listed here.
              </p>
            ) : (
              <ul className="divide-y divide-border-soft">
                {stats.recent.map((item) => {
                  const Icon = ICONS[item.type];
                  return (
                    <li key={item.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-rose text-rose-deep">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-plum">{item.title}</p>
                        {item.detail && <p className="truncate text-xs text-muted-strong">{item.detail}</p>}
                      </div>
                      <time dateTime={item.at} className="shrink-0 text-xs text-muted-strong">
                        {formatRelative(item.at, now)}
                      </time>
                    </li>
                  );
                })}
              </ul>
            )}
            {stats.aiSessions > 0 && (
              <p className="mt-4 flex items-center gap-2 text-xs text-muted-strong">
                <CheckCircle2 className="size-4 text-success" aria-hidden="true" />
                {stats.aiSessions} AI practice {stats.aiSessions === 1 ? "reply" : "replies"} received so far.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
