"use client";

import Link from "next/link";
import { useProgressCtx } from "@/components/ProgressProvider";
import { useI18n } from "@/lib/i18n";
import { CHAPTERS } from "@/lib/curriculum";
import { QUESTIONS } from "@/lib/questions";
import Mascot from "@/components/Mascot";
import { Plane, Stamp, Lock, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { sounds } from "@/lib/sounds";

export default function JourneyPage() {
  const { t, lang } = useI18n();
  const { progress, setPassportName } = useProgressCtx();
  const [name, setName] = useState(progress.passportName);
  const [checkedIn, setCheckedIn] = useState(!!progress.passportName);

  useEffect(() => {
    if (checkedIn) sounds.announce();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkIn = () => {
    if (!name.trim()) return;
    setPassportName(name.trim());
    setCheckedIn(true);
    sounds.chime();
  };

  if (!checkedIn) {
    return (
      <main className="mx-auto max-w-md px-4 pt-16 text-center">
        <Mascot mood="idle" size={110} className="mx-auto mb-4" />
        <h1 className="text-2xl font-extrabold mb-1">{t.journey.checkIn}</h1>
        <p className="text-[var(--muted)] mb-6">{t.journey.passport} · {t.journey.boardingPass} {progress.boardingPassId}</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && checkIn()}
          placeholder={t.journey.enterName}
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3.5 text-center text-lg mb-3"
        />
        <button onClick={checkIn} className="btn-primary w-full">{t.journey.boarding} ✈️</button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 pt-6">
      {/* passport card */}
      <section className="glass rounded-[28px] p-6 mb-6 relative overflow-hidden">
        <div className="absolute top-4 end-4 opacity-15"><Plane size={90} /></div>
        <div className="flex items-center gap-4">
          <Mascot mood={progress.goldStamp ? "proud" : "happy"} size={76} />
          <div className="flex-1">
            <p className="text-xs text-[var(--muted)] uppercase tracking-widest">{t.journey.passport}</p>
            <h1 className="text-2xl font-extrabold">{progress.passportName}</h1>
            <p className="text-sm text-[var(--muted)]">{t.journey.boardingPass}: <span className="font-mono font-bold text-[var(--primary)]">{progress.boardingPassId}</span></p>
          </div>
          <div className="text-end">
            <p className="text-3xl">{progress.stamps.length}/4</p>
            <p className="text-xs text-[var(--muted)]">{t.journey.stamps}</p>
          </div>
        </div>

        {/* stamps row */}
        <div className="flex gap-3 mt-5">
          {CHAPTERS.map((c) => {
            const stamped = progress.stamps.includes(c.id);
            return (
              <div key={c.id} className={`flex-1 rounded-2xl border-2 p-3 text-center ${stamped ? "border-[var(--success)] bg-[var(--success)]/10" : "border-dashed border-[var(--border)] opacity-60"}`}>
                {stamped ? <Stamp size={22} className="mx-auto text-[var(--success)] mb-1" /> : <Lock size={20} className="mx-auto text-[var(--muted)] mb-1" />}
                <p className="text-xs font-bold">{lang === "ar" ? `باب ${c.id}` : `Ch ${c.id}`}</p>
                {stamped && <p className="text-[10px] text-[var(--success)]">{t.journey.stampEarned}</p>}
              </div>
            );
          })}
          <div className={`flex-1 rounded-2xl border-2 p-3 text-center ${progress.goldStamp ? "border-[var(--accent-yellow)] bg-[var(--accent-yellow-soft)]" : "border-dashed border-[var(--border)] opacity-60"}`}>
            {progress.goldStamp ? <Stamp size={22} className="mx-auto text-[var(--accent-yellow)] mb-1" /> : <Lock size={20} className="mx-auto text-[var(--muted)] mb-1" />}
            <p className="text-xs font-bold">{t.journey.goldStamp}</p>
          </div>
        </div>
      </section>

      {/* departure board */}
      <section className="card p-5 mb-5">
        <h2 className="font-bold mb-3 flex items-center gap-2"><Plane size={18} className="text-[var(--primary)]" /> {t.journey.departure}</h2>
        <div className="space-y-2">
          {CHAPTERS.map((ch) => {
            const stamped = progress.stamps.includes(ch.id);
            const locked = !stamped && ch.id > 0 && !progress.stamps.includes(ch.id - 1);
            const qCount = QUESTIONS.filter((q) => q.chapter === ch.id).length;
            return (
              <div key={ch.id} className={`flex items-center justify-between rounded-2xl border p-4 ${locked ? "opacity-50 border-[var(--border-subtle)]" : "border-[var(--border-subtle)] hover:border-[var(--primary)] transition-colors"}`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{locked ? "🔒" : stamped ? "✅" : "✈️"}</span>
                  <div>
                    <p className="font-bold">{lang === "ar" ? ch.ar.split("—")[0].trim() : ch.en}</p>
                    <p className="text-xs text-[var(--muted)]">{lang === "ar" ? `الباب ${ch.id}` : `Chapter ${ch.id}`} · {qCount} {lang === "ar" ? "سؤال" : "questions"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`chip text-xs ${stamped ? "text-[var(--success)]" : "text-[var(--primary)]"}`}>
                    {stamped ? t.journey.arrived : locked ? "—" : t.journey.onTime}
                  </span>
                  {!locked && (
                    <>
                      <Link href={`/laws/${ch.id}`} className="btn-ghost text-xs px-3">{t.laws.title}</Link>
                      <Link href={`/challenge/${ch.id}`} className="btn-primary text-xs px-4">
                        <Play size={13} /> {t.journey.challenge}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* final exam */}
      <section className="card p-5 mb-5 border-[var(--accent-yellow)]/40">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold flex items-center gap-2"><Stamp size={18} className="text-[var(--accent-yellow)]" /> {t.journey.finalExam}</h2>
            <p className="text-sm text-[var(--muted)]">20 {lang === "ar" ? "سؤالًا شاملًا" : "comprehensive questions"} → {t.journey.goldStamp}</p>
          </div>
          <Link href="/mock" className="btn-tonal">{t.journey.gate} 🏁</Link>
        </div>
      </section>

      {/* delayed reports */}
      {progress.delayedReports.length > 0 && (
        <section className="card p-5 border-[var(--warning)]/40">
          <h2 className="font-bold mb-3 text-[var(--warning)]">{t.journey.reviewReport}</h2>
          <div className="space-y-2">
            {[...progress.delayedReports].reverse().slice(0, 5).map((r, i) => (
              <div key={i} className="rounded-xl bg-[var(--surface-2)] p-3 text-sm flex items-center justify-between">
                <span>{lang === "ar" ? `الباب ${r.chapter}` : `Ch ${r.chapter}`} · {r.score}/10</span>
                <span className="text-[var(--muted)]">{r.topics.map((tp) => tp.split(".").pop()).join(" · ")}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
