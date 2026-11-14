#!/usr/bin/env bash
# setup-backend.sh — one-shot PocketBase provisioning for RulGAT.
# Downloads pinned binary, creates admin, applies JS migrations, writes .env.
# Usage: bash backend/scripts/setup-backend.sh [--host 0.0.0.0]
set -euo pipefail
cd "$(dirname "$0")/.."

PB_VERSION="0.22.10"
OS="$(uname -s | tr '[:upper:]' '[:lower:]')"
ARCH="$(uname -m)"
case "$ARCH" in x86_64) ARCH="amd64";; aarch64|arm64) ARCH="arm64";; esac

mkdir -p pocketbase/pb_data pocketbase/pb_migrations
cd pocketbase

if [ ! -f pocketbase ]; then
  echo "[*] Downloading PocketBase v${PB_VERSION} (${OS}/${ARCH})…"
  curl -fL -o pb.zip "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_${OS}_${ARCH}.zip"
  unzip -o pb.zip && rm pb.zip && chmod +x pocketbase
fi

# Create superuser non-interactively on first run
if [ ! -f pb_data/data.db ]; then
  echo "[*] Creating admin superuser…"
  ./pocketbase superuser upsert "admin@rulgat.local" "${PB_ADMIN_PASS:-$(openssl rand -hex 12)}" --dir pb_data || true
fi

# Apply JS migrations (collections/schema) — PocketBase runs *.pb.js on serve
cat > pb_migrations/0001_init.pb.js <<'EOF'
/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collections = [
    { name: "questions", fields: [
      { name: "qid", type: "text", required: true },
      { name: "lang", type: "text" },
      { name: "section", type: "text" },
      { name: "chapter", type: "number" },
      { name: "topic", type: "text" },
      { name: "topic_id", type: "text" },
      { name: "stem", type: "text", required: true },
      { name: "options", type: "json" },
      { name: "answer_index", type: "number" },
      { name: "explanation", type: "text" },
      { name: "difficulty", type: "number" },
      { name: "source", type: "text" },
    ], listRule: "", viewRule: "" },
    { name: "progress", fields: [
      { name: "user", type: "text" },
      { name: "xp", type: "number" },
      { name: "level", type: "number" },
      { name: "streak", type: "number" },
      { name: "water", type: "number" },
      { name: "payload", type: "json" },
    ], listRule: "user = @request.auth.id", viewRule: "user = @request.auth.id",
       createRule: "", updateRule: "user = @request.auth.id", deleteRule: "user = @request.auth.id" },
    { name: "stories", fields: [
      { name: "title_ar", type: "text" }, { name: "title_en", type: "text" },
      { name: "topic_id", type: "text" }, { name: "cards", type: "json" },
    ], listRule: "", viewRule: "" },
  ];
  for (const c of collections) {
    try {
      const col = new Collection({ type: "base", name: c.name });
      for (const f of c.fields) col.fields.add(new Field(f));
      if (c.listRule !== undefined) {
        col.listRule = c.listRule; col.viewRule = c.viewRule;
        col.createRule = c.createRule ?? ""; col.updateRule = c.updateRule ?? ""; col.deleteRule = c.deleteRule ?? "";
      }
      app.save(col);
    } catch (e) { /* already exists */ }
  }
}, (app) => {});
EOF

cat > ../.env <<EOF
POCKETBASE_URL=http://localhost:8090
PB_ADMIN_EMAIL=admin@rulgat.local
PB_ADMIN_PASS=${PB_ADMIN_PASS:-}
EOF

echo "[✓] Backend ready. Run: cd backend/pocketbase && ./pocketbase serve --http=0.0.0.0:8090"
