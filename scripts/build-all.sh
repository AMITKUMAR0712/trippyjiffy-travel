#!/usr/bin/env bash
# Build both frontends for production
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> Building TrippyJiffy frontend..."
if [ ! -f "Frontend (8)/Frontend/.env.production" ]; then
  echo "WARNING: Frontend (8)/Frontend/.env.production missing — using .env.production.example"
  cp "Frontend (8)/Frontend/.env.production.example" "Frontend (8)/Frontend/.env.production"
fi
(cd "Frontend (8)/Frontend" && npm run build)

echo "==> Building Leads Extractor frontend..."
if [ ! -f "Leads-Extractor/frontend/.env.production" ]; then
  echo "WARNING: Leads-Extractor/frontend/.env.production missing — using example"
  cp "Leads-Extractor/frontend/.env.production.example" "Leads-Extractor/frontend/.env.production"
fi
(cd "Leads-Extractor/frontend" && npm run build)

echo "==> Frontend builds complete."
echo "    TrippyJiffy dist: Frontend (8)/Frontend/dist"
echo "    Leads dist:       Leads-Extractor/frontend/dist"
