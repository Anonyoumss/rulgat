"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bike, Car, Rocket, Cog, Shield, Flame, Lock, Check, ChevronLeft } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/cn";

const DISTRICTS = [
  { id: "old-town", price: 0, requires: "" },
  { id: "market", price: 200, requires: "old-town" },
  { id: "airport", price: 500, requires: "market" },
  { id: "university", price: 1000, requires: "airport" },
  { id: "skyline", price: 2000, requires: "university" },
];

const VEHICLES = [
  { id: "scooter", name_ar: "سكوتر", name_en: "Scooter", price: 0, icon: Bike },
  { id: "sedan", name_ar: "سيدان", name_en: "Sedan", price: 300, icon: Car },
  { id: "sportscar", name_ar: "سيارة رياضية", name_en: "Sports Car", price: 800, icon: Car },
  { id: "jetcar", name_ar: "سيارة نفاثة", name_en: "Jet Car", price: 2000, icon: Rocket },
];

const UPGRADES = [
  { kind: "engine" as const, icon: Cog },
  { kind: "armor" as const, icon: Shield },
  { kind: "nitro" as const, icon: Flame },
];
const UPGRADE_BASE = 150;
const MAX_LVL = 5;

export default function CityPage() {
  const { t, lang } = useI18n();
  const { progress, buyVehicle, buyUpgrade, unlockDistrict } = useProgress();
  const [flash, setFlash] = useState("");

  const names = t.city.districtNames as Record<string, string>;
  const vehicle = VEHICLES.find((v) => v.id === progress.vehicle) ?? VEHICLES[0];
  const VehicleIcon = vehicle.icon;

  const act = (fn: () => boolean, msg: string) => {
    if (fn()) setFlash(msg);
    else setFlash("");
  };

  return (
    <main className="mx-auto max-w-2xl px-4 pt-6 pb-28">
      <Link href="/journey" className="inline-flex items-center gap-1 text-sm text-[var(--muted)] mb-4">
        <ChevronLeft size={16} className="ltr:rotate-180" /> {t.common.back}
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black">{t.city.title}</h1>
        <span className="chip !bg-[var(--accent-yellow)]/15 text-[var(--accent-yellow)] font-bold">
          🪙 {progress.coins} {t.city.coins}
        </span>
      </div>
      <p className="text-sm text-[var(--muted)] mb-6">{t.city.earnHint}</p>
      {flash && <p className="text-sm text-[var(--success)] mb-4 font-semibold">{flash}</p>}

      {/* districts map */}
      <section className="card p-5 mb-5">
        <h2 className="font-bold mb-4">{t.city.districts}</h2>
        <div className="relative">
          <div className="absolute top-6 bottom-6 start-6 w-1 rounded-full bg-[var(--border)]" />
          <div className="space-y-3">
            {DISTRICTS.map((d, i) => {
              const unlocked = progress.districts.includes(d.id);
              const prevUnlocked = !d.requires || progress.districts.includes(d.requires);
              const canBuy = !unlocked && prevUnlocked && progress.coins >= d.price;
              return (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={cn(
                    "relative flex items-center gap-4 rounded-2xl border p-4",
                    unlocked ? "border-[var(--success)]/40 bg-[var(--success)]/5" : "border-[var(--border)] opacity-80"
                  )}
                >
                  <span className={cn(
                    "relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl",
                    unlocked ? "bg-[var(--success)] text-white" : "bg-[var(--surface-2)]"
                  )}>
                    {unlocked ? <Check size={20} /> : <Lock size={18} className="text-[var(--muted)]" />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold">{names[d.id] ?? d.id}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {unlocked ? t.city.owned : d.price === 0 ? "—" : `🪙 ${d.price}`}
                    </p>
                  </div>
                  {!unlocked && d.price > 0 && (
                    <button
                      onClick={() => act(() => unlockDistrict(d.id, d.price, d.requires), t.city.unlock)}
                      disabled={!canBuy}
                      className={cn("btn text-xs px-4", canBuy ? "btn-primary" : "btn-ghost opacity-50")}
                    >
                      {t.city.unlock}
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* garage */}
      <section className="card p-5 mb-5">
        <h2 className="font-bold mb-1">{t.city.garage}</h2>
        <p className="text-sm text-[var(--muted)] mb-4 flex items-center gap-2">
          <VehicleIcon size={18} /> {lang === "ar" ? vehicle.name_ar : vehicle.name_en}
        </p>

        <div className="grid grid-cols-2 gap-2.5 mb-5">
          {VEHICLES.map((v) => {
            const Icon = v.icon;
            const isCurrent = progress.vehicle === v.id;
            const order = VEHICLES.map((x) => x.id);
            const ownedTier = order.indexOf(progress.vehicle);
            const canBuy = order.indexOf(v.id) === ownedTier + 1 && progress.coins >= v.price;
            return (
              <button
                key={v.id}
                onClick={() => act(() => buyVehicle(v.id, v.price), "✓")}
                disabled={!canBuy}
                className={cn(
                  "rounded-2xl border p-4 text-center transition-all",
                  isCurrent
                    ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                    : canBuy
                      ? "border-[var(--border)] hover:border-[var(--primary)]/50"
                      : "border-[var(--border)] opacity-50"
                )}
              >
                <Icon size={28} className="mx-auto mb-2 text-[var(--primary)]" />
                <p className="font-bold text-sm">{lang === "ar" ? v.name_ar : v.name_en}</p>
                <p className="text-xs text-[var(--muted)] mt-1">
                  {isCurrent ? t.city.owned : v.price === 0 ? "—" : `🪙 ${v.price}`}
                </p>
              </button>
            );
          })}
        </div>

        {/* upgrades */}
        <h3 className="font-bold mb-3">{t.city.upgrade}</h3>
        <div className="space-y-2.5">
          {UPGRADES.map(({ kind, icon: Icon }) => {
            const lvl = progress.upgrades[kind];
            const price = UPGRADE_BASE * (lvl + 1);
            const maxed = lvl >= MAX_LVL;
            const canBuy = !maxed && progress.coins >= price;
            const label = kind === "engine" ? t.city.engine : kind === "armor" ? t.city.armor : t.city.nitro;
            return (
              <div key={kind} className="flex items-center gap-3 rounded-2xl border border-[var(--border)] p-3.5">
                <Icon size={20} className="text-[var(--primary)] shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">{label}</p>
                  <div className="flex gap-1 mt-1">
                    {Array.from({ length: MAX_LVL }, (_, i) => (
                      <span key={i} className={cn("h-1.5 w-6 rounded-full", i < lvl ? "bg-[var(--primary)]" : "bg-[var(--border)]")} />
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => act(() => buyUpgrade(kind, price), "✓")}
                  disabled={!canBuy}
                  className={cn("btn text-xs px-3", canBuy ? "btn-primary" : "btn-ghost opacity-50")}
                >
                  {maxed ? t.city.maxed : `🪙 ${price}`}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* current ride summary */}
      <section className="card p-5 text-center">
        <p className="text-sm text-[var(--muted)] mb-1">{t.city.vehicle}</p>
        <p className="text-lg font-black flex items-center justify-center gap-2">
          <VehicleIcon size={22} className="text-[var(--primary)]" />
          {lang === "ar" ? vehicle.name_ar : vehicle.name_en}
        </p>
        <div className="flex justify-center gap-4 mt-2 text-xs text-[var(--muted)]">
          {UPGRADES.map(({ kind, icon: Icon }) => (
            <span key={kind} className="flex items-center gap-1">
              <Icon size={12} /> {progress.upgrades[kind]}/{MAX_LVL}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
