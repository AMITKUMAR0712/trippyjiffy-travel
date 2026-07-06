#!/usr/bin/env bash
# Fix SSL mixed-content + API data on production VPS
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> Repo: $ROOT"

# Symlink dist (no spaces in nginx path)
ln -sfn "Frontend (8)/Frontend/dist" frontend-dist

# Production env — relative API via apiBase.js; these are fallbacks for dev build tools
cat > "Frontend (8)/Frontend/.env.production" << 'EOF'
VITE_API_BASE_URL=https://trippyjiffy.com
VITE_API_URL=https://trippyjiffy.com/api
VITE_API_BASE_URL_IMG=https://trippyjiffy.com/api/uploads
EOF

echo "==> Building frontend..."
(cd "Frontend (8)/Frontend" && npm run build)

echo "==> PM2 — use trippy only on port 5005"
pm2 stop trippyjiffy-api trippyjiffy-leads-api 2>/dev/null || true
pm2 delete trippyjiffy-api trippyjiffy-leads-api 2>/dev/null || true
pm2 restart trippy || pm2 start "Backend (5)/Backend/server.js" --name trippy

sleep 2

echo ""
echo "==> API test"
curl -fsS "http://127.0.0.1:5005/api/settings/get" | head -c 200 || echo "FAIL: backend not responding on 5005"
echo ""
echo ""

echo "==> HTTPS API test"
curl -fsS "https://trippyjiffy.com/api/settings/get" | head -c 200 || echo "FAIL: nginx /api proxy"
echo ""
echo ""

echo "==> Nginx SSL + HSTS"
if [ -f "deploy/nginx/trippyjiffy-SSL.conf" ]; then
  sudo cp deploy/nginx/trippyjiffy-SSL.conf /etc/nginx/sites-available/trippyjiffy
  sudo certbot install --cert-name trippyjiffy.com --nginx 2>/dev/null || true
  sudo nginx -t && sudo systemctl reload nginx
fi

echo "==> Done. Open https://trippyjiffy.com and hard refresh: Ctrl+Shift+R"
