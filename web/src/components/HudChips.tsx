"use client";

import { Flame, Droplets, Sparkles } from "lucide-react";
import { useProgressCtx } from "./ProgressProvider";
import { useI18n } from "@/lib/i18n";

export function HudChips() {
  const { progress } = useProgressCtx();
  const { t } = useI18n();
  return (
    <div className="flex items-center gap-2">
      <span className="chip" title={t.home.xp}>
        <Sparkles size={14} className="text-[var(--accent-purple)]" />
        {progress.xp}
      </span>
      <span className="chip" title={t.home.streak}>
        <Flame size={14} className="text-[var(--warning)]" />
        {progress.streak}
      </span>
      <span className="chip" title={t.tigdr.water}>
        <Droplets size={14} className="text-[var(--primary)]" />
        {progress.water}
      </span>
    </div>
  );
}
