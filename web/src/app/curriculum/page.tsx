"use client";

import Link from "next/link";
import { CHAPTERS } from "@/lib/curriculum";
import { QUESTIONS } from "@/lib/questions";
import { useProgressCtx } from "@/components/ProgressProvider";
import { useI18n } from "@/lib/i18n";
import { CheckCircle2, ChevronLeft } from "lucide-react";

export default function CurriculumPage() {
  const { t, lang } = useI18n();
  const { progress } = useProgressCtx();

  return (
    <main className="mx-auto max-w-5xl px-4 pt-6">
      <h1 className="text-2xl font-extrabold mb-1">{t.curriculum.title}</h1>
      <p className="text-[var(--muted)] mb-6">Al-Moasser 11 · المعاصر ١١</p>

      <div className="space-y-4">
        {CHAPTERS.map((ch) => {
          const chQuestions = QUESTIONS.filter((q) => q.chapter === ch.id).length;
          const done = ch.topics.filter((tp) => progress.completedLessons.includes(tp.id)).length;
          return (
            <section key={ch.id} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold">{lang === "ar" ? ch.ar : ch.en}</h2>
                <span className="chip text-xs">
                  {done}/{ch.topics.length} {t.curriculum.lessons} · {chQuestions} {t.curriculum.questions}
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {ch.topics.map((tp) => {
                  const completed = progress.completedLessons.includes(tp.id);
                  const count = QUESTIONS.filter((q) => q.topic_id === tp.id).length;
                  return (
                    <Link
                      key={tp.id}
                      href={`/lesson/${tp.id}`}
                      className="group flex items-center justify-between rounded-2xl border border-[var(--border-subtle)] p-3.5 hover:border-[var(--primary)] hover:bg-[var(--primary-soft)]/40 transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        {completed ? (
                          <CheckCircle2 size={18} className="text-[var(--success)] shrink-0" />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-[var(--primary)] shrink-0" />
                        )}
                        <div>
                          <p className="font-medium text-sm">{lang === "ar" ? tp.ar : tp.en}</p>
                          <p className="text-xs text-[var(--muted)]">{count} {t.curriculum.questions}</p>
                        </div>
                      </div>
                      <ChevronLeft size={16} className="text-[var(--muted)] rtl:rotate-180 group-hover:text-[var(--primary)]" />
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
