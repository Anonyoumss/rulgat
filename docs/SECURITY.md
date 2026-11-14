# Security — RulGAT / كويز بوكس

## Secrets
- All secrets via environment variables; `.env*` is gitignored.
- `.env.example` lists variable names only — never values.
- PocketBase admin credentials generated locally, stored in `backend/.env`
  (gitignored). Production: use PocketBase's built-in auth + RLS rules.

## Data
- User progress syncs only to the configured backend; no third-party
  telemetry except GA4 (env-gated, anonymous).
- Question content is static assets; no user-generated content in v1
  (no XSS surface beyond rendering question text — always escape/`{text}`,
  never `dangerouslySetInnerHTML` for question stems).
- Google OAuth tokens (Calendar scope) stored server-side only.

## API
- Backend API rules: progress writes require auth; question reads are public.
- Rate-limit auth endpoints; PocketBase provides request logging.

## Dependencies
- Pin dependency versions; prefer releases ≥7 days old.
- Run `npm audit` before each release; fix criticals, document accepted risk.
