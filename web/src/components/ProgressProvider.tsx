"use client";

import { createContext, useContext, ReactNode } from "react";
import { useProgress } from "@/lib/progress";
import type { Progress } from "@/lib/types";

const Ctx = createContext<ReturnType<typeof useProgress> | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const value = useProgress();
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useProgressCtx() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useProgressCtx outside provider");
  return ctx;
}

export type { Progress };
