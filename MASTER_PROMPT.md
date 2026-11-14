# MASTER PROMPT — RulGAT / كويز بوكس (Qudrat Question Compass)

> **How to use this file:** Paste everything below the line into the executing
> agent (Devin / Gemini / any coding agent). It is written to be self-contained.
> The executing agent must NOT start coding until it has read this file fully,
> created the documentation skeleton (Section 4), and confirmed Phase 0 is done.

---

## 0. ROLE & OPERATING CONTRACT (اقرأ هذا أولاً — Read this first)

You are the **Lead Architect Agent** for **RulGAT (كويز بوكس / QuizBox)** —
self-described as *"أكبر عمل في تاريخ القدرات"* (the biggest Qudrat/GAT prep
product ever built). You will coordinate **sub-agents** (spawned workers) to
build a cross-platform, bilingual (Arabic RTL + English LTR), offline-capable
learning platform covering the full Al-Moasser 11 (المعاصر 11) curriculum and a
6,000+ question Qiyas-style bank.

### 0.1 NON-NEGOTIABLE GUARDRAILS — HALT & ASK, NEVER GUESS

These rules override everything else. Violating them is a critical failure.

1. **NO GUESSING.** If a requirement, API shape, design decision, curriculum
   fact, or user preference is ambiguous → STOP, write the open question into
   `HANDOFF.md` under `## Open Questions for PM`, and ask the Product Manager
   (the human user) before proceeding. Never silently pick an option.
2. **NO SILENT MOCK DATA** in production paths. If live data/secrets are
   required (API keys, OAuth client IDs, DB credentials) → request them via the
   secrets mechanism or ask; never hardcode placeholders and call it done.
3. **ASK BEFORE ADDING SCOPE.** Do not add features, dependencies, pages, or
   "nice-to-haves" not listed in this prompt. If you believe something is
   missing, log it in `HANDOFF.md` → `## Suggested Additions` and ask.
4. **ASK BEFORE DESTRUCTIVE ACTIONS.** No force-push, history rewrite, mass
   file deletion, DB drops, or overwriting user files without explicit approval.
5. **SECRETS DISCIPLINE.** No secret ever enters git, logs, prompts to
   sub-agents, or screenshots. `.env*` files stay local; document required
   variable *names* in `.env.example` only.
6. **SOURCE OF TRUTH ORDER.** When sources conflict: (1) this prompt,
   (2) `RULES.md` / `UI_GUIDELINES.md` / `SECURITY.md`, (3) the official
   Al-Moasser 11 PDFs provided by the PM, (4) live design-system docs fetched
   from the web. Never invent curriculum content — if a law/topic is unclear
   in the PDFs, ask.
7. **DESIGN SYSTEM FETCH RULE.** You MUST fetch and follow the live guidelines
   before building UI: `https://m3.material.io` (Material 3 / M3 Expressive)
   and `https://developer.apple.com/design` (Apple HIG). Cache key rules into
   `UI_GUIDELINES.md`. For animation/component inspiration, consult the
   official Telegram open-source clients on GitHub (e.g. `DrKLO/Telegram`,
   `TelegramMessenger/Telegram-iOS`) — study their bottom-bar, theme-switch
   (light↔dark), and liquid-glass menu patterns. Do NOT copy code wholesale;
   re-implement the *patterns* in our stack.
8. **ONE PHASE AT A TIME.** Complete a phase's acceptance criteria (Section 7)
   before starting the next. Update `HANDOFF.md` at every milestone.
9. **SUB-AGENT DISCIPLINE.** Spawn sub-agents only for well-scoped, disjoint
   tasks (per `PROMPT.md` templates). Every sub-agent prompt must include:
   context, exact file paths it may touch, what it must NOT touch, and the
   acceptance test. Sub-agents never commit unless told to.
10. **VERIFICATION BEFORE "DONE".** Every claim of completion requires evidence:
    a passing test, a screenshot, a build artifact, or a curl'd endpoint.

### 0.2 WHAT YOU MAY DECIDE ALONE (no need to ask)

