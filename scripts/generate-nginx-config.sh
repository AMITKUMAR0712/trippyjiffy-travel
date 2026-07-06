#!/usr/bin/env bash
# Generate nginx config using the actual repo path on this server.
# Usage (from repo root):
#   bash scripts/generate-nginx-config.sh
#   sudo cp deploy/nginx/generated-trippyjiffy.conf /etc/nginx/sites-available/trippyjiffy
#   sudo ln -sf /etc/nginx/sites-available/trippyjiffy /etc/nginx/sites-enabled/trippyjiffy
#   sudo nginx -t && sudo systemctl reload nginx

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/deploy/nginx/generated-trippyjiffy.conf"
DEPLOY_ROOT="${DEPLOY_ROOT:-$ROOT}"

mkdir -p "$(dirname "$OUT")"

cat > "$OUT" <<EOF
# AUTO-GENERATED — deploy root: $DEPLOY_ROOT
# Do NOT paste .env contents into this file.

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

    root $DEPLOY_ROOT/frontend-dist;
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

    location /leads-api/ {
        proxy_pass http://127.0.0.1:5006/leads-api/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 600s;
    }

    location = /leads {
        return 301 /leads/;
    }

    location ^~ /leads/ {
        alias $DEPLOY_ROOT/leads-dist/;
        try_files \$uri \$uri/ @leads_spa;
    }

    location @leads_spa {
        root $DEPLOY_ROOT/leads-dist;
        rewrite ^ /index.html break;
    }

    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF

echo "Generated: $OUT"
echo "Deploy root: $DEPLOY_ROOT"
