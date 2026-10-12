import type { Metadata } from "next";
import { TestsView } from "@/features/quiz/tests-view";

export const metadata: Metadata = { title: "Mini Tests" };

export default function TestsPage() {
  return <TestsView />;
}
