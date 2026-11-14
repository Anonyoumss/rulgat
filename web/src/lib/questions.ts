import type { Question } from "./types";
import ar from "@/data/questions/official-mock-ar.json";
import en from "@/data/questions/official-mock-en.json";

const ALL: Question[] = [...(ar as Question[]), ...(en as Question[])];

export const QUESTIONS: Question[] = ALL;

export function byId(id: string): Question | undefined {
  return ALL.find((q) => q.id === id);
}

export function byChapter(ch: number): Question[] {
  return ALL.filter((q) => q.chapter === ch);
}

export function byTopic(topicId: string): Question[] {
  return ALL.filter((q) => q.topic_id === topicId);
}

export function bySection(section: "quantitative" | "verbal"): Question[] {
  return ALL.filter((q) => q.section === section);
}

export function pickQuestions(
  filter: { chapter?: number; topic_id?: string; section?: string; lang?: string },
  n: number,
  seed = 1
): Question[] {
  let pool = ALL;
  if (filter.chapter !== undefined) pool = pool.filter((q) => q.chapter === filter.chapter);
  if (filter.topic_id) pool = pool.filter((q) => q.topic_id === filter.topic_id);
  if (filter.section) pool = pool.filter((q) => q.section === filter.section);
  if (filter.lang) pool = pool.filter((q) => q.lang === filter.lang);
  // deterministic shuffle
  const arr = [...pool];
  for (let i = arr.length - 1; i > 0; i--) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    const j = seed % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, n);
}
