#!/usr/bin/env bash
# First-time production setup after git clone
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

log() { echo -e "\n\033[1;36m==>\033[0m $*"; }
warn() { echo -e "\033[1;33mWARNING:\033[0m $*"; }

log "TrippyJiffy + Leads Extractor — production setup"
log "Repo root: $ROOT"

# --- Node check ---
if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: Node.js 18+ required. Install from https://nodejs.org/"
  exit 1
fi
NODE_MAJOR=$(node -p "process.versions.node.split('.')[0]")
if [ "$NODE_MAJOR" -lt 18 ]; then
  echo "ERROR: Node.js 18+ required (found $(node -v))"
  exit 1
fi
log "Node $(node -v) OK"

# --- Copy .env templates if missing ---
copy_env() {
  local example="$1"
  local target="$2"
  if [ ! -f "$target" ] && [ -f "$example" ]; then
    cp "$example" "$target"
    warn "Created $target — EDIT with your real secrets before going live!"
  fi
}

copy_env "Backend (5)/Backend/.env.production.example" "Backend (5)/Backend/.env"
copy_env "Frontend (8)/Frontend/.env.production.example" "Frontend (8)/Frontend/.env.production"
copy_env "Leads-Extractor/.env.production.example" "Leads-Extractor/.env"
copy_env "Leads-Extractor/.env.production.example" "Leads-Extractor/backend/.env"
copy_env "Leads-Extractor/frontend/.env.production.example" "Leads-Extractor/frontend/.env.production"

# --- Install ---
bash "$ROOT/scripts/install-all.sh"

# --- TrippyJiffy Prisma ---
log "Generating TrippyJiffy Prisma client..."
(cd "Backend (5)/Backend" && npx prisma generate)

# --- Leads PostgreSQL ---
if command -v docker >/dev/null 2>&1; then
  log "Starting Leads PostgreSQL (Docker)..."
  if docker ps -a --format '{{.Names}}' | grep -q '^travel-leads-db$'; then
    docker start travel-leads-db >/dev/null 2>&1 || true
  else
    (cd "Leads-Extractor" && docker compose up -d postgres 2>/dev/null || docker-compose up -d postgres)
  fi
  log "Waiting for PostgreSQL on port 5433..."
  for i in $(seq 1 30); do
    if (echo >/dev/tcp/127.0.0.1/5433) 2>/dev/null; then
      break
    fi
    sleep 1
  done
else
  warn "Docker not found — ensure PostgreSQL is running and DATABASE_URL in Leads-Extractor/.env is correct"
fi

# --- Leads Prisma ---
log "Setting up Leads database schema..."
(cd "Leads-Extractor/backend" && npx prisma generate && npx prisma db push)

# --- Playwright for email scraping ---
log "Installing Playwright Chromium (Leads email scraper)..."
(cd "Leads-Extractor/backend" && npx playwright install chromium)

# --- Build frontends ---
bash "$ROOT/scripts/build-all.sh"

# Symlink dist folders (avoids spaces in Nginx paths)
log "Creating deploy symlinks..."
ln -sfn "$ROOT/Frontend (8)/Frontend/dist" "$ROOT/frontend-dist"
ln -sfn "$ROOT/Leads-Extractor/frontend/dist" "$ROOT/leads-dist"

# --- PM2 ---
if command -v pm2 >/dev/null 2>&1; then
  log "Starting APIs with PM2..."
  pm2 start "$ROOT/ecosystem.config.cjs" || pm2 restart "$ROOT/ecosystem.config.cjs"
  pm2 save
  warn "Run 'pm2 startup' once to auto-start on server reboot"
else
  warn "PM2 not installed. Install: npm install -g pm2"
  warn "Then run: npm run pm2:start"
fi

log "Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit .env files with your production secrets:"
echo "       Backend (5)/Backend/.env"
echo "       Leads-Extractor/backend/.env"
echo "  2. Copy Nginx config:"
echo "       deploy/nginx/trippyjiffy.conf → /etc/nginx/sites-available/"
echo "  3. Point document roots to this repo's dist folders (see nginx file)"
echo "  4. sudo nginx -t && sudo systemctl reload nginx"
echo "  5. Enable SSL: sudo certbot --nginx -d trippyjiffy.com -d www.trippyjiffy.com"
echo ""
echo "URLs after Nginx:"
echo "  https://trippyjiffy.com          — main site"
echo "  https://trippyjiffy.com/leads/   — leads panel"
echo "  https://trippyjiffy.com/api      — TrippyJiffy API"
echo "  https://trippyjiffy.com/leads-api — Leads API"
