"use client";

/** Best-effort localStorage → PocketBase progress sync.
 *  Active only when NEXT_PUBLIC_POCKETBASE_URL is configured.
 *  Guest mode: uses a locally generated device id until real auth lands. */

const LS_USER = "rulgat.deviceId";

export function deviceId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = localStorage.getItem(LS_USER);
  if (!id) {
    id = `guest-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(LS_USER, id);
  }
  return id;
}

const URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || "";

export async function pushProgress(payload: unknown): Promise<boolean> {
  if (!URL) return false;
  try {
    const user = deviceId();
    // upsert: find existing record for this device user, else create
    const list = await fetch(
      `${URL}/api/collections/progress/records?filter=(user='${user}')&perPage=1`
    ).then((r) => r.json());
    const existing = list?.items?.[0];
    const body = JSON.stringify({ user, payload });
    const res = existing
      ? await fetch(`${URL}/api/collections/progress/records/${existing.id}`, {
          method: "PATCH", headers: { "Content-Type": "application/json" }, body,
        })
      : await fetch(`${URL}/api/collections/progress/records`, {
          method: "POST", headers: { "Content-Type": "application/json" }, body,
        });
    return res.ok;
  } catch {
    return false; // offline-first: local progress is source of truth
  }
}

export async function pullProgress(): Promise<unknown | null> {
  if (!URL) return null;
  try {
    const user = deviceId();
    const list = await fetch(
      `${URL}/api/collections/progress/records?filter=(user='${user}')&perPage=1`
    ).then((r) => r.json());
    return list?.items?.[0]?.payload ?? null;
  } catch {
    return null;
  }
}
