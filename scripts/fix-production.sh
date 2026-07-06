#!/usr/bin/env bash
# One-shot production fix — run from repo root on VPS
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

log() { echo -e "\n\033[1;36m==>\033[0m $*"; }

log "Repo: $ROOT"

# Stop old duplicate PM2 app if running
if pm2 describe trippy >/dev/null 2>&1; then
  log "Stopping old PM2 app: trippy (was using port 5005)"
  pm2 stop trippy || true
  pm2 delete trippy || true
fi

# Env files
if [ ! -f "Backend (5)/Backend/.env" ] && [ -f "Backend (5)/Backend/.env.production.example" ]; then
  cp "Backend (5)/Backend/.env.production.example" "Backend (5)/Backend/.env"
  echo "Created Backend (5)/Backend/.env — EDIT with real secrets!"
fi

if [ ! -f "Leads-Extractor/backend/.env" ] && [ -f "Leads-Extractor/.env.production.example" ]; then
  cp "Leads-Extractor/.env.production.example" "Leads-Extractor/backend/.env"
  cp "Leads-Extractor/.env.production.example" "Leads-Extractor/.env"
  echo "Created Leads-Extractor/backend/.env — EDIT with GOOGLE_MAPS_API_KEY + DATABASE_URL!"
fi

if [ ! -f "Leads-Extractor/frontend/.env.production" ]; then
  cp "Leads-Extractor/frontend/.env.production.example" "Leads-Extractor/frontend/.env.production"
fi

if [ ! -f "Frontend (8)/Frontend/.env.production" ]; then
  cp "Frontend (8)/Frontend/.env.production.example" "Frontend (8)/Frontend/.env.production"
fi

log "Installing dependencies..."
bash "$ROOT/scripts/install-all.sh"

log "Prisma generate..."
(cd "Backend (5)/Backend" && npx prisma generate)
(cd "Leads-Extractor/backend" && npx prisma generate)

# PostgreSQL for leads
if command -v docker >/dev/null 2>&1; then
  log "Starting Leads PostgreSQL..."
  (cd Leads-Extractor && docker compose up -d postgres 2>/dev/null || docker-compose up -d postgres)
  sleep 4
fi

log "Leads DB push..."
(cd "Leads-Extractor/backend" && npx prisma db push)

log "Building frontends..."
bash "$ROOT/scripts/build-all.sh"

log "Generating nginx config for this path..."
DEPLOY_ROOT="$ROOT" bash "$ROOT/scripts/generate-nginx-config.sh"

log "Restarting PM2..."
pm2 delete trippyjiffy-api trippyjiffy-leads-api 2>/dev/null || true
pm2 start "$ROOT/ecosystem.config.cjs"
pm2 save

log "Verify (use your repo path):"
bash "$ROOT/scripts/verify-production-leads.sh" "$ROOT"

echo ""
echo "NEXT:"
echo "  1. Edit Backend (5)/Backend/.env and Leads-Extractor/backend/.env"
echo "  2. sudo cp $ROOT/deploy/nginx/generated-trippyjiffy.conf /etc/nginx/sites-available/trippyjiffy"
echo "  3. sudo nginx -t && sudo systemctl reload nginx"
echo "  4. pm2 logs trippyjiffy-leads-api  (if port 5006 fails)"
