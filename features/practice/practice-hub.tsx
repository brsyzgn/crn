"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PracticeView } from "./practice-view";
import { QuestionPractice } from "./question-practice";

type Tab = "ai" | "questions";

const TABS: { id: Tab; label: string }[] = [
  { id: "ai", label: "AI Practice" },
  { id: "questions", label: "Question Practice" },
];

/**
 * Adds question-based practice next to the existing AI practice. The AI view is rendered exactly as
 * before and stays mounted when switching tabs, so a chat is not lost.
 */
export function PracticeHub() {
  const [tab, setTab] = useState<Tab>("ai");

  return (
    <>
      <div
        className="mb-6 inline-flex rounded-full border border-border-soft bg-white p-1"
        role="tablist"
        aria-label="Practice type"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            id={`practice-tab-${t.id}`}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            aria-controls={`practice-panel-${t.id}`}
            onClick={() => setTab(t.id)}
            className={cn(
              "h-10 rounded-full px-5 text-sm font-medium transition-colors",
              tab === t.id ? "bg-rose text-plum" : "text-muted-strong hover:text-plum",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div id="practice-panel-ai" role="tabpanel" aria-labelledby="practice-tab-ai" hidden={tab !== "ai"}>
        <PracticeView />
      </div>
      <div id="practice-panel-questions" role="tabpanel" aria-labelledby="practice-tab-questions" hidden={tab !== "questions"}>
        <QuestionPractice />
      </div>
    </>
  );
}
