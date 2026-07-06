#!/usr/bin/env bash
# Generate PRE-LEADS nginx config (TrippyJiffy only) for emergency rollback.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/deploy/nginx/generated-trippyjiffy-rollback.conf"
DEPLOY_ROOT="${DEPLOY_ROOT:-$ROOT}"

# Try common dist locations
if [ -d "$DEPLOY_ROOT/frontend-dist" ]; then
  WEB_ROOT="$DEPLOY_ROOT/frontend-dist"
elif [ -d "$DEPLOY_ROOT/Frontend (8)/Frontend/dist" ]; then
  WEB_ROOT="$DEPLOY_ROOT/Frontend (8)/Frontend/dist"
else
  WEB_ROOT="$DEPLOY_ROOT/frontend-dist"
fi

mkdir -p "$(dirname "$OUT")"

cat > "$OUT" <<EOF
# ROLLBACK CONFIG — TrippyJiffy only (generated)
# Deploy root: $DEPLOY_ROOT
# Web root:    $WEB_ROOT

server {
    listen 80;
    server_name trippyjiffy.com www.trippyjiffy.com;
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name trippyjiffy.com www.trippyjiffy.com;

    ssl_certificate /etc/letsencrypt/live/trippyjiffy.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/trippyjiffy.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    client_max_body_size 20M;

    root $WEB_ROOT;
    index index.html;

    location /api/ {
        proxy_pass http://127.0.0.1:5005/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 120s;
    }

    location /uploads/ {
        proxy_pass http://127.0.0.1:5005/uploads/;
        proxy_set_header Host \$host;
    }

    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF

echo "Generated rollback nginx: $OUT"
echo "Web root: $WEB_ROOT"
