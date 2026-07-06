# ROLLBACK — TrippyJiffy ONLY (no /leads/) — use if site broke after nginx change
#
# On server:
#   cd /var/www/second-project/trippyjiffy-travel
#   DEPLOY_ROOT=/var/www/second-project/trippyjiffy-travel bash scripts/generate-nginx-rollback.sh
#   sudo cp deploy/nginx/generated-trippyjiffy-rollback.conf /etc/nginx/sites-available/trippyjiffy
#   sudo ln -sf /etc/nginx/sites-available/trippyjiffy /etc/nginx/sites-enabled/trippyjiffy
#   sudo nginx -t && sudo systemctl reload nginx
#   pm2 stop trippyjiffy-api trippyjiffy-leads-api
#   pm2 restart trippy
