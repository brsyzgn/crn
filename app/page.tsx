import Link from "next/link";
import { ArrowRight, BarChart3, BookOpen, Mic, Sparkles } from "lucide-react";
import { Brand } from "@/components/brand";
import { Cloud, HeroWindow } from "@/components/illustrations";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { INTERVIEW_QUESTIONS } from "@/data/interview";
import { VOCABULARY } from "@/data/vocabulary";

const FEATURES = [
  {
    icon: Mic,
    title: "Interview Practice",
    text: `${INTERVIEW_QUESTIONS.length} realistic practice questions with model answers.`,
    href: "/interview",
  },
  {
    icon: BookOpen,
    title: "Vocabulary",
    text: `${VOCABULARY.length} words for aviation, service and daily life.`,
    href: "/vocabulary",
  },
  {
    icon: Sparkles,
    title: "AI Feedback",
    text: "Optional corrections and better phrasing.",
    href: "/practice",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    text: "See what you have really learned.",
    href: "/progress",
  },
] as const;

export default function WelcomePage() {
  return (
    <div className="bg-ambient relative min-h-dvh overflow-hidden">
      <Cloud className="pointer-events-none absolute right-10 top-[55%] hidden w-32 animate-float text-white/60 [animation-delay:1.5s] md:block" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-10">
        <Brand href="/" />
        <nav
          aria-label="Main"
          className="hidden items-center gap-1 rounded-full border border-border-soft bg-white/70 p-1.5 text-sm font-medium shadow-soft backdrop-blur md:flex"
        >
          {[
            ["Learn", "/vocabulary"],
            ["Interview", "/interview"],
            ["Practice", "/practice"],
            ["Progress", "/progress"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-full px-4 py-2 text-muted-strong transition-colors hover:bg-rose-light hover:text-plum"
            >
              {label}
            </Link>
          ))}
        </nav>
        <Button asChild size="sm">
          <Link href="/dashboard">
            Start Learning <ArrowRight />
          </Link>
        </Button>
      </header>

      <main className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-4 pb-10 pt-6 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6 lg:px-10 lg:pt-12">
        <Reveal>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border-soft bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-rose-deep shadow-soft">
            <Sparkles className="size-3.5" aria-hidden="true" />
            English for your cabin crew journey
          </p>
          <h1 className="font-display text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-plum sm:text-6xl lg:text-[4.25rem]">
            Your journey to the skies{" "}
            <span className="text-rose-deep">starts here, Ceren&nbsp;✈️</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-strong">
            Improve your English, build your confidence, and get ready for your cabin crew interview.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/dashboard">
                Start Learning <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/interview">Try interview questions</Link>
            </Button>
          </div>
          <p className="mt-5 text-sm text-muted-strong">
            No sign-up needed. Your progress is saved privately on this device.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="relative mx-auto w-full max-w-[22rem] sm:max-w-sm lg:max-w-md">
          <HeroWindow className="w-full drop-shadow-xl" />
          <p className="absolute bottom-[17%] left-[-4%] -rotate-12 font-display text-lg italic leading-snug text-plum/90 sm:text-xl">
            Goal.
            <br />
            English.
            <br />
            Brighter
            <br />
            opportunities.
          </p>
        </Reveal>
      </main>

      <section aria-label="What you can do" className="relative z-10 mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-10">
        <ul className="grid gap-3 rounded-[2rem] border border-border-soft bg-white/85 p-3 shadow-soft backdrop-blur sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, text, href }) => (
            <li key={title}>
              <Link
                href={href}
                className="group flex h-full items-center gap-4 rounded-3xl p-4 transition-colors hover:bg-rose-light"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-rose text-rose-deep transition-transform group-hover:scale-105">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-[15px] font-semibold text-plum">{title}</span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-muted-strong">{text}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-center text-xs text-muted-strong">Made especially for Ceren ♡</p>
      </section>
    </div>
  );
}
