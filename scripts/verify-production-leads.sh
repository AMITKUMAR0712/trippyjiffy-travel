#!/usr/bin/env bash
# Quick checks for /leads/ production issues — run on the VPS
set -euo pipefail

ROOT="${1:-/var/www/trippyjiffy}"

echo "=== Leads production checks ==="
echo "Repo: $ROOT"
echo ""

check() {
  if [ -e "$1" ]; then
    echo "OK   $1"
  else
    echo "FAIL $1 (missing)"
  fi
}

check "$ROOT/leads-dist/index.html"
check "$ROOT/frontend-dist/index.html"
check "$ROOT/Leads-Extractor/backend/.env"
check "$ROOT/Leads-Extractor/backend/src/server.js"

echo ""
echo "=== PM2 processes ==="
pm2 list 2>/dev/null || echo "PM2 not running"

echo ""
echo "=== Port listeners ==="
(ss -lntp 2>/dev/null || netstat -lntp 2>/dev/null) | grep -E ':5005|:5006' || echo "Ports 5005/5006 not listening"

echo ""
echo "=== Leads API health ==="
curl -fsS "http://127.0.0.1:5006/leads-api/health" && echo "" || echo "FAIL leads-api on 5006"

echo ""
echo "=== Leads index via local nginx path ==="
if [ -f "$ROOT/leads-dist/index.html" ]; then
  head -n 5 "$ROOT/leads-dist/index.html"
fi

echo ""
echo "If /leads/ shows main TrippyJiffy site:"
echo "  1. npm run build:all  (in repo root)"
echo "  2. Update nginx with deploy/nginx/trippyjiffy.conf"
echo "  3. pm2 restart trippyjiffy-leads-api"
echo "  4. sudo nginx -t && sudo systemctl reload nginx"
