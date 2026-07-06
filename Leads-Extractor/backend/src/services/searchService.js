import prisma from '../utils/prisma.js';
import {
  textSearchAll,
  getPlaceDetails,
  geocodeCity,
  isApiKeyConfigured,
} from './googlePlacesService.js';
import { scrapeWebsiteForEmail } from '../scraper/emailScraper.js';
import {
  buildSearchQuery,
  DEFAULT_MAX_RESULTS,
  DEFAULT_CATEGORIES,
} from '../utils/helpers.js';
import { runWithConcurrency } from '../utils/concurrency.js';
import { getLocationsForSearch } from '../utils/worldCities.js';

const PLACE_DETAILS_CONCURRENCY = 5;

const searchProgress = new Map();

export function getSearchProgress(searchId) {
  return searchProgress.get(searchId) || null;
}

export function getAppConfig() {
  return {
    apiKeyConfigured: isApiKeyConfigured(),
    worldwideCities: 30,
    defaultSearchMode: 'city',
    defaultMaxResults: DEFAULT_MAX_RESULTS,
    defaultCategories: DEFAULT_CATEGORIES,
    message: isApiKeyConfigured()
      ? 'Live Google Places API — defaults optimized for free tier (single city, 30 results).'
      : 'Add GOOGLE_MAPS_API_KEY in .env to enable live searches.',
  };
}

async function getExistingPlaceIds() {
  const rows = await prisma.company.findMany({ select: { placeId: true } });
  return new Set(rows.map((r) => r.placeId));
}

async function collectPlacesFromGoogle(
  locations,
  categories,
  maxResults,
  radius,
  searchId,
  existingPlaceIds
) {
  const placeMeta = new Map();
  const searchErrors = [];
  let skippedDuplicates = 0;
  const perLocationLimit = Math.max(2, Math.ceil(maxResults / locations.length));

  for (const { city, country } of locations) {
    if (placeMeta.size >= maxResults) break;

    let location = null;
    if (radius) {
      try {
        location = await geocodeCity(city, country);
      } catch {
        // continue without radius bias
      }
    }

    for (const category of categories) {
      if (placeMeta.size >= maxResults) break;

      const query = buildSearchQuery(category, city, country);
      searchProgress.set(searchId, {
        ...searchProgress.get(searchId),
        currentStep: `Searching: ${query}`,
      });

      try {
        const results = await textSearchAll(query, { radius, location }, 3);

        for (const place of results) {
          if (placeMeta.size >= maxResults) break;

          if (existingPlaceIds.has(place.place_id)) {
            skippedDuplicates++;
            continue;
          }

          const locCount = [...placeMeta.values()].filter(
            (m) => m.city === city && m.country === country
          ).length;
          if (locCount >= perLocationLimit) break;

          if (!placeMeta.has(place.place_id)) {
            placeMeta.set(place.place_id, { category, city, country });
          }
        }
      } catch (error) {
        searchErrors.push(error.message);
        console.error(`Text search failed for ${query}:`, error.message);
      }
    }
  }

  return { placeMeta, searchErrors, skippedDuplicates };
}

async function saveCompany(details, meta, searchId) {
  const { category, city, country } = meta;

  const existing = await prisma.company.findUnique({
    where: { placeId: details.placeId },
  });

  if (existing) {
    return null;
  }

  let email = 'Not Available';
  if (details.website) {
    email = await scrapeWebsiteForEmail(details.website);
  }

  return prisma.company.create({
    data: {
      placeId: details.placeId,
      name: details.name,
      email,
      phone: details.phone,
      website: details.website,
      address: details.address,
      city,
      country,
      latitude: details.latitude,
      longitude: details.longitude,
      googleRating: details.googleRating,
      googleMapsUrl: details.googleMapsUrl,
      category,
      searchHistoryId: searchId,
      status: 'completed',
    },
  });
}

async function initializeSearch(params) {
  const {
    country = '',
    city = '',
    radius,
    maxResults = DEFAULT_MAX_RESULTS,
    categories = DEFAULT_CATEGORIES,
    searchMode = 'city',
    userId = null,
  } = params;

  if (!isApiKeyConfigured()) {
    throw new Error(
      'Google Maps API key is not configured. Add GOOGLE_MAPS_API_KEY in your .env file and restart the server.'
    );
  }

  const locations = getLocationsForSearch(searchMode, country, city);

  const historyCountry =
    searchMode === 'worldwide' ? 'Worldwide' : country || 'Worldwide';
  const historyCity =
    searchMode === 'worldwide'
      ? `${locations.length} cities`
      : searchMode === 'country'
        ? 'All major cities'
        : city;

  const searchHistory = await prisma.searchHistory.create({
    data: {
      country: historyCountry,
      city: historyCity,
      radius: radius || null,
      maxResults,
      categories,
      status: 'in_progress',
      userId,
    },
  });

  const searchId = searchHistory.id;

  searchProgress.set(searchId, {
    status: 'in_progress',
    total: 0,
    processed: 0,
    currentStep: 'Searching Google Places...',
    percent: 0,
  });

  return {
    searchId,
    locations,
    categories,
    maxResults,
    radius,
    locationsSearched: locations.length,
  };
}

