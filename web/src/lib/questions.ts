import type { Question } from "./types";
import ar from "@/data/questions/official-mock-ar.json";
import en from "@/data/questions/official-mock-en.json";
import tiqdr1 from "@/data/questions/tiqdr-bank1.json";
import tiqdr2 from "@/data/questions/tiqdr-bank2.json";
import tiqdr4 from "@/data/questions/tiqdr-bank4.json";
import tiqdr5 from "@/data/questions/tiqdr-bank5.json";
import tiqdr6 from "@/data/questions/tiqdr-bank6.json";
import tiqdr7 from "@/data/questions/tiqdr-bank7.json";
import tiqdr8 from "@/data/questions/tiqdr-bank8.json";
import tiqdr9 from "@/data/questions/tiqdr-bank9.json";
import tiqdr10 from "@/data/questions/tiqdr-bank10.json";

const ALL: Question[] = [
  ...(ar as Question[]),
  ...(en as Question[]),
  ...(tiqdr1 as Question[]),
  ...(tiqdr2 as Question[]),
  ...(tiqdr4 as Question[]),
  ...(tiqdr5 as Question[]),
  ...(tiqdr6 as Question[]),
  ...(tiqdr7 as Question[]),
  ...(tiqdr8 as Question[]),
  ...(tiqdr9 as Question[]),
  ...(tiqdr10 as Question[]),
];

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
  filter: { chapter?: number; topic_id?: string; section?: string; lang?: string; source?: string },
  n: number,
  seed = 1
): Question[] {
  let pool = ALL;
  if (filter.chapter !== undefined) pool = pool.filter((q) => q.chapter === filter.chapter);
  if (filter.topic_id) pool = pool.filter((q) => q.topic_id === filter.topic_id);
  if (filter.section) pool = pool.filter((q) => q.section === filter.section);
  if (filter.lang) pool = pool.filter((q) => q.lang === filter.lang);
  const src = filter.source;
  if (src) pool = pool.filter((q) => (q.source ?? "").startsWith(src));
  // deterministic shuffle
  const arr = [...pool];
  for (let i = arr.length - 1; i > 0; i--) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    const j = seed % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, n);
}