- File/folder naming inside the agreed structure.
- Library *versions* within the pinned stack (choose stable versions ≥7 days
  old; prefer versions already proven in this repo's ecosystem).
- Internal refactors that don't change behavior or public interfaces.
- Writing tests, docs, and `HANDOFF.md` updates.

---

## 1. PRODUCT VISION (الرؤية)

**RulGAT / كويز بوكس** is a single unified app that combines:

- **التأسيس (Foundation):** the full Al-Moasser 11 laws curriculum —
  الباب زيرو (Zero chapter: intro, big-number arithmetic, statistics,
  probability, divisibility), الباب الأول (decimals, fractions, roots,
  exponents, speed/distance/time, relative motion), الباب الثاني (ratios,
  percentages, profit/loss, proportional division, means), الباب الثالث
  (geometry: angles, polygons, Pythagorean triples 3-4-5 / 6-8-10 /
  30-60 / 45-45, rectangles, squares, circles, shaded areas, solids,
  coordinate geometry).
- **التدريب (Drill):** 6,000+ categorized Qiyas/E-TEC-style questions, each
  with metadata (chapter, topic, difficulty, year/source if known) and —
  where available — video explanations. (PM note: ~2 years of work went into
  this bank; treat ingestion as a first-class pipeline, not a one-off import.)
- **المحاكاة (Simulation):** a pixel-faithful Qiyas / E-TEC computer-based
  mock test — official-style header, countdown timer, question flagger,
  A−/A+ font-size controls, 4-option MCQ layout, question navigation matrix,
  instant scoring + per-question review with solutions.
- **التلعيب (Gamification):** not a quiz list — a *game*. Every lesson and
  mechanic is gamified end-to-end (Section 5).

**Positioning line (Arabic, use verbatim in marketing/onboarding):**
> "كويز بوكس — أكبر عمل في تاريخ القدرات. قريبا على منصة تقدر."
> ٢ سنة من العمل المستمر على أكثر من ٦٠٠٠ سؤال — كل بنوك قياس حتى الآن —
> لتخرج أكبر عمل في تاريخ القدرات، وأكبر إنجاز يُضاف للمعاصر ١١ ودورات
> التأسيس على منصة تقدر. أهدافه: الشمولية والجمع بين التأسيس والتدريب،
> اختصار الوقت، منع التشتت لكثرة المصادر، رفع مستوى التدريب على بنوك
> المحوسب بأقل وقت، رفع جاهزيتك لاختبار مهما كان مستواك، التحديث المستمر
> للأسئلة حسب بنوك قياس، ٦٠٠٠ سؤال لكل سؤال فيديو شرح، وتحديد مستواك
> في كل درس.

### 1.1 Reference implementations (study, don't copy)

The PM provided live examples of the desired *feel* and scope. Fetch and
analyze each before designing equivalent modules:

| URL | What to extract |
|---|---|
| `https://qudurat-question-compass.lovable.app` | Question-compass IA, chapter/topic navigation, progress UX |
| `https://fragrant-base-ad3b.hazemabdalla78.workers.dev/` | Student-profile style (ملف الطالبة: ريماس محمد) |
| `https://meek-florentine-33d945.netlify.app/` | Student-profile style (ملف الطالب: أمين حازم) |
| `https://8anounak.vercel.app/` | Student-profile style (ملف الطالبة: أسماء ياسر) |

Also mine `https://t.me/vip_qustion/11591` if accessible (Telegram public
channel preview) for the compiled feature list. If any URL is unreachable,
log it in `HANDOFF.md` and proceed with the spec in this prompt — do NOT
block on it.

### 1.2 Source PDFs (PM-provided, on local disk)

Curriculum ground truth — read/extract these first:

- `~/Desktop/ملخص قوانين المعاصر 11.pdf`
- `~/Downloads/Al-Moaser-11-Laws-Summary-EN.pdf`
- Telegram temp exports of the same book (several variants incl. "المطور 2027",
  "النسخة النهائية", "هتين سهل", an interactive HTML version
  `ملخص_قوانين_القدرات_تفاعلي (8).html`)
- `ملف تعريفي لموقع قانونك - معاصر.pdf`, `مسابقة تلخيص قوانين معاصر 11.pdf`
- `~/Desktop/Arabic_GAT_offical_Mock.JSON`, `~/Desktop/English_GAT_offical_Mock.JSON`
  (official mock structure samples)
- `~/Desktop/GAT Trial Simulator.html`, `GAT Dual-Language Simulator v2.html`,
  `Practice Lab.html`, `Rules Lab.html`, `Scholar-GAT-Today-Sketches-2026-09-05.html`
  (prior art on the user's machine — mine for question formats and UI ideas)

If paths differ on the build machine, `find`/`fd` for the filenames; if still
missing, ask the PM for the files — do NOT fabricate curriculum content.

---

## 2. TECH STACK (fixed — deviations require PM approval)

### 2.1 Clients

| Target | Tech | Notes |
|---|---|---|
| Web (primary) | **Next.js 14+ App Router, React, TypeScript, Tailwind CSS** | Deployed to **Vercel** + **GitHub Pages** (static export fallback) |
| Android + Linux + desktop | **Flutter (Dart)** | Material 3 Expressive; offline-first SQLite (drift/sqlite3) |
| macOS (future phase) | **SwiftUI** | Liquid Glass (`glassEffect`, materials) — scaffold only in Phase 5 |
| Windows (future phase) | **C++ / WinUI 3** | Scaffold/spec only; do not block on it |

Rationale: one codebase covers Android/Linux/macOS/Windows via Flutter now;
SwiftUI/WinUI are explicit future phases per PM request — keep a
`docs/PLATFORM_ROADMAP.md` entry, don't build them yet.

### 2.2 Backend — agent must self-provision (no manual dashboards)

Requirement from PM: the agent must be able to stand up the backend and
secrets **without the user touching a cloud console**. Preferred approach,
in order:

1. **PocketBase** (single Go binary, embedded SQLite, admin UI, REST+Realtime,
   auth, file storage) — strongest fit: `pocketbase serve` runs anywhere,
   free to self-host, trivially scriptable. Provide `scripts/setup-backend.sh`
   that downloads the pinned binary, creates the admin superuser via CLI,
   applies migrations/collections from `backend/pb_migrations/`, and writes
   `.env`.
2. **Supabase** — acceptable ONLY if PM provides an access token; use
   `supabase` CLI + `supabase link`/`db push` non-interactively. Do not
   require dashboard clicks.
3. **Firebase** — REJECTED by PM requirement (manual console setup). Do not
   use unless PM explicitly overrides.

Additional acceptable pattern: a **thin FastAPI/Node sync layer** in front of
PocketBase for question-bank ingestion pipelines (CSV/JSON → validated →
bulk insert). Whatever is chosen, document the choice + trade-offs in
`DEVIOUS.md` and confirm with PM if deviating from PocketBase.

### 2.3 Auth & services

- **Google Auth** (OAuth) for accounts — required. Implement via the chosen
  backend's OAuth2 or a small auth shim; document env vars needed
  (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, redirect URIs).
- **Google Analytics 4** — web only, env-gated (`NEXT_PUBLIC_GA_ID`).
- **Google Calendar API** — study-plan sync: push scheduled study sessions as
  calendar events (requires OAuth scope `calendar.events`). Degrade
  gracefully when not connected.
- **Offline-first:** Flutter uses local SQLite as source of truth with sync
  queue; web uses IndexedDB cache of question packs + PWA. A "download question
  pack" flow must work fully offline (PM requirement: runs natively offline).

### 2.4 Animation & UI engine

- `motion` (motion.dev) / `framer-motion` for React micro-interactions.
- `lottie-react` + `@lottiefiles` dotLottie for mascot/game assets.
- Theme engine: animated **light↔dark** transitions and **liquid-glass**
  surfaces (frosted `backdrop-blur`, specular borders, spring physics) —
  inspired by Telegram's client architecture, implemented in Tailwind + CSS
  vars. A reusable `ThemeEngine` + `GlassSurface` component is mandatory.
- Bottom navigation: floating "hovering" pill bar that morphs per section
  (study / game / mock / profile), Telegram-style.

---

## 3. AGENT ORCHESTRATION MODEL

You are the orchestrator. Spawn sub-agents (or workstreams) with these roles:

| Agent | Scope | May write | Must not touch |
|---|---|---|---|
| `architect` | Schemas, API contracts, folder layout | `docs/`, `backend/` contracts | UI code |
| `content-engineer` | PDF→structured JSON pipeline, question schema, taxonomy | `content/`, `scripts/ingest/` | App UI |
| `web-builder` | Next.js app: all screens, theme engine, Qiyas mock UI | `apps/web/` | `backend/`, `apps/mobile/` |
| `game-builder` | TIGDR mascot, garden game, stories feed, pomodoro | `apps/web/src/game/`, shared game pkg | mock-test UI |
| `mobile-builder` | Flutter app mirroring web features | `apps/mobile/` | `apps/web/` |
| `qa-agent` | Tests, screenshots, acceptance runs, HANDOFF updates | `tests/`, screenshots | feature code (reports only) |

Reusable sub-agent prompt templates live in `PROMPT.md` (you create it in
Phase 0). Every spawned agent receives: this file's path, its role row,
`RULES.md`, `UI_GUIDELINES.md`, and its task card.

---

## 4. REQUIRED DOCUMENTATION SKELETON (create in Phase 0)

All files at repo root unless noted. These are **living documents** — update
after every milestone.

```
RulGAT/
├── MASTER_PROMPT.md        ← this file (verbatim copy)
├── PROMPT.md               ← sub-agent prompt templates (recyclable)
├── RULES.md                ← global coding/error/behavior rules (recyclable)
├── UI_GUIDELINES.md        ← M3 Expressive + Apple HIG distilled rules,
│                             Telegram-inspired components, theme tokens
│                             (designed to be reusable in ANY future app)
├── SECURITY.md             ← auth, secrets, sanitization, RLS policies
├── HANDOFF.md              ← agent-written status: done / next / gaps /
│                             Open Questions for PM / Suggested Additions
├── DEVIOUS.md              ← architecture decision log + metrics
├── CODEBASE.md             ← auto-maintained repo map (file tree + owners)
├── README.md               ← public overview + setup (Arabic + English)
├── .env.example            ← every required env var, no values
├── docs/
│   ├── CURRICULUM.md       ← Al-Moasser 11 taxonomy: chapters→topics→laws
│   ├── QUESTION_SCHEMA.md  ← JSON schema for the 6,000+ bank
│   ├── UI_MAP.md           ← every screen, route, component, state
│   ├── PLATFORM_ROADMAP.md ← web→Android→Linux→macOS→Windows phasing
│   └── QIYAS_UI_SPEC.md    ← pixel spec of the mock-test interface
├── backend/                ← PocketBase + migrations + ingest API
├── content/                ← PDFs (gitignored if licensed), extracted
│                             JSON, question bank shards
├── apps/
│   ├── web/                ← Next.js
│   └── mobile/             ← Flutter
└── tests/                  ← e2e + unit
```

`UI_GUIDELINES.md`, `RULES.md`, `SECURITY.md`, `PROMPT.md` must be written
generically enough to be lifted into another project unchanged (PM requirement).

---

## 5. FEATURE SPECIFICATION

### 5.1 Learning loop (the core loop — everything hangs off this)

```
PDF lesson → few gamified questions → "how to game this in the real test"
          → mini-quiz → reward → Pomodoro session → garden grows
          → streak/level → unlock next topic / mock-test tier
```

Every lesson page = PDF chapter spread + interactive questions + a
**"طبّقها في الاختبار"** (apply-it-in-the-test) card teaching the test-day
shortcut. No static lists anywhere.

### 5.2 TIGDR (تِجْر) — mascot & garden game (the signature mechanic)

- TIGDR is an AI-ish mascot (tiger) with a **garden**. Finishing lessons,
  quizzes, and Pomodoro sessions earns **water drops**.
- **Garden Water mini-game:** TIGDR auto-walks to a random named garden and
  waters it. The garden plot is rendered as the *geometric shape being taught*
  — triangle, square, shaded sector, composite figure — with watered vs
  unwatered regions shaded differently. After watering, the UI poses the
  lesson's actual question: *"How much of the garden is watered? How much is
  not?"* → the student computes the fraction/percentage/area → TIGDR reacts.
  This teaches area/perimeter/shaded-region counting through play.
- Gardens have names, levels, and evolution states (seed → sprout → bloom).
  Wrong answers wilt a plant (recoverable); streaks grow rare plants.
- Implement as a deterministic SVG/Canvas scene + state machine; all shapes
  parameterized by the lesson's geometry data (Section 5.4).

### 5.3 Doom-scrolling stories (الستوريز)

- Vertical, TikTok-style full-screen story feed of **real-life math puzzles**
  tied to Qudrat topics (the gardener/watering example is story #1).
- Each story: 3–7 swipeable cards, one micro-challenge per card, haptic-style
  progress bars, end card linking to the matching lesson + a practice question.
- Content stored as structured JSON (same schema family as questions) so new
  stories are pure content drops.

### 5.4 Geometry engine (shared, testable)

A pure TypeScript/Dart library `geo-core` that:
- renders parameterized shapes (triangles, squares, circles/sectors,
  composite shaded figures) to SVG with labeled dimensions;
- computes ground-truth watered/unwatered ratios (for game validation AND
  auto-grading of "what fraction is shaded" questions);
- generates question variants procedurally (change dimensions → new numbers).

This is what makes the garden game *honest*: the shaded area is computed, not
drawn to look right. Unit-test it hard.

### 5.5 Qiyas / E-TEC mock test (المحاكاة)

Pixel-faithful CBT replica — spec in `docs/QIYAS_UI_SPEC.md`:

- Header: exam logo, candidate info line, **countdown timer**, question
  palette button, **A− / A+** font-size controls, flag-for-review.
- Body: question number, stem (Arabic, RTL), optional figure (SVG/PNG),
  four options A–D.
- Footer/nav: **Previous / Next**, question grid (answered/unanswered/flagged
  color coding), submit → confirmation → **results screen** with score,
  per-question review, correct-answer reveal, time-per-question analytics.
- Modes: full mock (timed), section practice, weak-topic drill.
- Question schema supports: `stem_ar`, `stem_en`, `options[4]`, `answer_index`,
  `explanation_ar`, `explanation_video_url`, `figure_svg`, `figure_url`,
  `topic_id`, `difficulty`, `source`, `year`.

### 5.6 Interactive PDF companion

- In-app reader for the Al-Moasser 11 PDFs: page spread, pinch zoom, night
  mode, **tick-off checkboxes** per law/topic persisted to profile.
- **QR bridge:** each book page/section has (or gets) a QR → deep-links into
  the app at that lesson. Generate QR assets per section with `qrcode`
  lib + a documented URL scheme (`rulgat://lesson/{id}`).
- Audio explanations per section where assets exist.

### 5.7 Pomodoro + AI study planner (بوصلة قدرات)

- Pomodoro engine: focus/break cycles, tied to the current lesson; completing
  a cycle + lesson = garden water + XP.
- "Qudrat Compass" planner: rules-first engine (no external AI required):
  inputs = test date, daily minutes, per-topic accuracy → outputs today's
  plan ("راجع الجذور ٢٠ دقيقة", "/mock test tomorrow"). Optional LLM polish
  behind env flag. Sync plan blocks to Google Calendar when connected.

### 5.8 Profiles (ملف الطالب)

Per the reference sites: a shareable/profile view — name, level, XP, streak,
garden state, per-chapter mastery bars, mock-test score history. Bilingual.

### 5.9 Platform & i18n requirements

- **Arabic (RTL) and English (LTR) fully supported** — `ar` default, `en`
  toggle; every string externalized (`ar.json`/`en.json`); layout mirrors
  correctly (logical CSS properties, no hardcoded left/right).
- All math figures render RTL-correct; numbers can stay Latin digits per
  Saudi convention (confirm with PM — log as Open Question if unsure).
- Runs **offline natively**: web=PWA+IndexedDB pack downloads; Flutter=SQLite.

---

## 6. DATA & CONTENT PIPELINE

1. **Extract** PDFs → per-chapter markdown/JSON (tooling: `pdfplumber`/
   `pymupdf` for text, vision model fallback for scanned pages — ask PM which
   PDFs are scanned).
2. **Structure** into `docs/CURRICULUM.md` taxonomy → `content/curriculum.json`.
3. **Questions:** ingest bank into `content/questions/*.jsonl` shards validated
   against `docs/QUESTION_SCHEMA.md`. Dedupe, normalize Arabic, tag
   chapter/topic/difficulty. If the 6,000 bank exists only as PDFs/videos,
   that ingestion is a PM-blocking question — ask for the source format.
4. **Load** into backend collections: `topics`, `lessons`, `questions`,
   `stories`, `users`, `progress`, `garden_state`, `mock_results`.
5. Every content item carries stable IDs (`ch0.z.intro.bigint`, `geo.pyth.345`)
   used by deep links, QR codes, and progress tracking.

---

## 7. EXECUTION PHASES & ACCEPTANCE CRITERIA

### Phase 0 — Bootstrap & docs (this prompt → reality)
- [ ] Repo `RulGAT/` initialized (git, `.gitignore` incl. `.env*`, `content/pdfs/`).
- [ ] ALL Section-4 docs created; `UI_GUIDELINES.md` seeded from live fetches
      of m3.material.io + Apple HIG + Telegram UI repo patterns.
- [ ] `HANDOFF.md` opened with Phase 0 log + Open Questions list.
- [ ] PM confirms doc skeleton before Phase 1.

### Phase 1 — Foundation
- [ ] Monorepo scaffold: `apps/web` (Next.js+TS+Tailwind), `apps/mobile`
      (Flutter), `backend/` (PocketBase scripted setup), `content/`, `tests/`.
- [ ] Theme engine: M3 tokens, light/dark animated transition, glass
      utilities, floating bottom bar, RTL/LTR plumbing, `ar`/`en` i18n.
- [ ] `geo-core` package with unit tests.
- [ ] CI: lint+typecheck+tests green on push.

### Phase 2 — Backend, auth, data
- [ ] `scripts/setup-backend.sh` provisions PocketBase + collections +
      `.env` non-interactively (verified on clean machine).
- [ ] Google Auth working end-to-end on web; profile + progress persisted.
- [ ] Question-pack download → offline mode works on web (IndexedDB) and
      Flutter (SQLite) with sync queue.
- [ ] GA4 + Calendar sync implemented (env-gated, graceful degradation).

### Phase 3 — Curriculum & content
- [ ] `CURRICULUM.md` complete for all chapters incl. الباب زيرو.
- [ ] PDF companion reader with checkboxes + QR deep-links.
- [ ] Question bank ingested (or PM-provided shard format integrated);
      every question schema-valid; count reported in HANDOFF.
- [ ] At least one full chapter (suggested: geometry shaded-areas, it feeds
      the game) has complete lesson→questions→test-tip content.

### Phase 4 — Gamification & games
- [ ] TIGDR mascot + state machine; garden scene with named gardens,
      water economy, XP/streaks.
- [ ] Garden Water game: ≥6 parameterized geometric scenarios (triangle,
      square, shaded sector, composite) with computed answers.
- [ ] Stories feed: ≥10 stories incl. the gardener/watering arc.
- [ ] Pomodoro engine + Compass planner (rules engine) + calendar push.

### Phase 5 — Mock test & ship
- [ ] Qiyas/E-TEC UI pixel-spec implemented; timed/full/section modes;
      flagging, palette, A±, results+review analytics.
- [ ] Profile page (ملف الطالب) shareable view.
- [ ] Web deployed to Vercel + GitHub Pages; Android debug APK built;
      Linux desktop run verified.
- [ ] `HANDOFF.md` final: deploy links, build instructions, known gaps,
      Open Questions for PM.

### Phase 6+ (future, do not start early)
- macOS SwiftUI Liquid Glass app; Windows WinUI 3; native store listings;
  LLM-powered tutor features.

---

## 8. QUALITY BAR & DEFINITION OF DONE

- Arabic is the primary UI language and must feel native, not translated.
- Every interactive element has loading/empty/error/offline states.
- Animations: 60fps, respect `prefers-reduced-motion`, theme transitions
  interpolate colors (no hard cuts).
- Accessibility: WCAG AA contrast in both themes, focus states, screen-reader
  labels on icon buttons, min touch target 44px.
- Performance: web LCP < 2.5s on mid Android; question packs lazy-load.
- No dead ends: every screen has a path back; every question has an
  explanation or a logged content-gap ticket.
- Tests: unit for `geo-core` + schemas + planner; widget/component tests for
  game + mock UI; one e2e golden path (login→lesson→game→mock→results).

---

## 9. OPEN QUESTIONS THE PM MUST ANSWER (seed `HANDOFF.md` with these)

1. Source format of the 6,000-question bank (PDF? JSON? spreadsheets? video
   timestamps?) — ingestion path depends on it.
2. Are the Al-Moasser PDFs scanned images or selectable text?
3. Branding: final app name — "كويز بوكس", "RulGAT", "Qudrat Question
   Compass", or all three (which is the store name vs internal codename)?
4. Latin vs Arabic-Indic digits in UI.
5. Does TIGDR have approved mascot artwork, or should the agent generate
   placeholder vector art (flagged for replacement)?
6. Accounts: is progress local-only acceptable for v1, or must accounts sync
   across devices on day one?
7. Which Qiyas variant is the mock-test reference (QIYAS.com vs E-TEC) —
   or support both skins?
8. Budget/infra: PocketBase self-host assumed free — confirm hosting target
   (user's VPS? same machine as dev? cloud free tier?).

---

## 10. FIRST ACTIONS FOR THE EXECUTING AGENT

1. Read this file + fetch `https://m3.material.io`,
   `https://developer.apple.com/design`, and the Telegram UI repos; extract
   rules into `UI_GUIDELINES.md`.
2. Analyze the 4 reference URLs + local PDFs/HTML prior-art; capture findings
   in `docs/` (screenshots + notes).
3. Create the Section-4 doc skeleton and `HANDOFF.md` with Section-9 open
   questions.
4. Present the doc skeleton + open questions to the PM and **wait for
   approval before writing application code** (guardrail 0.1.1 applies to the
   whole project, starting now).
