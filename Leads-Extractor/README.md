# Travel Company Lead Extractor

A production-ready full-stack web application to search travel companies by country and city, collect business information from Google Places API, and extract public email addresses from company websites.

## Features

- **Google Places Integration** — Text Search and Place Details APIs
- **Email Scraping** — Playwright with Cheerio fallback on `/`, `/contact`, `/contact-us`, `/about`, `/about-us`
- **Business Email Filtering** — Ignores Gmail, Yahoo, Hotmail, iCloud, etc.
- **Export** — CSV and Excel (.xlsx)
- **Database** — PostgreSQL with Prisma ORM, deduplication by Place ID
- **Authentication** — JWT login/register with saved search history
- **Modern UI** — React + Tailwind, dark mode, responsive design, toast notifications
- **Security** — Helmet, CORS, rate limiting, input validation

## Tech Stack

| Layer    | Technologies                                      |
|----------|---------------------------------------------------|
| Frontend | React, Vite, Tailwind CSS, Axios, React Hook Form, TanStack Table, React Router |
| Backend  | Node.js, Express.js                               |
| Database | PostgreSQL, Prisma ORM                            |
| Scraping | Playwright, Cheerio                               |
| Export   | ExcelJS, CSV                                      |

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ (or Docker)
- Google Maps API key with **Places API** and **Geocoding API** enabled

### 1. Clone and install

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and set your values:

```env
GOOGLE_MAPS_API_KEY=your_key_here
DATABASE_URL=postgresql://postgres:password@127.0.0.1:5433/travel_leads?schema=public
PORT=5000
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
```

### 3. Start PostgreSQL

**Option A — Docker:**

```bash
docker-compose up -d
```

**Option B — Local PostgreSQL:**

Create a database named `travel_leads`.

### 4. Initialize database

```bash
npm run db:push
```

### 5. Install Playwright browsers (for email scraping)

```bash
cd backend && npx playwright install chromium
```

### 6. Run the application

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health check: http://localhost:5000/api/health

## Project Structure

```
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── src/
│       ├── controllers/
│       ├── routes/
│       ├── services/
│       ├── middlewares/
│       ├── utils/
│       ├── scraper/
│       └── server.js
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       ├── services/
│       ├── layouts/
│       └── types/
├── docs/
│   ├── API.md
│   └── DEPLOYMENT.md
├── docker-compose.yml
└── package.json
```

## Usage

1. Open the dashboard at http://localhost:5173
2. Enter **Country** and **City** (required)
3. Optionally set search radius, max results (10–500), and categories
4. Click **Search Companies**
5. View results in the table — sort, filter, paginate, select rows
6. **Export** to CSV or Excel, **copy emails**, or **delete** selected rows
7. Optional: **Register/Login** to save search history

## API Routes

| Method | Endpoint              | Description                |
|--------|-----------------------|----------------------------|
| POST   | `/api/search`         | Run a new search           |
| GET    | `/api/search/:id/status` | Get search progress     |
| GET    | `/api/companies`      | List companies (paginated) |
| GET    | `/api/company/:id`    | Get single company         |
| DELETE | `/api/company/:id`    | Delete company             |
| DELETE | `/api/companies`      | Bulk delete                |
| GET    | `/api/export/csv`     | Export CSV                 |
| GET    | `/api/export/excel`   | Export Excel               |
| GET    | `/api/history`        | Search history             |
| GET    | `/api/analytics`      | Search analytics           |
| POST   | `/api/auth/register`  | Register user              |
| POST   | `/api/auth/login`     | Login                      |
| GET    | `/api/auth/me`        | Current user               |

See [docs/API.md](docs/API.md) for full API documentation.

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for production deployment guide.

## Environment Variables

| Variable             | Required | Description                          |
|----------------------|----------|--------------------------------------|
| `GOOGLE_MAPS_API_KEY`| Yes      | Google Maps/Places API key           |
| `DATABASE_URL`       | Yes      | PostgreSQL connection string         |
| `PORT`               | No       | Server port (default: 5000)          |
| `JWT_SECRET`         | Yes      | Secret for JWT tokens                |
| `FRONTEND_URL`       | No       | CORS origin (default: localhost:5173)|
| `NODE_ENV`           | No       | `development` or `production`        |

## License

MIT
