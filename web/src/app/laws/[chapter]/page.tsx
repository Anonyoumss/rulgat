"use client";

import { useState } from "react";
import Link from "next/link";
import { CHAPTERS } from "@/lib/curriculum";
import { byTopic } from "@/lib/questions";
import { useProgressCtx } from "@/components/ProgressProvider";
import { useI18n } from "@/lib/i18n";
import type { LawMark } from "@/lib/types";
import { ArrowRight, CircleCheck, CircleAlert, CircleX, FileText } from "lucide-react";
import { cn } from "@/lib/cn";

const MARKS: { key: LawMark; icon: typeof CircleCheck; color: string }[] = [
  { key: "green", icon: CircleCheck, color: "text-[var(--success)]" },
  { key: "yellow", icon: CircleAlert, color: "text-[var(--warning)]" },
  { key: "red", icon: CircleX, color: "text-[var(--danger)]" },
];

export default function LawsPage({ params }: { params: { chapter: string } }) {
  const chapter = Number(params.chapter);
  const { t, lang } = useI18n();
  const { progress, setLawMark } = useProgressCtx();
  const ch = CHAPTERS.find((c) => c.id === chapter);
  const [open, setOpen] = useState<string | null>(null);

  if (!ch) return null;

  return (
    <main className="mx-auto max-w-3xl px-4 pt-6">
      <Link href="/journey" className="btn-ghost text-sm mb-4"><ArrowRight size={16} className="rtl:rotate-180" /> {t.common.back}</Link>
      <h1 className="text-2xl font-extrabold mb-1">{t.laws.title}</h1>
      <p className="text-[var(--muted)] mb-6">{lang === "ar" ? ch.ar : ch.en}</p>

      <div className="space-y-3">
        {ch.topics.map((tp, i) => {
          const mark = progress.lawMarks[tp.id];
          const qCount = byTopic(tp.id).length;
          const MarkIcon = mark ? MARKS.find((m) => m.key === mark)!.icon : null;
          return (
            <div key={tp.id} className="card p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary-deep)] dark:text-[var(--primary)] font-black text-sm">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="font-bold text-sm">{lang === "ar" ? tp.ar : tp.en}</p>
                  <p className="text-xs text-[var(--muted)]">{qCount} {t.curriculum.questions}</p>
                </div>
                {MarkIcon && <MarkIcon size={22} className={MARKS.find((m) => m.key === mark)!.color} />}
                <button onClick={() => setOpen(open === tp.id ? null : tp.id)} className="btn-ghost text-xs px-3">
                  {t.laws.mark}
                </button>
              </div>

              {open === tp.id && (
                <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] flex flex-wrap items-center gap-2">
                  {MARKS.map(({ key, icon: Icon, color }) => (
                    <button
                      key={key}
                      onClick={() => { setLawMark(tp.id, mark === key ? null : key); setOpen(null); }}
                      className={cn("chip cursor-pointer px-4 py-2 flex items-center gap-1.5", mark === key && "ring-2 ring-[var(--primary)]")}
                    >
                      <Icon size={16} className={color} />
                      {key === "green" ? t.laws.green : key === "yellow" ? t.laws.yellow : t.laws.red}
                    </button>
                  ))}
                  <Link href={`/lesson/${tp.id}`} className="btn-tonal text-xs px-4 py-2 ms-auto">
                    <FileText size={14} /> {t.lesson.summary}
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-[var(--muted)]">
        {lang === "ar"
          ? "أرقام الصفحات تتحدث من خريطة PDF التفاعلية — راجع docs/HANDOFF.md."
          : "Exact PDF page links populate once the interactive PDF map is extracted."}
      </p>
    </main>
  );
}
