"use client";

import { useMemo, useState } from "react";
import { generatePlan } from "@/lib/planner";
import { topicName } from "@/lib/curriculum";
import { QUESTIONS } from "@/lib/questions";
import { useProgressCtx } from "@/components/ProgressProvider";
import { useI18n } from "@/lib/i18n";
import { CalendarClock, Sparkles } from "lucide-react";

export default function PlannerPage() {
  const { t, lang } = useI18n();
  const { progress } = useProgressCtx();
  const [minutes, setMinutes] = useState(60);
  const [testDate, setTestDate] = useState("");

  const topicAccuracy = useMemo(() => {
    const acc: Record<string, { ok: number; n: number }> = {};
    for (const q of QUESTIONS) {
      const a = progress.answeredQuestions[q.id];
      if (!a) continue;
      acc[q.topic_id] = acc[q.topic_id] || { ok: 0, n: 0 };
      acc[q.topic_id].n++;
      if (a.correct) acc[q.topic_id].ok++;
    }
    return Object.fromEntries(Object.entries(acc).map(([k, v]) => [k, v.n ? v.ok / v.n : 0]));
  }, [progress.answeredQuestions]);

  const plan = useMemo(
    () => generatePlan({ dailyMinutes: minutes, topicAccuracy, testDate: testDate || undefined, today: new Date() }),
    [minutes, topicAccuracy, testDate]
  );

  const labelFor = (kind: string, topic?: string) => {
    switch (kind) {
      case "mock": return t.mock.title;
      case "review": return `${t.planner.reviewTopic.split("{")[0]}${topic ? topicName(topic, lang) : ""}`;
      case "lesson": return t.lesson.summary;
      case "practice": return t.practice.title;
      default: return t.planner.restDay;
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-4 pt-6">
      <h1 className="text-2xl font-extrabold mb-1 flex items-center gap-2">
        <CompassIcon /> {t.planner.title}
      </h1>
      <p className="text-[var(--muted)] mb-6">Qudrat Compass · بوصلة قدرات</p>

      <section className="card p-5 mb-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium">{t.planner.testDate}</span>
            <input
              type="date"
              value={testDate}
              onChange={(e) => setTestDate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2.5 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">{t.planner.dailyMinutes}: {minutes}</span>
            <input
              type="range" min={15} max={240} step={15} value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="mt-3 w-full accent-[var(--primary)]"
            />
          </label>
        </div>
      </section>

      <section className="card p-5">
        <h2 className="font-bold mb-4 flex items-center gap-2">
          <CalendarClock size={18} className="text-[var(--primary)]" /> {t.planner.today}
        </h2>
        <ol className="space-y-3">
          {plan.map((task, i) => (
            <li key={i} className="flex items-center gap-3 rounded-2xl bg-[var(--surface-2)] p-3.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary-soft)] text-[var(--primary-deep)] dark:text-[var(--primary)] font-bold text-sm">
                {i + 1}
              </span>
              <div className="flex-1">
                <p className="font-medium text-sm">{labelFor(task.kind, task.topic_id)}</p>
                <p className="text-xs text-[var(--muted)]">{task.reason}</p>
              </div>
              <span className="chip text-xs">{task.minutes}′</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs text-[var(--muted)] flex items-center gap-1.5">
          <Sparkles size={12} /> Rules engine v1 — accuracy &lt;70% topics get review time; mock scheduled near test date.
        </p>
      </section>
    </main>
  );
}

function CompassIcon() {
  return <span className="text-[var(--primary)]">🧭</span>;
}
