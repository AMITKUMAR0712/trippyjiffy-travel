# Landing Pages Database Migration Guide

## Overview
You've successfully migrated from hardcoded landing page data to a Prisma-based database solution. This means:
- ✅ Data is now stored in the MySQL database (`trippyjiffy_db`)
- ✅ All landing pages data is managed centrally in the backend
- ✅ Frontend fetches data via REST API
- ✅ Easy to update landing pages without redeploying frontend

## Database Structure

### Landing Page Model (Prisma)
```prisma
model landing_page {
  id        Int      @id @default(autoincrement())
  slug      String   @unique @db.VarChar(100)
  title     String   @db.VarChar(255)
  data      Json
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([slug])
}
```

**Current Landing Pages in Database:**
- `golden-triangle`
- `south-india`
- `rajasthan`

## API Endpoints

### Get Single Landing Page
```
GET /api/landing-pages/:slug
```
**Example:** `GET http://localhost:5005/api/landing-pages/golden-triangle`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "slug": "golden-triangle",
    "title": "Golden Triangle Tour",
    "data": { /* Full landing page object */ },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "message": "Landing page fetched successfully"
}
```

### Get All Landing Pages (Admin)
```
GET /api/landing-pages/all
```

### Create/Update Landing Page (Admin)
```
POST /api/landing-pages
Content-Type: application/json

{
  "slug": "new-page",
  "title": "New Page Title",
  "data": { /* Full page data object */ }
}
```

### Delete Landing Page (Admin)
```
DELETE /api/landing-pages/:slug
```

## Frontend Usage

### Method 1: Using the Hook (Recommended)
```javascript
import { useLandingPageData } from "@/hooks/useLandingPageData";

function LandingPageComponent({ slug }) {
  const { data, loading, error } = useLandingPageData(slug);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{data.hero.title}</h1>
      <p>{data.hero.subtitle}</p>
      {/* Use data.* to render content */}
    </div>
  );
}
```

### Method 2: Using the API Function
```javascript
import { getLandingPageDataFromAPI } from "@/utils/landingPageAPI";

async function fetchData() {
  try {
    const pageData = await getLandingPageDataFromAPI("golden-triangle");
    console.log(pageData);
  } catch (error) {
    console.error("Failed to fetch:", error);
  }
}
```

### Method 3: Direct Fetch
```javascript
const response = await fetch("http://localhost:5005/api/landing-pages/golden-triangle");
const result = await response.json();
const pageData = result.data.data;
```

## Environment Configuration

### Backend (.env)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=trippyjiffy_db
DB_PORT=3306
DATABASE_URL="mysql://root:root@localhost:3306/trippyjiffy_db"
```

### Frontend (.env)
```
VITE_API_BASE_URL=https://trippyjiffy.com
VITE_API_BASE_URL_IMG=https://trippyjiffy.com/api
```

For local development, use:
```
VITE_API_BASE_URL=http://localhost:5005/api
```

## Running the Application

### Backend Setup
```bash
cd Backend
npm install
npm run prisma:generate
node prisma/seed.js
npm run dev
```

The server will run on `http://localhost:5005`

### Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

## Data Structure Example

Each landing page follows this structure:
```javascript
{
  slug: "golden-triangle",
  title: "Golden Triangle Tour",
  hero: {
    title: "Golden Triangle Tour",
    subtitle: "...",
    image: "/api/uploads/...",
    slides: [],
    badge: "...",
    ctaPrimary: "Get Free Quote",
    ctaSecondary: "Call Now",
    ctaPhone: "+919870210896"
  },
  theme: {
    primary: "#f97316",
    secondary: "#0ea5e9",
    accent: "#1e293b"
  },
  stats: [
    { value: "6-7 Days", label: "Ideal Duration" }
  ],
  hero: { /* ... */ },
  intro: { /* ... */ },
  itinerary: [ /* ... */ ],
  gallery: [ /* ... */ ],
  highlights: [ /* ... */ ],
  about: { /* ... */ },
  includions: [ /* ... */ ],
  exclusions: [ /* ... */ ],
  whyChooseUs: [ /* ... */ ],
  testimonials: [ /* ... */ ],
  faqs: [ /* ... */ ],
  contact: { /* ... */ },
  seo: { /* ... */ }
}
```

## Updating Landing Page Data

### To modify a landing page in the database:

**Option 1: Direct API Call**
```bash
curl -X POST http://localhost:5005/api/landing-pages \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "golden-triangle",
    "title": "Golden Triangle Tour",
    "data": { /* Updated data */ }
  }'
```

**Option 2: Create Admin Panel**
Create an admin interface to update landing pages via the API endpoints.

**Option 3: Direct Database Update**
```sql
UPDATE landing_page 
SET data = JSON_SET(data, '$.hero.title', 'New Title')
WHERE slug = 'golden-triangle';
```

## Adding New Landing Pages

1. Insert data into database via API:
```javascript
const response = await fetch("http://localhost:5005/api/landing-pages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    slug: "new-destination",
    title: "New Destination Tour",
    data: { /* full page data */ }
  })
});
```

2. Or run a migration script to seed new pages.

## Database Queries (MySQL)

View all landing pages:
```sql
SELECT slug, title, createdAt, updatedAt FROM landing_page;
```

View a specific landing page:
```sql
SELECT * FROM landing_page WHERE slug = 'golden-triangle';
```

Update landing page data:
```sql
UPDATE landing_page 
SET data = JSON_SET(data, '$.hero.subtitle', 'New Subtitle')
WHERE slug = 'golden-triangle';
```

## Troubleshooting

### Error: "Landing page with slug 'xyz' not found"
- Verify the slug exists in the database
- Check if the spelling matches exactly (case-sensitive)

### Error: "Failed to connect to database"
- Ensure MySQL is running
- Check DATABASE_URL in .env
- Verify database credentials

### Images not loading
- Ensure image files exist in `/Backend/uploads`
- Check image paths in the JSON data (should be `/api/uploads/filename`)

### API not responding
- Ensure backend is running: `npm run dev` in Backend directory
- Check port 5005 is not in use
- Verify server.js has landing page routes imported

## Migration Checklist

- [x] Prisma setup and schema created
- [x] Database table created (`landing_page`)
- [x] Data seeded to database (3 pages: golden-triangle, south-india, rajasthan)
- [x] Backend controller created (`landingPageController.js`)
- [x] Backend routes created (`landingPageRoutes.js`)
- [x] Routes added to server.js
- [x] Frontend hooks created (`useLandingPageData.js`)
- [x] Frontend utilities created (`landingPageAPI.js`)
- [ ] Update existing landing page components to use the API
- [ ] Test all pages work with API data
- [ ] Deploy to production

## Next Steps

1. **Update Landing Page Components:**
   Find components using `landingPagesData` and replace with `useLandingPageData` hook

2. **Add Admin Panel:**
   Create an admin interface to manage landing pages

3. **Set Up Caching:**
   Consider adding caching to reduce database queries

4. **Production Deployment:**
   Update API URLs for production environment

## Support

For issues or questions:
1. Check the database has the required data
2. Verify API endpoints are working: `curl http://localhost:5005/api/landing-pages/all`
3. Check browser console for API errors
4. Verify CORS is enabled in backend (already configured)
