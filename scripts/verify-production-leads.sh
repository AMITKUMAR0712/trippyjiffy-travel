#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DEPLOY_ROOT="${1:-$ROOT}"

echo "=== Leads production checks ==="
echo "Repo: $DEPLOY_ROOT"
echo ""

check() {
  if [ -e "$1" ]; then
    echo "OK   $1"
  else
    echo "FAIL $1 (missing)"
  fi
}

check "$DEPLOY_ROOT/leads-dist/index.html"
check "$DEPLOY_ROOT/frontend-dist/index.html"
check "$DEPLOY_ROOT/Leads-Extractor/backend/.env"
check "$DEPLOY_ROOT/Leads-Extractor/backend/src/server.js"

echo ""
echo "=== PM2 processes ==="
pm2 list 2>/dev/null || echo "PM2 not running"

echo ""
echo "=== Port listeners ==="
(ss -lntp 2>/dev/null || netstat -lntp 2>/dev/null) | grep -E ':5005|:5006' || echo "Ports 5005/5006 not listening"

echo ""
echo "=== Leads API health ==="
curl -fsS "http://127.0.0.1:5006/leads-api/health" && echo "" || echo "FAIL leads-api on 5006 — run: pm2 logs trippyjiffy-leads-api"

echo ""
echo "=== TrippyJiffy API ==="
curl -fsS "http://127.0.0.1:5005/api/settings" >/dev/null && echo "OK trippyjiffy-api on 5005" || echo "WARN could not reach 5005"

echo ""
if [ -f "$DEPLOY_ROOT/leads-dist/index.html" ]; then
  echo "=== leads-dist/index.html (first lines) ==="
  head -n 3 "$DEPLOY_ROOT/leads-dist/index.html"
fi
