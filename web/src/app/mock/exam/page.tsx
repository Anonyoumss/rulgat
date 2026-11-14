"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Question } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { Flag, LayoutGrid, ChevronRight, ChevronLeft, AlertTriangle, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import GeoScene from "@/components/GeoScene";

const LETTERS = ["A", "B", "C", "D"];
const FONT_STEPS = [0.9, 1, 1.15];

interface ExamState {
  questions: Question[];
  durationSec: number;
  startedAt: number;
}

export default function ExamPage() {
  const { t, lang } = useI18n();
  const router = useRouter();
  const [exam, setExam] = useState<ExamState | null>(null);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [flags, setFlags] = useState<Set<number>>(new Set());
  const [left, setLeft] = useState(0);
  const [fontStep, setFontStep] = useState(1);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("rulgat.mock");
    if (!raw) { router.replace("/mock"); return; }
    const parsed: ExamState = JSON.parse(raw);
    setExam(parsed);
    setLeft(parsed.durationSec);
    // resume answers if present
    const saved = sessionStorage.getItem("rulgat.mock.answers");
    if (saved) {
      const s = JSON.parse(saved);
      setAnswers(s.answers || {});
      setFlags(new Set(s.flags || []));
      setIdx(s.idx || 0);
    }
  }, [router]);

  // tick
  useEffect(() => {
    if (!exam || left <= 0) return;
    const iv = setInterval(() => setLeft((l) => l - 1), 1000);
    return () => clearInterval(iv);
  }, [exam, left > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  // auto-submit at 0
  useEffect(() => {
    if (exam && left <= 0) submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left, exam]);

  // persist progress
  useEffect(() => {
    if (!exam) return;
    sessionStorage.setItem("rulgat.mock.answers", JSON.stringify({ answers, flags: Array.from(flags), idx }));
  }, [answers, flags, idx, exam]);

  const q: Question | undefined = exam?.questions[idx];
  const fontScale = FONT_STEPS[fontStep];

  const submit = useCallback(() => {
    if (!exam) return;
    const results = exam.questions.map((question, i) => ({
      question,
      selected: answers[i],
      correct: answers[i] === question.answer_index,
    }));
    sessionStorage.setItem("rulgat.mock.results", JSON.stringify({ results, durationSec: exam.durationSec, startedAt: exam.startedAt }));
    sessionStorage.removeItem("rulgat.mock");
    sessionStorage.removeItem("rulgat.mock.answers");
    router.push("/mock/results");
  }, [exam, answers, router]);

  const mm = String(Math.floor(Math.max(0, left) / 60)).padStart(2, "0");
  const ss = String(Math.max(0, left) % 60).padStart(2, "0");
  const urgent = left <= 300;

  const answeredCount = Object.keys(answers).length;
  const flaggedCount = flags.size;

  const jump = (i: number) => { setIdx(i); setPaletteOpen(false); };

  const toggleFlag = () => {
    setFlags((f) => {
      const n = new Set(f);
      if (n.has(idx)) n.delete(idx); else n.add(idx);
      return n;
    });
  };

  if (!exam || !q) {
    return <main className="min-h-screen flex items-center justify-center text-[var(--muted)]">{t.common.loading}</main>;
  }

  return (
    <main className="min-h-screen flex flex-col bg-[var(--background)]" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* ===== CBT top bar ===== */}
      <header className="sticky top-0 z-30 border-b border-[var(--border-subtle)] bg-[var(--card)]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-5xl flex items-center gap-2 px-3 py-2.5">
          <div className="flex items-center gap-2 shrink-0">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--primary-deep)] flex items-center justify-center text-white font-black text-sm">ق</div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold leading-none">{lang === "ar" ? "قياس" : "Qiyas"}</p>
              <p className="text-[10px] text-[var(--muted)]">{t.mock.title}</p>
            </div>
          </div>

          <div className="flex-1 text-center">
            <p className="text-xs text-[var(--muted)]">{q.topic}</p>
            <p className="text-sm font-semibold">{idx + 1} / {exam.questions.length}</p>
          </div>

          <div className="flex items-center gap-1.5">
            {/* font size */}
            <div className="flex items-center rounded-full border border-[var(--border)] overflow-hidden">
              <button onClick={() => setFontStep((s) => Math.max(0, s - 1))} className="px-2 py-1.5 hover:bg-[var(--surface-2)]" aria-label="A-"><Minus size={14} /></button>
              <span className="px-1 text-xs font-bold">A</span>
              <button onClick={() => setFontStep((s) => Math.min(2, s + 1))} className="px-2 py-1.5 hover:bg-[var(--surface-2)]" aria-label="A+"><Plus size={14} /></button>
            </div>
            {/* timer */}
            <div className={cn("rounded-full px-3 py-1.5 font-mono text-sm font-bold tabular-nums", urgent ? "bg-[var(--danger)]/15 text-[var(--danger)] animate-pulse" : "bg-[var(--surface-2)]")}>
              {mm}:{ss}
            </div>
            {/* flag */}
            <button onClick={toggleFlag} className={cn("rounded-full p-2", flags.has(idx) ? "text-[var(--warning)] bg-[var(--warning)]/15" : "text-[var(--muted)] hover:bg-[var(--surface-2)]")} aria-label={t.mock.flag}>
              <Flag size={16} fill={flags.has(idx) ? "currentColor" : "none"} />
            </button>
            {/* palette */}
            <button onClick={() => setPaletteOpen(true)} className="rounded-full p-2 text-[var(--muted)] hover:bg-[var(--surface-2)]" aria-label={t.mock.palette}>
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* ===== question ===== */}
      <section className="flex-1 mx-auto w-full max-w-3xl px-4 py-6">
        <div className="card p-6" style={{ fontSize: `${fontScale}rem` }}>
          <p className="font-semibold leading-loose whitespace-pre-wrap mb-6">{q.stem}</p>
          {q.figure?.scene && (
            <div className="flex justify-center mb-6"><GeoScene scene={q.figure.scene} size={240} /></div>
          )}
          <div className="flex flex-col gap-3">
            {q.options.map((opt, i) => {
              const sel = answers[idx] === i;
              return (
                <button
                  key={i}
                  onClick={() => setAnswers((a) => ({ ...a, [idx]: i }))}
                  className={cn("option-row", sel && "selected")}
                >
                  <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 font-bold", sel ? "border-[var(--primary)] bg-[var(--primary)] text-white" : "border-[var(--border)] text-[var(--muted)]")}>
                    {LETTERS[i]}
                  </span>
                  <span className="flex-1">{opt}</span>
                  {sel && <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== bottom nav ===== */}
      <footer className="sticky bottom-0 z-30 border-t border-[var(--border-subtle)] bg-[var(--card)]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl flex items-center justify-between px-4 py-3">
          <button onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={idx === 0} className="btn-ghost">
            <ChevronRight size={18} className="rtl:rotate-180" /> {t.mock.prev}
          </button>
          <span className="text-xs text-[var(--muted)]">{answeredCount}/{exam.questions.length} {t.mock.answered} · {flaggedCount} {t.mock.flagged}</span>
          {idx === exam.questions.length - 1 ? (
            <button onClick={() => setConfirming(true)} className="btn-primary">{t.mock.finish}</button>
          ) : (
            <button onClick={() => setIdx((i) => Math.min(exam.questions.length - 1, i + 1))} className="btn-primary">
              {t.mock.next} <ChevronLeft size={18} className="rtl:rotate-180" />
            </button>
          )}
        </div>
      </footer>

      {/* ===== palette modal ===== */}
      {paletteOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setPaletteOpen(false)}>
          <div className="glass-strong w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-5 max-h-[80dvh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">{t.mock.palette}</h3>
              <button onClick={() => setPaletteOpen(false)} className="btn-ghost text-sm">{t.common.close}</button>
            </div>
            <div className="grid grid-cols-8 sm:grid-cols-10 gap-2">
              {exam.questions.map((_, i) => {
                const answered = answers[i] !== undefined;
                const flagged = flags.has(i);
                const current = i === idx;
                return (
                  <button
                    key={i}
                    onClick={() => jump(i)}
                    className={cn(
                      "relative aspect-square rounded-lg text-xs font-bold flex items-center justify-center border",
                      current ? "border-[var(--primary)] ring-2 ring-[var(--primary)]" : "border-[var(--border-subtle)]",
                      answered ? "bg-[var(--primary-soft)] text-[var(--primary-deep)] dark:text-[var(--primary)]" : "bg-[var(--surface-2)]"
                    )}
                  >
                    {i + 1}
                    {flagged && <span className="absolute -top-1 -end-1 h-2.5 w-2.5 rounded-full bg-[var(--warning)]" />}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-4 mt-4 text-xs text-[var(--muted)]">
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-[var(--primary-soft)] border border-[var(--border)]" /> {t.mock.answered}</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-[var(--surface-2)] border border-[var(--border)]" /> {t.mock.unanswered}</span>
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-[var(--warning)]" /> {t.mock.flagged}</span>
            </div>
          </div>
        </div>
      )}

      {/* ===== finish confirm ===== */}
      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="glass-strong w-full max-w-sm rounded-3xl p-6 text-center">
            <AlertTriangle className="mx-auto text-[var(--warning)] mb-3" size={32} />
            <h3 className="font-bold text-lg mb-1">{t.mock.confirmFinish}</h3>
            <p className="text-sm text-[var(--muted)] mb-4">
              {answeredCount}/{exam.questions.length} {t.mock.answered} · {exam.questions.length - answeredCount} {t.mock.unanswered} · {flaggedCount} {t.mock.flagged}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirming(false)} className="btn-ghost flex-1">{t.common.cancel}</button>
              <button onClick={submit} className="btn-primary flex-1">{t.mock.finish}</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
