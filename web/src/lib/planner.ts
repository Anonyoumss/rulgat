import type { Lang } from "./types";

export interface PlanItem {
  kind: "review" | "practice" | "mock" | "rest" | "lesson";
  topic_id?: string;
  minutes: number;
  label: (t: (k: never) => string, lang: Lang) => string;
}

/** Rules-first study planner (Qudrat Compass). No external AI needed:
 *  weak topics (low accuracy) get review time; a mock is scheduled when
 *  the test date is near or weekly cadence hits. */
export interface PlannerInput {
  testDate?: string; // ISO
  dailyMinutes: number;
  topicAccuracy: Record<string, number>; // topic_id -> 0..1
  today: Date;
}

export interface PlanTask {
  kind: "review" | "practice" | "mock" | "rest" | "lesson";
  topic_id?: string;
  minutes: number;
  reason: string;
}

export function generatePlan(input: PlannerInput): PlanTask[] {
  const tasks: PlanTask[] = [];
  let budget = input.dailyMinutes;

  // weakest topics first
  const weak = Object.entries(input.topicAccuracy)
    .filter(([, acc]) => acc < 0.7)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 3);

  const daysToTest = input.testDate
    ? Math.ceil((new Date(input.testDate).getTime() - input.today.getTime()) / 864e5)
    : null;

  for (const [topic, acc] of weak) {
    if (budget <= 0) break;
    const mins = Math.min(20, Math.max(10, Math.round((1 - acc) * 30)), budget);
    tasks.push({
      kind: acc < 0.4 ? "lesson" : "review",
      topic_id: topic,
      minutes: mins,
      reason: `accuracy ${(acc * 100).toFixed(0)}%`,
    });
    budget -= mins;
  }

  if (budget > 0) {
    // mock cadence: every 7 days, or daily if <=3 days to test
    const dow = input.today.getDay();
    const mockDue = daysToTest !== null && daysToTest <= 3 ? true : dow === 5;
    if (mockDue && budget >= 30) {
      tasks.push({ kind: "mock", minutes: Math.min(30, budget), reason: "weekly mock cadence" });
      budget -= Math.min(30, budget);
    }
    if (budget > 0) {
      tasks.push({ kind: "practice", minutes: budget, reason: "mixed practice" });
    }
  }

  if (tasks.length === 0) {
    tasks.push({ kind: "rest", minutes: 0, reason: "all topics above 70% — light review" });
  }
  return tasks;
}
