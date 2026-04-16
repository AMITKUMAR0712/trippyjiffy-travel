# Landing Pages Database Setup - Complete! ✅

## What's Done

Your landing pages data has been successfully migrated from hardcoded data to a Prisma-managed database.

### Summary of Changes:

**Backend (e:\AMIT NEW\Downloads\tj\Backend (5)\Backend):**
- ✅ Prisma setup with MySQL database
- ✅ `landing_page` table created with slug, title, and JSON data
- ✅ Controller created: `controller/landingPageController.js`
- ✅ Routes created: `routes/landingPageRoutes.js`
- ✅ Routes integrated into `server.js`
- ✅ Seed script created: `prisma/seed.js`
- ✅ Data seeded: 3 landing pages (golden-triangle, south-india, rajasthan)

**Frontend (e:\AMIT NEW\Downloads\tj\Frontend (8)\Frontend):**
- ✅ React hook created: `src/hooks/useLandingPageData.js`
- ✅ API utility created: `src/utils/landingPageAPI.js`

**Database:**
- ✅ Table created with all 3 landing pages
- ✅ API tested and working

## Quick Start

### 1. Backend Server
```bash
cd "e:\AMIT NEW\Downloads\tj\Backend (5)\Backend"
npm run dev
```
Server runs on: `http://localhost:5005`

### 2. Test API
```bash
# Get golden-triangle data
curl http://localhost:5005/api/landing-pages/golden-triangle

# Get all landing pages
curl http://localhost:5005/api/landing-pages/all
```

### 3. Frontend - Update Your Components

**Option A: Using the React Hook (Simplest)**

Replace your hardcoded data import with the hook:

```javascript
// OLD WAY (don't use):
// import landingPagesData from "@/data/landingPagesData";
// const pageData = landingPagesData["golden-triangle"];

// NEW WAY (use this):
import { useLandingPageData } from "@/hooks/useLandingPageData";

function YourLandingPageComponent() {
  const { data, loading, error } = useLandingPageData("golden-triangle");

  if (loading) return <div className="spinner">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div>
      <h1>{data.hero.title}</h1>
      {/* Rest of your component */}
    </div>
  );
}
```

**Option B: Using the API Function**

```javascript
import { getLandingPageDataFromAPI } from "@/utils/landingPageAPI";
import { useEffect, useState } from "react";

function YourComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLandingPageDataFromAPI("golden-triangle")
      .then(setData)
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{data && <h1>{data.hero.title}</h1>}</div>;
}
```

## File Locations

**Backend Files:**
- Controller: [controller/landingPageController.js](../Backend%20(5)/Backend/controller/landingPageController.js)
- Routes: [routes/landingPageRoutes.js](../Backend%20(5)/Backend/routes/landingPageRoutes.js)
- Seed: [prisma/seed.js](../Backend%20(5)/Backend/prisma/seed.js)
- Schema: [prisma/schema.prisma](../Backend%20(5)/Backend/prisma/schema.prisma)

**Frontend Files:**
- Hook: [src/hooks/useLandingPageData.js](./Frontend/src/hooks/useLandingPageData.js)
- Utils: [src/utils/landingPageAPI.js](./Frontend/src/utils/landingPageAPI.js)

**Documentation:**
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Detailed migration guide
- This file - Quick setup instructions

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/landing-pages/:slug` | Fetch single page by slug |
| GET | `/api/landing-pages/all` | Fetch all pages (admin) |
| POST | `/api/landing-pages` | Create/Update page |
| DELETE | `/api/landing-pages/:slug` | Delete page |

## Database Info

**Table:** `landing_page`
**Rows:** 3 (golden-triangle, south-india, rajasthan)
**Connection:** `mysql://root:root@localhost:3306/trippyjiffy_db`

## Available Slugs

- `golden-triangle`
- `south-india`
- `rajasthan`

## Environment Setup

### Frontend .env (already configured)
```
VITE_API_BASE_URL=https://trippyjiffy.com
VITE_API_BASE_URL_IMG=https://trippyjiffy.com/api
```

For local dev, the hook uses: `http://localhost:5005/api`

### Backend .env (already configured)
```
DATABASE_URL="mysql://root:root@localhost:3306/trippyjiffy_db"
PORT=5005
```

## Next Steps

1. **Update All Landing Page Components**
   - Search for `landingPagesData` imports in Frontend
   - Replace with `useLandingPageData` hook
   - Test each page works

2. **Create Admin Panel (Optional)**
   - Build admin interface to manage landing pages
   - Use the POST/DELETE endpoints

3. **Add Caching (Optional)**
   - Cache responses to reduce database queries
   - Use React Query or SWR for better cache management

4. **Production Deployment**
   - Update `VITE_API_BASE_URL` to production API URL
   - Ensure database is backed up
   - Test API endpoints in production

## Troubleshooting

### Q: API returns empty data?
**A:** Check if the landing page table has data:
```bash
cd Backend
npx prisma studio
```

### Q: Getting "slug not found"?
**A:** Verify correct spelling: `golden-triangle`, `south-india`, `rajasthan`

### Q: Images not loading?
**A:** Ensure images exist in `/Backend/uploads/` and paths in JSON start with `/api/uploads/`

### Q: CORS errors?
**A:** CORS is already enabled in server.js, should work fine

## Commands Reference

```bash
# Backend
cd "e:\AMIT NEW\Downloads\tj\Backend (5)\Backend"
npm run dev              # Start dev server
npm run seed             # Re-seed database
npx prisma studio       # Open Prisma Studio (GUI)
npx prisma db push      # Sync schema with database

# Frontend
cd "e:\AMIT NEW\Downloads\tj\Frontend (8)\Frontend"
npm run dev             # Start dev server
```

## Database Queries

```sql
-- View all landing pages
SELECT slug, title FROM landing_page;

-- View specific page
SELECT * FROM landing_page WHERE slug = 'golden-triangle';

-- Update page data
UPDATE landing_page SET data = JSON_SET(data, '$.hero.title', 'New Title') 
WHERE slug = 'golden-triangle';

-- Delete page
DELETE FROM landing_page WHERE slug = 'rajasthan';
```

---

**Status:** ✅ Ready to use! Start the backend server and update your components to use the API hook.
