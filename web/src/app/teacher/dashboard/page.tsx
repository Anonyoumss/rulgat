"use client";

import { useMemo, useState } from "react";
import { QUESTIONS } from "@/lib/questions";
import { useProgressCtx } from "@/components/ProgressProvider";
import { useI18n } from "@/lib/i18n";
import { Users, TrendingUp, AlertTriangle, GraduationCap, Lock } from "lucide-react";

/** Teacher dashboard — /teacher/dashboard
 *  Access: secret link + teacher email (PocketBase auth pending).
 *  Currently reads local demo data; wires to backend when auth lands. */

const TEACHER_EMAILS = ["teacher@rulgat.local"]; // placeholder until Google Auth

export default function TeacherDashboard() {
  const { t, lang } = useI18n();
  const { progress } = useProgressCtx();
  const [email, setEmail] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  const stats = useMemo(() => {
    const answered = Object.keys(progress.answeredQuestions).length;
    const correct = Object.values(progress.answeredQuestions).filter((a) => a.correct).length;
    const acc = answered ? Math.round((correct / answered) * 100) : 0;

    // hardest topics = lowest accuracy among answered
    const per: Record<string, { ok: number; n: number }> = {};
    for (const q of QUESTIONS) {
      const a = progress.answeredQuestions[q.id];
      if (!a) continue;
      per[q.topic] = per[q.topic] || { ok: 0, n: 0 };
      per[q.topic].n++;
      if (a.correct) per[q.topic].ok++;
    }
    const hardest = Object.entries(per)
      .map(([topic, v]) => ({ topic, acc: v.ok / v.n }))
      .sort((a, b) => a.acc - b.acc)
      .slice(0, 5);

    const needsFollowUp = progress.delayedReports.length;

    return { answered, acc, hardest, needsFollowUp };
  }, [progress]);

  if (!unlocked) {
    return (
      <main className="mx-auto max-w-md px-4 pt-20 text-center">
        <Lock size={40} className="mx-auto text-[var(--muted)] mb-4" />
        <h1 className="text-xl font-extrabold mb-2">{lang === "ar" ? "لوحة المدرس" : "Teacher Dashboard"}</h1>
        <p className="text-sm text-[var(--muted)] mb-5">
          {lang === "ar" ? "أدخل بريد المدرس المسجل" : "Enter registered teacher email"}
        </p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="teacher@rulgat.local"
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 mb-3"
        />
        <button
          onClick={() => {
            if (TEACHER_EMAILS.includes(email.trim().toLowerCase())) setUnlocked(true);
            else alert(lang === "ar" ? "بريد غير مسجل" : "Unregistered email");
          }}
          className="btn-primary w-full"
        >
          {t.common.save}
        </button>
        <p className="text-xs text-[var(--muted)] mt-4">
          Demo gate — real auth via Google OAuth + PocketBase pending (see HANDOFF).
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 pt-6">
      <h1 className="text-2xl font-extrabold mb-1 flex items-center gap-2">
        <GraduationCap className="text-[var(--primary)]" /> {lang === "ar" ? "لوحة المدرس" : "Teacher Dashboard"}
      </h1>
      <p className="text-[var(--muted)] mb-6">{t.common.demoMode}</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={<Users size={20} />} label={lang === "ar" ? "أسئلة محلولة" : "Questions answered"} value={stats.answered} />
        <StatCard icon={<TrendingUp size={20} />} label={lang === "ar" ? "الدقة" : "Accuracy"} value={`${stats.acc}%`} />
        <StatCard icon={<AlertTriangle size={20} />} label={lang === "ar" ? "رحلات مؤجلة" : "Delayed flights"} value={stats.needsFollowUp} />
      </div>

      <section className="card p-5 mb-6">
        <h2 className="font-bold mb-3">{lang === "ar" ? "أصعب القوانين (تحتاج متابعة)" : "Hardest laws (needs follow-up)"}</h2>
        {stats.hardest.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">{lang === "ar" ? "لا بيانات بعد — يحتاج الطالب حل أسئلة" : "No data yet — student must answer questions"}</p>
        ) : (
          <div className="space-y-2">
            {stats.hardest.map((h) => (
              <div key={h.topic} className="flex items-center justify-between rounded-xl bg-[var(--surface-2)] px-4 py-2.5 text-sm">
                <span>{h.topic}</span>
                <span className="font-bold text-[var(--danger)]">{Math.round(h.acc * 100)}%</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="card p-5">
        <h2 className="font-bold mb-3">{lang === "ar" ? "تقدم الجواز" : "Passport progress"}</h2>
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((c) => (
            <span key={c} className={`chip ${progress.stamps.includes(c) ? "text-[var(--success)]" : "opacity-50"}`}>
              {progress.stamps.includes(c) ? "✅" : "⬜"} {lang === "ar" ? `باب ${c}` : `Ch ${c}`}
            </span>
          ))}
          <span className={`chip ${progress.goldStamp ? "text-[var(--accent-yellow)]" : "opacity-50"}`}>
            {progress.goldStamp ? "🏅" : "⬜"} {t.journey.goldStamp}
          </span>
        </div>
      </section>
    </main>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 text-[var(--muted)] text-sm mb-1">{icon}{label}</div>
      <p className="text-2xl font-black">{value}</p>
    </div>
  );
}
