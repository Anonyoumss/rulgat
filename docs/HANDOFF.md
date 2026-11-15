# Handoff — RulGAT (رولقات / قانونك)

> Living status document. The executing agent updates this after every milestone.
> Format: `### Phase N — Title (status)` → bullets of what was done, then
> `## Open Questions for PM` and `## Known Gaps`.

## Current Status

**REBRAND + journey rework applied (2026-11-15):** corrected spec —
app name is **RulGAT (رولقات / قانونك)**, mascot is **Tiqdr the traveler
boy** (passport + suitcase), gamification is the **GAT Travel Passport
airport journey** (boarding pass, chapter stamps, delayed flights). The
earlier garden/tiger implementation was removed. `MASTER_PROMPT.md`
replaced with the corrected definitive spec.

New routes: `/journey` (check-in + departure board + stamps + delayed
reports + final-exam CTA), `/challenge/[chapter]` (10-question challenge
→ stamp ≥7/10 or رحلة مؤجلة report), `/laws/[chapter]` (traffic-light
laws map), `/teacher/dashboard` (email-gated demo analytics). Airport
audio cues via WebAudio (`web/src/lib/sounds.ts`). Build green.

Previous status: Phase 1–5 core build MOSTLY COMPLETE — web app builds
clean, 191-question seed bank validated, Qiyas CBT mock, stories,
pomodoro, planner, profile — all functional in demo/local mode. Flutter
scaffold + CI workflows added. Backend provisioning script written
(not yet executed).

## Phase Log

### Phase 0 — Bootstrap & docs
- Repo initialized at `RulGAT/` (git, main branch).
- MASTER_PROMPT.md (bilingual spec) committed as source of truth.
- Directory skeleton: `web/`, `mobile/`, `backend/`, `content/`, `docs/`,
  `assets/`, `.github/workflows/`, `tests/`.
- Seed question bank discovered locally: `Arabic_GAT_offical_Mock.JSON` (96)
  + `English_GAT_offical_Mock.JSON` (96) = 192 real GAT questions.
- Design reference: OnePrep mirror at `~/Desktop/oneprep_download` (Next.js
  CSS design tokens + Preppy mascot assets); tiqdr.com scraped for brand assets.

### Phase 1 — Foundation (done)
- Next.js 14 + TS + Tailwind scaffolded; M3/OnePrep token system in
  globals.css; liquid-glass utilities; animated light/dark theme engine;
  floating pill BottomNav (framer-motion layoutId); full AR/EN i18n with
  RTL/LTR switching.
- `geo-core` lib: parametric garden scenes (grid, triangle, sector,
  composite) with mathematically computed wateredRatio + formatRatio.
- 191 questions ingested & schema-validated (scripts/ingest_questions.py,
  validate_questions.py, tests/questions.test.mjs — all pass).

### Phase 2 — Backend, auth, data (partial)
- `backend/scripts/setup-backend.sh` written: downloads PocketBase 0.22.10,
  creates superuser, writes pb_migrations/0001_init.pb.js (questions,
  progress, stories collections) + backend/.env. NOT yet executed locally.
- Web app runs fully in demo mode (localStorage/IndexedDB-style progress);
  PocketBase sync layer NOT yet wired into the client.
- Google Auth/Analytics/Calendar: env-gated stubs, not implemented.

### Phase 3 — Curriculum & content (partial)
- docs/CURRICULUM.md taxonomy complete (ch0–ch3, 24 topics).
- Lesson content: concise summaries + test-tips for key topics in
  lib/curriculum.ts; full PDF-derived content pending.
- Interactive PDF companion: NOT built (⬜ in UI_MAP).

### Phase 4 — Gamification & games (done, core)
- TIGDR mascot (original SVG tiger — tiqdr.com mascot asset not found on
  public pages; brand logo/slider saved to assets/mascot/).
- /tigdr hub + /tigdr/play: Garden Water game — TIGDR watering animation,
  GeoScene SVG rendering, watered/dry ratio questions with computed
  ground truth, XP/water rewards, streaks.
- /stories: doom-scroll vertical feed (drag/swipe cards) — 3 stories incl.
  the canonical gardener/watering arc.
- /pomodoro: 25/5 focus timer → water drops + XP.
- /planner: rules-based Qudrat Compass (accuracy-driven review topics,
  mock cadence near test date).

### Phase 5 — Mock test & ship (partial)
- /mock setup (chapter/section/count/duration) → /mock/exam full CBT UI:
  sticky top bar (logo, topic, counter, A−/A+ font steps, countdown timer
  with <5min urgency pulse, flag toggle, question palette modal with
  answered/flagged/current states), 4-option rows, prev/next footer,
  finish confirmation, auto-submit at 0, resume via sessionStorage.
- /mock/results: score banner, per-topic accuracy bars, full review with
  explanations, recordMock → profile history.
- /profile (ملف الطالب): XP/level ring, streak/water/mocks chips,
  per-chapter mastery bars, mock history.
- /settings: AR/EN toggle, light/dark/system theme, danger-zone reset.
- Web build green: `npm run build` → 17 routes, all static except
  /lesson/[id]. Dev server smoke-tested (200s on /, /mock, /tigdr/play).
- Flutter scaffold (mobile/lib/main.dart) — Material 3, AR/EN, 5-tab shell;
  NOT yet built (no local Flutter toolchain).
- CI: .github/workflows/build-web.yml + build-android.yml written.
- GitHub repo + push: pending at time of writing (see git log).

## Open Questions for PM
1. Source format of the full 6,000-question bank (PDF? JSON? spreadsheets?).
   Only 192-question official mock JSONs were found locally so far.
2. Are the Al-Moasser 11 PDFs selectable text or scanned images?
3. Final branding: "كويز بوكس" vs "RulGAT" vs "Qudrat Question Compass"?
4. Latin digits vs Arabic-Indic digits in the UI?
5. Tiqdr mascot: official cartoon-boy art (passport+suitcase) needed —
   current SVG is an original placeholder.
6. Local-only progress OK for v1, or must accounts sync on day one?
7. Mock-test reference: QIYAS.com, E-TEC, or both skins?
8. Backend hosting target for PocketBase (local/VPS/cloud free tier)?

## Known Gaps
- Question bank is a seed (191 questions), not 975+/6,000 — content pipeline
  is ready but bulk ingestion awaits PM source ("زبدة بنوك المحوسب" format).
- PocketBase backend scripted but not executed/deployed; no live sync yet.
- Flutter client is a scaffold shell — features not yet ported; APK builds
  in CI only.
- Google Auth / Analytics / Calendar are env-gated stubs pending credentials.
- Interactive PDF companion not built; QR deep-links not generated; exact
  PDF page numbers for the laws map need extraction from the Al-Moasser PDF.
- Tiqdr mascot is an original placeholder SVG (traveler boy) — official
  tiqdr.com mascot art not publicly exposed; needs brand asset from PM.
- Teacher dashboard is a demo email gate; real auth needs Google OAuth +
  PocketBase teacher role.
- Stories content is 3 hand-written stories; needs bulk content pipeline.
- macOS SwiftUI / Windows WinUI are roadmap-only per spec.
