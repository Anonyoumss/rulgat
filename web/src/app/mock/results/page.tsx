"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Question } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { useProgressCtx } from "@/components/ProgressProvider";
import Mascot from "@/components/Mascot";
import { topicName } from "@/lib/curriculum";
import { CheckCircle2, XCircle, MinusCircle, RotateCcw, Home } from "lucide-react";

interface ResultRow { question: Question; selected: number | undefined; correct: boolean }
interface Results { results: ResultRow[]; durationSec: number; startedAt: number }

export default function MockResultsPage() {
  const { t, lang } = useI18n();
  const router = useRouter();
  const { recordMock } = useProgressCtx();
  const [data, setData] = useState<Results | null>(null);
  const [recorded, setRecorded] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("rulgat.mock.results");
    if (!raw) { router.replace("/mock"); return; }
    const parsed: Results = JSON.parse(raw);
    setData(parsed);
    if (!recorded) {
      const score = parsed.results.filter((r) => r.correct).length;
      recordMock(score, parsed.results.length);
      setRecorded(true);
    }
  }, [router, recordMock, recorded]);

  if (!data) return <main className="min-h-screen flex items-center justify-center text-[var(--muted)]">{t.common.loading}</main>;

  const total = data.results.length;
  const score = data.results.filter((r) => r.correct).length;
  const pct = Math.round((score / total) * 100);
  const skipped = data.results.filter((r) => r.selected === undefined).length;

  // per-topic accuracy
  const byTopic: Record<string, { ok: number; n: number }> = {};
  for (const r of data.results) {
    byTopic[r.question.topic_id] = byTopic[r.question.topic_id] || { ok: 0, n: 0 };
    byTopic[r.question.topic_id].n++;
    if (r.correct) byTopic[r.question.topic_id].ok++;
  }

  const mood = pct >= 80 ? "proud" : pct >= 50 ? "happy" : "thinking";

  return (
    <main className="mx-auto max-w-3xl px-4 pt-8 pb-28">
      {/* score banner */}
      <section className="glass rounded-[28px] p-8 text-center mb-6">
        <Mascot mood={mood} size={90} className="mx-auto mb-2" />
        <h1 className="text-2xl font-extrabold mb-1">{t.mock.results}</h1>
        <p className="text-6xl font-black text-[var(--primary)] my-2">{pct}%</p>
        <p className="text-[var(--muted)]">
          {score}/{total} {lang === "ar" ? "صحيحة" : "correct"} · {skipped} {t.mock.unanswered}
        </p>
        <div className="flex justify-center gap-3 mt-5">
          <Link href="/mock" className="btn-tonal"><RotateCcw size={16} /> {t.practice.again}</Link>
          <Link href="/" className="btn-ghost"><Home size={16} /> {t.nav.home}</Link>
        </div>
      </section>

      {/* topic accuracy */}
      <section className="card p-5 mb-6">
        <h2 className="font-bold mb-3">{lang === "ar" ? "الأداء حسب الموضوع" : "Accuracy by topic"}</h2>
        <div className="space-y-2.5">
          {Object.entries(byTopic).sort((a, b) => a[1].ok / a[1].n - b[1].ok / b[1].n).map(([tid, v]) => {
            const p = Math.round((v.ok / v.n) * 100);
            return (
              <div key={tid} className="flex items-center gap-3">
                <span className="text-sm w-40 truncate">{topicName(tid, lang)}</span>
                <div className="flex-1 h-2.5 rounded-full bg-[var(--surface-2)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${p}%`, background: p >= 70 ? "var(--success)" : p >= 40 ? "var(--warning)" : "var(--danger)" }}
                  />
                </div>
                <span className="text-xs font-bold w-10 text-end">{p}%</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* review */}
      <section>
        <h2 className="font-bold mb-3">{t.mock.review}</h2>
        <div className="space-y-4">
          {data.results.map((r, i) => (
            <article key={r.question.id} className="card p-4">
              <div className="flex items-center gap-2 mb-2">
                {r.correct ? <CheckCircle2 size={18} className="text-[var(--success)]" /> : r.selected === undefined ? <MinusCircle size={18} className="text-[var(--muted)]" /> : <XCircle size={18} className="text-[var(--danger)]" />}
                <span className="text-sm font-semibold">{i + 1}. {r.question.topic}</span>
              </div>
              <p className="text-sm leading-relaxed mb-2">{r.question.stem}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                {r.question.options.map((o, j) => {
                  const isCorrect = j === r.question.answer_index;
                  const isSel = j === r.selected;
                  return (
                    <span key={j} className={`chip ${isCorrect ? "ring-2 ring-[var(--success)]" : isSel ? "ring-2 ring-[var(--danger)] line-through opacity-70" : "opacity-60"}`}>
                      {"ABCD"[j]}) {o}
                    </span>
                  );
                })}
              </div>
              {r.question.explanation && (
                <p className="mt-2 text-xs text-[var(--muted)] border-s-2 border-[var(--primary)] ps-3">{r.question.explanation}</p>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
