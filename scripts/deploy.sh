#!/usr/bin/env bash
# Re-deploy after git pull (updates code, rebuilds, restarts PM2)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

log() { echo -e "\n\033[1;36m==>\033[0m $*"; }

if [ "${1:-}" = "--pull" ]; then
  log "Pulling latest code..."
  git pull
fi

bash "$ROOT/scripts/install-all.sh"

log "Prisma generate (TrippyJiffy)..."
(cd "Backend (5)/Backend" && npx prisma generate)

log "Prisma generate + push (Leads)..."
(cd "Leads-Extractor/backend" && npx prisma generate && npx prisma db push)

bash "$ROOT/scripts/build-all.sh"

ln -sfn "$ROOT/Frontend (8)/Frontend/dist" "$ROOT/frontend-dist"
ln -sfn "$ROOT/Leads-Extractor/frontend/dist" "$ROOT/leads-dist"

if command -v pm2 >/dev/null 2>&1; then
  log "Restarting PM2 processes..."
  pm2 restart "$ROOT/ecosystem.config.cjs"
  pm2 save
else
  log "PM2 not found — restart backends manually"
fi

log "Deploy complete."
