"use client";

import Link from "next/link";
import { QUESTIONS } from "@/lib/questions";
import { CHAPTERS, topicName } from "@/lib/curriculum";
import { generatePlan } from "@/lib/planner";
import { useProgressCtx } from "@/components/ProgressProvider";
import Mascot from "@/components/Mascot";
import { HudChips } from "@/components/HudChips";
import { ArrowLeft, Play, Plane, CalendarClock, BookOpen } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function HomePage() {
  const { t, lang } = useI18n();
  const { progress } = useProgressCtx();

  // accuracy per topic from answered questions
  const accMap: Record<string, { ok: number; n: number }> = {};
  for (const q of QUESTIONS) {
    const a = progress.answeredQuestions[q.id];
    if (!a) continue;
    const k = q.topic_id;
    accMap[k] = accMap[k] || { ok: 0, n: 0 };
    accMap[k].n++;
    if (a.correct) accMap[k].ok++;
  }
  const topicAccuracy = Object.fromEntries(
    Object.entries(accMap).map(([k, v]) => [k, v.ok / v.n])
  );
  const plan = generatePlan({ dailyMinutes: 60, topicAccuracy, today: new Date() });

  const nextLesson = CHAPTERS.flatMap((c) => c.topics).find(
    (tp) => !progress.completedLessons.includes(tp.id)
  );

  return (
    <main className="mx-auto max-w-5xl px-4 pt-6">
      {/* header */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Mascot mood="happy" size={52} />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">{t.appName}</h1>
            <p className="text-sm text-[var(--muted)]">{t.tagline}</p>
          </div>
        </div>
        <HudChips />
      </header>

      {/* hero CTA */}
      <section className="glass rounded-[28px] p-6 mb-6 relative overflow-hidden">
        <div className="absolute -top-10 -end-10 opacity-20">
          <Mascot mood="proud" size={160} />
        </div>
        <h2 className="text-xl font-bold mb-1">{t.home.greeting}</h2>
        <p className="text-[var(--muted)] mb-4">
          {QUESTIONS.length.toLocaleString(lang === "ar" ? "ar-EG" : "en")} {t.home.questionsCount}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/mock" className="btn-primary">
            <Play size={18} /> {t.mock.startExam}
          </Link>
          <Link href="/journey" className="btn-tonal">
            <Plane size={18} /> {t.home.waterTigdr}
          </Link>
          <Link href="/stories" className="btn-ghost">
            {t.nav.stories}
          </Link>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-5">
        {/* daily plan */}
        <section className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <CalendarClock className="text-[var(--primary)]" size={18} />
            <h3 className="font-bold">{t.home.dailyPlan}</h3>
          </div>
          <ul className="space-y-2">
            {plan.map((task, i) => (
              <li key={i} className="flex items-center justify-between rounded-xl bg-[var(--surface-2)] px-3 py-2 text-sm">
                <span>
                  {task.kind === "mock" && t.mock.title}
                  {task.kind === "review" && `${t.planner.reviewTopic.split("{")[0]}${task.topic_id ? topicName(task.topic_id, lang) : ""}`}
                  {task.kind === "practice" && t.practice.title}
                  {task.kind === "lesson" && t.lesson.summary}
                  {task.kind === "rest" && t.planner.restDay}
                </span>
                <span className="chip text-xs">{task.minutes}′</span>
              </li>
            ))}
          </ul>
          <Link href="/planner" className="btn-ghost mt-3 text-sm">
            {t.planner.title} <ArrowLeft size={14} className="rtl:rotate-180" />
          </Link>
        </section>

        {/* continue learning */}
        <section className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="text-[var(--accent-purple)]" size={18} />
            <h3 className="font-bold">{t.home.continueLearning}</h3>
          </div>
          {nextLesson ? (
            <Link
              href={`/lesson/${nextLesson.id}`}
              className="flex items-center justify-between rounded-2xl border border-[var(--border-subtle)] p-4 hover:border-[var(--primary)] transition-colors"
            >
              <div>
                <p className="font-semibold">{lang === "ar" ? nextLesson.ar : nextLesson.en}</p>
                <p className="text-sm text-[var(--muted)]">{topicName(nextLesson.id, lang)}</p>
              </div>
              <Play size={20} className="text-[var(--primary)]" />
            </Link>
          ) : (
            <p className="text-sm text-[var(--muted)]">{t.common.loading}</p>
          )}
          <div className="grid grid-cols-3 gap-2 mt-4 text-center">
            <div className="rounded-xl bg-[var(--primary-soft)] p-3">
              <p className="text-lg font-bold text-[var(--primary-deep)] dark:text-[var(--primary)]">{progress.xp}</p>
              <p className="text-xs text-[var(--muted)]">{t.home.xp}</p>
            </div>
            <div className="rounded-xl bg-[var(--accent-pink-soft)] p-3">
              <p className="text-lg font-bold text-[var(--accent-pink)]">{progress.streak}</p>
              <p className="text-xs text-[var(--muted)]">{t.home.streak}</p>
            </div>
            <div className="rounded-xl bg-[var(--accent-yellow-soft)] p-3">
              <p className="text-lg font-bold text-[var(--accent-yellow)]">{progress.level}</p>
              <p className="text-xs text-[var(--muted)]">{t.home.level}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