async function runSearchPipeline(searchId, ctx) {
  const { locations, categories, maxResults, radius, locationsSearched } = ctx;

  try {
    const existingPlaceIds = await getExistingPlaceIds();

    const { placeMeta, searchErrors, skippedDuplicates } =
      await collectPlacesFromGoogle(
        locations,
        categories,
        maxResults,
        radius,
        searchId,
        existingPlaceIds
      );

    if (placeMeta.size === 0 && searchErrors.length > 0) {
      throw new Error(searchErrors[0]);
    }

    if (placeMeta.size === 0) {
      if (skippedDuplicates > 0) {
        throw new Error(
          'All companies for this search are already in your database. Try a different city, country, or category.'
        );
      }
      throw new Error(
        'No travel companies found. Try a different city or country.'
      );
    }

    const entries = [...placeMeta.entries()].slice(0, maxResults);
    const total = entries.length;

    searchProgress.set(searchId, {
      status: 'in_progress',
      total,
      processed: 0,
      currentStep: 'Fetching company details...',
      percent: 10,
    });

    let processed = 0;
    const companies = [];

    await runWithConcurrency(entries, PLACE_DETAILS_CONCURRENCY, async ([placeId, meta]) => {
      try {
        const details = await getPlaceDetails(placeId);

        searchProgress.set(searchId, {
          ...searchProgress.get(searchId),
          currentStep: `Processing: ${details.name} (${meta.city})`,
        });

        const company = await saveCompany(details, meta, searchId);
        if (company) companies.push(company);
      } catch (error) {
        console.error(`Failed to process place ${placeId}:`, error.message);
      } finally {
        processed++;
        searchProgress.set(searchId, {
          status: 'in_progress',
          total,
          processed,
          currentStep: `Processed ${processed} of ${total} companies`,
          percent: Math.round(10 + (processed / total) * 90),
        });
      }
    });

    await prisma.searchHistory.update({
      where: { id: searchId },
      data: {
        status: 'completed',
        totalFound: companies.length,
        completedAt: new Date(),
      },
    });

    searchProgress.set(searchId, {
      status: 'completed',
      total: companies.length,
      processed: companies.length,
      currentStep:
        skippedDuplicates > 0
          ? `Search completed (${skippedDuplicates} duplicate${skippedDuplicates > 1 ? 's' : ''} skipped)`
          : 'Search completed',
      percent: 100,
      skippedDuplicates,
    });

    return {
      searchId,
      companies,
      totalFound: companies.length,
      locationsSearched,
    };
  } catch (error) {
    await prisma.searchHistory.update({
      where: { id: searchId },
      data: { status: 'failed' },
    });

    searchProgress.set(searchId, {
      status: 'failed',
      total: 0,
      processed: 0,
      currentStep: error.message,
      percent: 0,
      error: error.message,
    });

    throw error;
  }
}

/** Start search in background — returns immediately with searchId */
export async function startSearch(params) {
  const ctx = await initializeSearch(params);

  runSearchPipeline(ctx.searchId, ctx).catch((error) => {
    console.error(`Search ${ctx.searchId} failed:`, error.message);
  });

  return { searchId: ctx.searchId, status: 'in_progress' };
}

/** Run search synchronously (scripts / tests) */
export async function executeSearch(params) {
  const ctx = await initializeSearch(params);
  return runSearchPipeline(ctx.searchId, ctx);
}

export async function getCompanies(filters = {}) {
  const {
    searchHistoryId,
    country,
    city,
    category,
    search,
    page = 1,
    limit = 20,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = filters;

  const where = {};

  if (searchHistoryId) where.searchHistoryId = searchHistoryId;
  if (country) where.country = { contains: country, mode: 'insensitive' };
  if (city) where.city = { contains: city, mode: 'insensitive' };
  if (category) where.category = category;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { address: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
    ];
  }

  const skip = (page - 1) * limit;
  const orderBy = { [sortBy]: sortOrder };

  const [companies, total] = await Promise.all([
    prisma.company.findMany({ where, orderBy, skip, take: limit }),
    prisma.company.count({ where }),
  ]);

  return {
    companies,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getSearchHistory(userId = null, page = 1, limit = 20) {
  const where = userId ? { userId } : {};
  const skip = (page - 1) * limit;

  const [history, total] = await Promise.all([
    prisma.searchHistory.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: { _count: { select: { companies: true } } },
    }),
    prisma.searchHistory.count({ where }),
  ]);

  return {
    history,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getSearchAnalytics(userId = null) {
  const where = userId ? { userId } : {};

  const [
    totalSearches,
    totalCompanies,
    emailsFound,
    recentSearches,
    topCountries,
    topCities,
  ] = await Promise.all([
    prisma.searchHistory.count({ where }),
    prisma.company.count(),
    prisma.company.count({ where: { email: { not: 'Not Available' } } }),
    prisma.searchHistory.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { _count: { select: { companies: true } } },
    }),
    prisma.company.groupBy({
      by: ['country'],
      _count: { country: true },
      orderBy: { _count: { country: 'desc' } },
      take: 5,
    }),
    prisma.company.groupBy({
      by: ['city'],
      _count: { city: true },
      orderBy: { _count: { city: 'desc' } },
      take: 5,
    }),
  ]);

  return {
    totalSearches,
    totalCompanies,
    emailsFound,
    emailRate:
      totalCompanies > 0
        ? Math.round((emailsFound / totalCompanies) * 100)
        : 0,
    recentSearches,
    topCountries: topCountries.map((c) => ({
      country: c.country,
      count: c._count.country,
    })),
    topCities: topCities.map((c) => ({
      city: c.city,
      count: c._count.city,
    })),
  };
}
