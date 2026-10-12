import type { Metadata } from "next";
import { InterviewView } from "@/features/interview/interview-view";

export const metadata: Metadata = { title: "Interview Practice" };

export default function InterviewPage() {
  return <InterviewView />;
}
