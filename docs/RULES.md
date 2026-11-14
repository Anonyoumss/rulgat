# Rules — RulGAT / كويز بوكس

Global rules for every agent and human contributor. Recyclable across projects.

## Behavior
1. NO GUESSING — ambiguous requirement → log in HANDOFF.md → ask PM.
2. NO SCOPE CREEP — only build what MASTER_PROMPT.md / task card specifies.
3. NO SECRETS IN REPO — `.env*` gitignored; `.env.example` documents names only.
4. VERIFY BEFORE DONE — tests, build, or screenshot evidence required.
5. One phase at a time; update HANDOFF.md at every milestone.

## Code
- TypeScript strict mode everywhere; no `any` without justification comment.
- React Server Components by default; `"use client"` only when needed.
- Tailwind for styling; design tokens from `docs/UI_GUIDELINES.md` only —
  no hardcoded hex colors in components.
- Arabic-first: every user-facing string via i18n (`ar` default, `en` toggle).
- Logical CSS properties (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`) —
  never `left-`/`right-`/`ml-`/`mr-` for layout direction.
- Math content supports RTL; use `<bdi>`/dir isolation for mixed-direction text.

## Content
- Questions validate against `docs/QUESTION_SCHEMA.md` before ingest.
- Never fabricate curriculum content; gaps go to HANDOFF.md.
- Every question needs `explanation` or a logged content-gap ticket.

## Git
- Conventional-ish commits: `feat:`, `fix:`, `chore:`, `docs:`.
- Never force-push or rewrite history without PM approval.
