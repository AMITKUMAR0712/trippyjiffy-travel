# TrippyJiffy Integration

This folder is a **standalone** leads extractor app. It does not modify TrippyJiffy backend or database.

| App | URL (production) | Port (dev) | Database |
|-----|------------------|------------|----------|
| TrippyJiffy | `https://trippyjiffy.com` | Frontend `5173`, API `5005` | MySQL |
| Leads Extractor | `https://trippyjiffy.com/leads/` | Frontend `5174`, API `5006` | PostgreSQL |

## What was connected

- Header **Reach Us → Leads Panel** opens `/leads/`
- Typing `/leads` on TrippyJiffy redirects to `/leads/`
- Leads API uses `/leads-api` (no clash with TrippyJiffy `/api`)
- Leads auth uses `leads_token` in localStorage (no clash with TrippyJiffy login)

## Local development

### 1. PostgreSQL for leads

```bash
cd Leads-Extractor
docker-compose up -d
```

### 2. Configure env

Copy `.env.example` to `.env` and set `GOOGLE_MAPS_API_KEY`.

```bash
cd Leads-Extractor
npm install
npm run db:push
cd backend && npx playwright install chromium
```

### 3. Run both apps (3 terminals)

**Terminal A — TrippyJiffy frontend**
```bash
cd "Frontend (8)/Frontend"
npm run dev
```

**Terminal B — Leads backend**
```bash
cd Leads-Extractor/backend
npm install
npm run dev
```

**Terminal C — Leads frontend**
```bash
cd Leads-Extractor/frontend
npm install
npm run dev
```

Open: `http://localhost:5173/leads/`

TrippyJiffy Vite proxies `/leads` → `5174` and `/leads-api` → `5006`.

## Production (Nginx)

Add these blocks **inside** your existing `trippyjiffy.com` server block:

```nginx
# Leads extractor frontend (build first: cd Leads-Extractor/frontend && npm run build)
location /leads/ {
    alias /var/www/trippyjiffy/Leads-Extractor/frontend/dist/;
    try_files $uri $uri/ /leads/index.html;
}

# Leads API (PM2 on port 5006)
location /leads-api/ {
    proxy_pass http://127.0.0.1:5006/leads-api/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_read_timeout 600s;
}
```

Build leads frontend before deploy:

```bash
cd Leads-Extractor/frontend
npm run build
```

Run leads backend with PM2:

```bash
cd Leads-Extractor/backend
pm2 start src/server.js --name trippyjiffy-leads-api
```

Production `.env` for leads backend:

```env
PORT=5006
API_PREFIX=/leads-api
FRONTEND_URL=https://trippyjiffy.com
DATABASE_URL=postgresql://...
GOOGLE_MAPS_API_KEY=...
JWT_SECRET=...
NODE_ENV=production
```

## Notes

- TrippyJiffy MySQL is untouched.
- Leads uses its own PostgreSQL database.
- Keep both backends running separately in production.
