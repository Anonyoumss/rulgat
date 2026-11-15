"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, BookOpen, Plane, ClipboardList, User, MoreHorizontal } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const ITEMS = [
  { href: "/", key: "home", icon: Home },
  { href: "/curriculum", key: "curriculum", icon: BookOpen },
  { href: "/journey", key: "journey", icon: Plane },
  { href: "/practice", key: "practice", icon: ClipboardList },
  { href: "/profile", key: "profile", icon: User },
  { href: "/settings", key: "more", icon: MoreHorizontal },
] as const;

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useI18n();
  const labels = t.nav as Record<string, string>;

  // CBT screens get no bottom nav (fullscreen exam mode)
  if (pathname?.startsWith("/mock/") && pathname.split("/").length > 2) return null;

  return (
    <nav className="fixed bottom-4 inset-x-4 z-40 flex justify-center pointer-events-none">
      <div className="glass-strong pointer-events-auto flex items-center gap-1 rounded-full px-2 py-1.5">
        {ITEMS.map(({ href, key, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center gap-0.5 rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors min-w-[52px] min-h-[44px] justify-center ${
                active ? "text-[var(--primary-deep)] dark:text-[var(--primary)]" : "text-[var(--muted)]"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-[var(--primary-soft)]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon size={20} className="relative z-10" />
              <span className="relative z-10 hidden sm:inline">{labels[key]}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
