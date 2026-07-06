# API Documentation

Base URL: `http://localhost:5000/api`

All responses follow this format:

```json
{
  "success": true,
  "data": { ... }
}
```

Errors:

```json
{
  "success": false,
  "error": "Error message",
  "details": []
}
```

---

## Authentication

Protected routes accept an optional or required `Authorization: Bearer <token>` header.

### POST `/auth/register`

Register a new user.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "email": "...", "name": "...", "createdAt": "..." },
    "token": "jwt_token"
  }
}
```

### POST `/auth/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

### GET `/auth/me`

Requires authentication. Returns current user.

---

## Search

### POST `/search`

Run a new travel company search. Rate limited to 20 requests per hour.

**Body:**
```json
{
  "country": "United States",
  "city": "New York",
  "radius": 10000,
  "maxResults": 50,
  "categories": ["Travel Agency", "Tour Operator"]
}
```

| Field        | Type     | Required | Notes                          |
|--------------|----------|----------|--------------------------------|
| country      | string   | Yes      | Max 100 chars                  |
| city         | string   | Yes      | Max 100 chars                  |
| radius       | number   | No       | Meters, 1000–50000             |
| maxResults   | number   | No       | 10–500, default 50             |
| categories   | string[] | No       | Defaults to all 6 categories   |

**Categories:**
- Travel Agency
- Tour Operator
- Destination Management Company
- Holiday Package Company
- Visa Consultant
- Travel Company

**Response (201):**
```json
{
  "success": true,
  "data": {
    "searchId": "uuid",
    "companies": [...],
    "totalFound": 42
  }
}
```

### GET `/search/:searchId/status`

Get progress of an in-progress search.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "in_progress",
    "total": 50,
    "processed": 25,
    "currentStep": "Scraping: Company Name",
    "percent": 55
  }
}
```

---

## Companies

### GET `/companies`

List companies with pagination, sorting, and filtering.

**Query parameters:**

| Param           | Type   | Default     | Description              |
|-----------------|--------|-------------|--------------------------|
| page            | number | 1           | Page number              |
| limit           | number | 20          | Items per page (max 100) |
| sortBy          | string | createdAt   | name, email, city, etc.  |
| sortOrder       | string | desc        | asc or desc              |
| search          | string | —           | Global text search       |
| country         | string | —           | Filter by country        |
| city            | string | —           | Filter by city           |
| category        | string | —           | Filter by category       |
| searchHistoryId | string | —           | Filter by search         |

**Response:**
```json
{
  "success": true,
  "data": {
    "companies": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

### GET `/company/:id`

Get a single company by UUID.

### DELETE `/company/:id`

Delete a company by UUID.

### DELETE `/companies`

Bulk delete companies.

**Body:**
```json
{
  "ids": ["uuid1", "uuid2"]
}
```

---

## Export

### GET `/export/csv`

Download companies as CSV.

**Query parameters:**
- `searchHistoryId` — filter by search
- `ids` — comma-separated UUIDs
- `country`, `city` — location filters

### GET `/export/excel`

Download companies as Excel (.xlsx). Same query parameters as CSV.

**CSV/Excel columns:**
Company Name, Email, Phone, Website, Address, City, Country, Maps URL, Rating, Category

---

## History & Analytics

### GET `/history`

Paginated search history. Linked to authenticated user when logged in.

**Query:** `page`, `limit`

### GET `/analytics`

Dashboard analytics:

```json
{
  "totalSearches": 10,
  "totalCompanies": 500,
  "emailsFound": 120,
  "emailRate": 24,
  "recentSearches": [...],
  "topCountries": [...],
  "topCities": [...]
}
```

---

## Health Check

### GET `/health`

```json
{
  "success": true,
  "message": "Travel Company Lead Extractor API is running",
  "timestamp": "2025-06-30T12:00:00.000Z"
}
```

---

## Error Codes

| Code | Description                    |
|------|--------------------------------|
| 400  | Validation error               |
| 401  | Authentication required        |
| 404  | Resource not found             |
| 409  | Email already registered       |
| 429  | Rate limit exceeded            |
| 502  | Google API error               |
| 500  | Internal server error          |
