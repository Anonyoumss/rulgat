# Decision Log — DEVIOUS (أرشيف القرارات)

Format: `## YYYY-MM-DD — Title` → Context / Decision / Consequences.

## 2026-11-14 — Stack selection
- **Context:** PM requires agent-self-provisioned backend, offline native
  apps, web deploy to Vercel+GitHub Pages.
- **Decision:** Next.js 14 (web) + Flutter (Android/Linux/macOS/Windows
  future) + PocketBase (single-binary backend, scriptable, no dashboard).
  Firebase rejected (manual console). Supabase acceptable only with token.
- **Consequences:** `backend/scripts/setup-backend.sh` must provision
  PocketBase non-interactively; web works in demo/local mode without it.

## 2026-11-14 — Design system fusion
- **Context:** PM wants OnePrep-quality UI + Telegram interaction patterns
  + M3/HIG compliance.
- **Decision:** Design tokens extracted from OnePrep CSS mirror
  (`~/Desktop/oneprep_download/_next/static/css/`); interaction patterns
  (liquid glass, floating nav, theme morph) re-implemented per
  docs/UI_GUIDELINES.md — code not copied wholesale (licensing + RTL).
- **Consequences:** `assets/design/oneprep-tokens.md` is the token source;
  components consume tokens only.

## 2026-11-14 — Mascot
- **Context:** PM: "copy Preppy with tiqdr.com mascot" → clarified:
  scrape mascot/brand images directly from tiqdr.com.
- **Decision:** Crawl tiqdr.com (+app.tiqdr.com if reachable) for mascot
  assets into `assets/mascot/`; fallback = original TIGDR tiger SVG.
  Preppy assets NOT copied (different IP).
- **Consequences:** mascot module has pluggable asset slots (happy/sad/
  thinking/proud) — missing moods render fallback.

## 2026-11-14 — Content seed
- **Context:** 6,000-question bank source unknown; only official mock
  JSONs found locally.
- **Decision:** Ship schema + ingest pipeline + 192-question seed bank
  (AR+EN official mocks) now; bulk ingestion blocked on PM providing
  source (logged in HANDOFF Open Questions).
- **Consequences:** app is fully functional on seed content; question
  count reported honestly in UI ("ت grows as bank expands").
