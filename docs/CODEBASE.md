# Codebase Map — RulGAT / كويز بوكس

> Auto-maintained. Update when adding/removing major modules.

```
RulGAT/
├── MASTER_PROMPT.md          # Source-of-truth spec (bilingual)
├── docs/                     # All living documents (see HANDOFF.md)
│   ├── HANDOFF.md            # Status log + open questions
│   ├── RULES.md              # Global agent/human rules
│   ├── UI_GUIDELINES.md      # M3+HIG+Telegram+OnePrep design system
│   ├── UI_MAP.md             # Routes/components/state inventory
│   ├── QUESTION_SCHEMA.md    # Question JSON contract
│   ├── CURRICULUM.md         # Al-Moasser 11 taxonomy (ch0–ch3)
│   ├── QIYAS_UI_SPEC.md      # Mock-test pixel spec
│   ├── PLATFORM_ROADMAP.md   # web→android→linux→macOS→windows
│   ├── SECURITY.md           # Secrets/auth/data policies
│   ├── PROMPT.md             # Sub-agent templates
│   └── DEVIOUS.md            # Decision log
├── web/                      # Next.js 14 App Router (TypeScript, Tailwind)
│   └── src/
│       ├── app/              # routes (see UI_MAP.md)
│       ├── components/       # shared UI (glass, mascot, geo, cbt…)
│       ├── lib/              # geo-core, i18n, stores, question engine
│       └── content/          # bundled question JSON shards
├── mobile/                   # Flutter app (Material 3) — scaffold
├── backend/
│   ├── pocketbase/           # binary (gitignored) + pb_data + migrations
│   └── scripts/setup-backend.sh  # one-shot provisioning
├── content/
│   ├── questions/            # *.jsonl shards (schema-validated)
│   ├── curriculum/           # chapter/topic trees
│   └── stories/              # doom-scroll story JSON
├── assets/
│   ├── mascot/               # TIGDR artwork (scraped/generated)
│   ├── design/               # oneprep token extraction notes
│   └── screenshots/          # QA evidence
├── scripts/                  # ingest/, export/, setup helpers
├── tests/                    # schema + unit + e2e
└── .github/workflows/        # build-web, build-android, release-desktop
```

## Module ownership
| Path | Owner agent | Notes |
|---|---|---|
| `web/src/app` | web-builder | routes per UI_MAP |
| `web/src/lib/geo-core` | game-builder | pure geometry, unit-tested |
| `web/src/components/cbt` | web-builder | Qiyas UI — pixel-faithful |
| `content/` | content-engineer | schema-validated only |
| `backend/` | architect | provisioning + migrations |
| `mobile/` | mobile-builder | Flutter, mirrors web |
| `docs/` | orchestrator | living documents |
