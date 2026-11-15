"use client";

import Link from "next/link";
import { useProgressCtx } from "@/components/ProgressProvider";
import { useI18n } from "@/lib/i18n";
import { QUESTIONS } from "@/lib/questions";
import { CHAPTERS } from "@/lib/curriculum";
import Mascot from "@/components/Mascot";
import { Sparkles, Flame, Stamp, Trophy, BookOpen } from "lucide-react";

export default function ProfilePage() {
  const { t, lang } = useI18n();
  const { progress } = useProgressCtx();

  // mastery per chapter = % of that chapter's questions answered correctly
  const mastery = CHAPTERS.map((ch) => {
    const qs = QUESTIONS.filter((q) => q.chapter === ch.id);
    const answered = qs.filter((q) => progress.answeredQuestions[q.id]);
    const correct = answered.filter((q) => progress.answeredQuestions[q.id]?.correct).length;
    return {
      id: ch.id,
      name: lang === "ar" ? ch.ar : ch.en,
      pct: answered.length ? Math.round((correct / answered.length) * 100) : 0,
      answered: answered.length,
      total: qs.length,
    };
  });

  const mood = progress.xp > 500 ? "proud" : progress.xp > 100 ? "happy" : "idle";

  return (
    <main className="mx-auto max-w-3xl px-4 pt-6">
      {/* student file card */}
      <section className="glass rounded-[28px] p-6 mb-5 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <Mascot mood={mood} size={80} />
          <div className="flex-1">
            <h1 className="text-xl font-extrabold">{lang === "ar" ? "ملف الطالب" : "Student File"}</h1>
            <p className="text-sm text-[var(--muted)]">Level {progress.level} · {t.appName}</p>
          </div>
          <div className="text-end">
            <p className="text-3xl font-black text-[var(--primary)]">{progress.xp}</p>
            <p className="text-xs text-[var(--muted)]">{t.profile.xp}</p>
          </div>
        </div>

        {/* XP progress to next level */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-[var(--muted)] mb-1">
            <span>LV {progress.level}</span>
            <span>{progress.xp % 200}/200 XP</span>
          </div>
          <div className="h-2.5 rounded-full bg-[var(--surface-2)] overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent-purple)] transition-all" style={{ width: `${(progress.xp % 200) / 2}%` }} />
          </div>
        </div>
      </section>

      {/* stat chips */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <Stat icon={<Flame size={18} className="text-[var(--warning)]" />} value={progress.streak} label={t.profile.streak} />
        <Stat icon={<Stamp size={18} className="text-[var(--success)]" />} value={`${progress.stamps.length}/4`} label={t.journey.stamps} />
        <Stat icon={<Trophy size={18} className="text-[var(--accent-yellow)]" />} value={progress.mockHistory.length} label={lang === "ar" ? "محاكاة" : "Mocks"} />
      </div>

      {/* mastery per chapter */}
      <section className="card p-5 mb-5">
        <h2 className="font-bold mb-4 flex items-center gap-2"><BookOpen size={17} className="text-[var(--accent-purple)]" /> {t.profile.mastery}</h2>
        <div className="space-y-3">
          {mastery.map((m) => (
            <div key={m.id}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium truncate">{m.name}</span>
                <span className="text-[var(--muted)] text-xs">{m.answered}/{m.total}</span>
              </div>
              <div className="h-2.5 rounded-full bg-[var(--surface-2)] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${m.pct}%`, background: m.pct >= 70 ? "var(--success)" : m.pct >= 40 ? "var(--warning)" : "var(--danger)" }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* mock history */}
      {progress.mockHistory.length > 0 && (
        <section className="card p-5">
          <h2 className="font-bold mb-3 flex items-center gap-2"><Sparkles size={17} className="text-[var(--primary)]" /> {t.profile.history}</h2>
          <div className="space-y-2">
            {[...progress.mockHistory].reverse().map((h, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl bg-[var(--surface-2)] px-4 py-2.5 text-sm">
                <span className="text-[var(--muted)]">{new Date(h.date).toLocaleDateString(lang === "ar" ? "ar-SA" : "en")}</span>
                <span className="font-bold">{h.score}/{h.total}</span>
                <span className={`chip text-xs ${h.pct >= 70 ? "text-[var(--success)]" : h.pct >= 40 ? "text-[var(--warning)]" : "text-[var(--danger)]"}`}>{h.pct}%</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <Link href="/curriculum" className="btn-tonal w-full mt-5">{t.curriculum.title} ←</Link>
    </main>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: number | string; label: string }) {
  return (
    <div className="card p-4 text-center">
      <div className="flex justify-center mb-1">{icon}</div>
      <p className="text-xl font-black">{value}</p>
      <p className="text-xs text-[var(--muted)]">{label}</p>
    </div>
  );
}
