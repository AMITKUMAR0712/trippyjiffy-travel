# Deployment Guide

## Production Checklist

- [ ] Set strong `JWT_SECRET` (32+ random characters)
- [ ] Use production PostgreSQL (managed service recommended)
- [ ] Enable Google Cloud billing and API quotas
- [ ] Set `NODE_ENV=production`
- [ ] Configure `FRONTEND_URL` to your production domain
- [ ] Use HTTPS (reverse proxy: Nginx, Caddy, or cloud load balancer)
- [ ] Install Playwright browsers on the server
- [ ] Set up database backups
- [ ] Configure monitoring and logging

---

## Option 1: VPS (Ubuntu 22.04)

### 1. Server setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install dependencies for Playwright
sudo npx playwright install-deps chromium
```

### 2. Database

```bash
sudo -u postgres psql
CREATE DATABASE travel_leads;
CREATE USER travel_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE travel_leads TO travel_user;
\q
```

### 3. Deploy application

```bash
git clone <your-repo> /var/www/travel-leads
cd /var/www/travel-leads
npm install
```

Create `/var/www/travel-leads/.env`:

```env
GOOGLE_MAPS_API_KEY=your_production_key
DATABASE_URL=postgresql://travel_user:your_password@localhost:5432/travel_leads?schema=public
PORT=5000
JWT_SECRET=your_production_jwt_secret
FRONTEND_URL=https://yourdomain.com
NODE_ENV=production
```

```bash
npm run db:push
cd backend && npx playwright install chromium
cd ../frontend && npm run build
```

### 4. Process manager (PM2)

```bash
sudo npm install -g pm2

# Start backend
cd /var/www/travel-leads/backend
pm2 start src/server.js --name travel-api

# Serve frontend with a static server or Nginx
pm2 save
pm2 startup
```

### 5. Nginx reverse proxy

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /var/www/travel-leads/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # API
    location /api {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 300s;
    }
}
```

```bash
sudo certbot --nginx -d yourdomain.com
```

---

## Option 2: Docker

### Dockerfile (backend)

```dockerfile
FROM node:20-slim

RUN apt-get update && npx playwright install-deps chromium
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci
RUN npx playwright install chromium
COPY backend/ .
RUN npx prisma generate
EXPOSE 5000
CMD ["node", "src/server.js"]
```

### docker-compose production

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: travel_leads
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data

  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@postgres:5432/travel_leads
      GOOGLE_MAPS_API_KEY: ${GOOGLE_MAPS_API_KEY}
      JWT_SECRET: ${JWT_SECRET}
      FRONTEND_URL: ${FRONTEND_URL}
      NODE_ENV: production
    depends_on:
      - postgres

volumes:
  pgdata:
```

---

## Option 3: Railway / Render

### Railway

1. Create new project, add PostgreSQL plugin
2. Deploy backend from `backend/` directory
3. Set environment variables from dashboard
4. Deploy frontend separately or use monorepo build
5. Run `prisma db push` via Railway shell

### Render

1. Create PostgreSQL database
2. Create Web Service for backend (root: `backend`)
3. Build: `npm install && npx prisma generate && npx prisma db push`
4. Start: `node src/server.js`
5. Create Static Site for frontend (`frontend/dist`)

---

## Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project
3. Enable APIs:
   - Places API (New)
   - Places API
   - Geocoding API
4. Create API key, restrict to your server IP/domain
5. Enable billing (required for Places API)

---

## Performance Tuning

- **Concurrency**: Place details run in batches of 5; scraping in batches of 3
- **Website cache**: Duplicate websites are cached during a search session
- **Rate limits**: 20 searches/hour, 100 API requests/15 min
- For high volume, consider a job queue (Bull/BullMQ + Redis)

---

## Monitoring

Recommended tools:
- **PM2** — process monitoring
- **Sentry** — error tracking
- **Datadog / Grafana** — metrics
- **UptimeRobot** — uptime checks on `/api/health`

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Google API denied | Check API key, billing, enabled APIs |
| Playwright fails | Run `npx playwright install chromium` and `install-deps` |
| DB connection error | Verify `DATABASE_URL`, PostgreSQL running |
| CORS errors | Set `FRONTEND_URL` to exact frontend origin |
| Slow searches | Reduce `maxResults`, fewer categories |
| No emails found | Many sites hide emails; scraping is best-effort |
