import axios from 'axios';
import { withRetry } from '../utils/concurrency.js';
import { generateGoogleMapsUrl } from '../utils/helpers.js';

const PLACES_TEXT_SEARCH_URL =
  'https://maps.googleapis.com/maps/api/place/textsearch/json';
const PLACE_DETAILS_URL =
  'https://maps.googleapis.com/maps/api/place/details/json';

export function isApiKeyConfigured() {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  return Boolean(key && key !== 'your_google_maps_api_key_here' && !key.includes('your_'));
}

function getApiKey() {
  if (!isApiKeyConfigured()) {
    throw new Error(
      'Google Maps API key is not configured. Add GOOGLE_MAPS_API_KEY in your .env file and restart the server.'
    );
  }
  return process.env.GOOGLE_MAPS_API_KEY;
}

export async function textSearch(query, options = {}) {
  const { radius, location, pageToken } = options;

  return withRetry(async () => {
    const params = {
      key: getApiKey(),
    };

    if (pageToken) {
      // Google requires pagetoken to be the only parameter besides key.
      params.pagetoken = pageToken;
    } else {
      params.query = query;
      if (radius && location) {
        params.location = `${location.lat},${location.lng}`;
        params.radius = radius;
      }
    }

    const response = await axios.get(PLACES_TEXT_SEARCH_URL, {
      params,
      timeout: 15000,
    });

    if (response.data.status === 'REQUEST_DENIED') {
      throw new Error(
        response.data.error_message ||
          'Google Places API request denied. Check your API key and billing.'
      );
    }

    if (response.data.status === 'OVER_QUERY_LIMIT') {
      throw new Error('Google Places API quota exceeded. Try again later.');
    }

    if (response.data.status === 'INVALID_REQUEST') {
      throw new Error(
        response.data.error_message ||
          'Invalid search request to Google Places API.'
      );
    }

    if (response.data.status === 'ZERO_RESULTS') {
      return { results: [], nextPageToken: null };
    }

    return {
      results: response.data.results || [],
      nextPageToken: response.data.next_page_token || null,
    };
  });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Fetch multiple pages until enough results or no more pages */
export async function textSearchAll(query, options = {}, maxPages = 3) {
  const collected = [];
  let pageToken = null;

  for (let page = 0; page < maxPages; page++) {
    if (pageToken) await sleep(2500);

    try {
      const { results, nextPageToken } = await textSearch(query, {
        ...options,
        pageToken,
      });

      collected.push(...results);
      pageToken = nextPageToken;
      if (!pageToken) break;
    } catch (error) {
      // Legacy Text Search pagination often returns INVALID_REQUEST on page 2+.
      // Keep first-page results instead of failing the entire lead search.
      if (page > 0 && collected.length > 0) {
        console.warn(
          `Google Places pagination stopped after page ${page + 1}:`,
          error.message
        );
        break;
      }
      throw error;
    }
  }

  return collected;
}

export async function getPlaceDetails(placeId) {
  return withRetry(async () => {
    const response = await axios.get(PLACE_DETAILS_URL, {
      params: {
        place_id: placeId,
        fields:
          'place_id,name,formatted_phone_number,website,formatted_address,geometry,rating,url',
        key: getApiKey(),
      },
      timeout: 15000,
    });

    if (response.data.status === 'REQUEST_DENIED') {
      throw new Error(
        response.data.error_message ||
          'Google Place Details API request denied.'
      );
    }

    if (response.data.status !== 'OK') {
      throw new Error(`Place details failed: ${response.data.status}`);
    }

    const result = response.data.result;
    return {
      placeId: result.place_id,
      name: result.name || 'Unknown',
      phone: result.formatted_phone_number || null,
      website: result.website || null,
      address: result.formatted_address || null,
      latitude: result.geometry?.location?.lat || null,
      longitude: result.geometry?.location?.lng || null,
      googleRating: result.rating || null,
      googleMapsUrl: generateGoogleMapsUrl(result.place_id),
    };
  });
}

export async function geocodeCity(city, country) {
  return withRetry(async () => {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json',
      {
        params: {
          address: `${city}, ${country}`,
          key: getApiKey(),
        },
        timeout: 10000,
      }
    );

    if (response.data.results?.length > 0) {
      return response.data.results[0].geometry.location;
    }
    return null;
  });
}
