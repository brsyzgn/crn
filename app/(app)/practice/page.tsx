import type { Metadata } from "next";
import { PracticeHub } from "@/features/practice/practice-hub";

export const metadata: Metadata = { title: "AI Practice" };

export default function PracticePage() {
  return <PracticeHub />;
}
