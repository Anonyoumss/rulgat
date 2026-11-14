"use client";

import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/components/ThemeProvider";
import { useProgressCtx } from "@/components/ProgressProvider";
import { Sun, Moon, MonitorSmartphone, Trash2, Languages } from "lucide-react";
import { cn } from "@/lib/cn";
import Mascot from "@/components/Mascot";

export default function SettingsPage() {
  const { t, lang, setLang } = useI18n();
  const { theme, setTheme } = useTheme();
  const { resetAll } = useProgressCtx();

  return (
    <main className="mx-auto max-w-2xl px-4 pt-6">
      <h1 className="text-2xl font-extrabold mb-6">{t.settings.title}</h1>

      <div className="space-y-4">
        {/* language */}
        <section className="card p-5">
          <h2 className="font-bold mb-3 flex items-center gap-2"><Languages size={17} /> {t.settings.language}</h2>
          <div className="flex gap-2">
            {(["ar", "en"] as const).map((l) => (
              <button key={l} onClick={() => setLang(l)} className={cn("chip cursor-pointer px-5 py-2", lang === l && "ring-2 ring-[var(--primary)]")}>
                {l === "ar" ? t.common.arabic : t.common.english}
              </button>
            ))}
          </div>
        </section>

        {/* theme */}
        <section className="card p-5">
          <h2 className="font-bold mb-3">{t.settings.theme}</h2>
          <div className="flex gap-2">
            {([["light", Sun], ["dark", Moon], ["system", MonitorSmartphone]] as const).map(([th, Icon]) => (
              <button key={th} onClick={() => setTheme(th)} className={cn("chip cursor-pointer px-4 py-2 flex items-center gap-1.5", theme === th && "ring-2 ring-[var(--primary)]")}>
                <Icon size={15} /> {th === "light" ? t.settings.light : th === "dark" ? t.settings.dark : t.settings.system}
              </button>
            ))}
          </div>
        </section>

        {/* about */}
        <section className="card p-5 flex items-center gap-4">
          <Mascot mood="happy" size={56} />
          <div>
            <h2 className="font-bold">{t.appName}</h2>
            <p className="text-sm text-[var(--muted)]">{t.tagline}</p>
            <p className="text-xs text-[var(--muted)] mt-1">{t.common.demoMode}</p>
          </div>
        </section>

        {/* danger */}
        <section className="card p-5 border-[var(--danger)]/30">
          <h2 className="font-bold mb-2 text-[var(--danger)]">{lang === "ar" ? "منطقة الخطر" : "Danger zone"}</h2>
          <p className="text-sm text-[var(--muted)] mb-3">{lang === "ar" ? "يمسح كل التقدم والبيانات المحلية" : "Erases all local progress and data"}</p>
          <button onClick={() => { if (confirm(lang === "ar" ? "متأكد؟ لا يمكن التراجع" : "Are you sure? This cannot be undone")) resetAll(); }} className="btn-danger">
            <Trash2 size={16} /> {lang === "ar" ? "مسح بياناتي" : "Erase my data"}
          </button>
        </section>
      </div>
    </main>
  );
}
