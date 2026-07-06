# Production deployment — one command after clone

## Server requirements

- Ubuntu 22.04+ (or similar Linux VPS)
- Node.js 18+
- MySQL 8 (TrippyJiffy)
- Docker (optional, for Leads PostgreSQL) OR external PostgreSQL
- Nginx
- PM2 (`npm install -g pm2`)

---

## First deploy (after git clone)

```bash
# 1. Clone repo
git clone <your-repo-url> /var/www/trippyjiffy
cd /var/www/trippyjiffy

# 2. Run automatic setup (install, build, DB, PM2)
chmod +x scripts/*.sh
npm run setup:production
```

This script automatically:
- Creates `.env` files from templates (if missing)
- Installs all npm dependencies
- Generates Prisma clients
- Starts Leads PostgreSQL (Docker)
- Pushes Leads database schema
- Installs Playwright Chromium
- Builds both frontends
- Starts both APIs with PM2

---

## Edit secrets (required before going live)

```bash
nano "Backend (5)/Backend/.env"
nano "Leads-Extractor/backend/.env"
```

Use your real MySQL, PostgreSQL, Gmail, Razorpay, and Google API keys.

---

## Nginx

```bash
# Edit path inside file if not /var/www/trippyjiffy
sudo cp deploy/nginx/trippyjiffy.conf /etc/nginx/sites-available/trippyjiffy
sudo ln -sf /etc/nginx/sites-available/trippyjiffy /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# SSL
sudo certbot --nginx -d trippyjiffy.com -d www.trippyjiffy.com
```

---

## Update after code changes

```bash
cd /var/www/trippyjiffy
npm run deploy -- --pull
```

---

## Useful commands

| Command | What it does |
|---------|----------------|
| `npm run setup:production` | First-time full setup |
| `npm run deploy` | Rebuild + PM2 restart |
| `npm run deploy -- --pull` | Git pull + rebuild + restart |
| `npm run build:all` | Build both frontends only |
| `npm run pm2:logs` | View API logs |
| `npm run pm2:restart` | Restart both APIs |

---

## Architecture

| Service | Port | URL |
|---------|------|-----|
| TrippyJiffy API | 5005 | `/api` |
| Leads API | 5006 | `/leads-api` |
| TrippyJiffy site | Nginx | `/` |
| Leads panel | Nginx | `/leads/` |

TrippyJiffy uses **MySQL**. Leads uses **PostgreSQL** (separate database).

See also: `Leads-Extractor/TRIPPYJIFFY-INTEGRATION.md`
