const PERSONAL_EMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'icloud.com',
  'outlook.com',
  'live.com',
  'aol.com',
  'protonmail.com',
  'mail.com',
];

const EMAIL_REGEX = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

export function extractEmails(text) {
  if (!text || typeof text !== 'string') return [];
  const matches = text.match(EMAIL_REGEX) || [];
  const unique = [...new Set(matches.map((e) => e.toLowerCase()))];
  return unique.filter((email) => !isPersonalEmail(email));
}

export function isPersonalEmail(email) {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return true;
  return PERSONAL_EMAIL_DOMAINS.some(
    (d) => domain === d || domain.endsWith(`.${d}`)
  );
}

export function getFirstBusinessEmail(emails) {
  if (!emails || emails.length === 0) return 'Not Available';
  return emails[0];
}

export function sanitizeString(str) {
  if (!str) return '';
  return String(str)
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 2000);
}

export function generateGoogleMapsUrl(placeId) {
  return `https://www.google.com/maps/place/?q=place_id:${placeId}`;
}

export const CATEGORY_QUERIES = {
  'Travel Agency': 'Travel agency',
  'Tour Operator': 'Tour operator',
  'Destination Management Company': 'Destination management company',
  'Holiday Package Company': 'Holiday package company',
  'Visa Consultant': 'Visa consultant',
  'Travel Company': 'Travel company',
};

export const ALL_CATEGORIES = Object.keys(CATEGORY_QUERIES);

/** Free-tier friendly defaults — single city, fewer API calls */
export const DEFAULT_MAX_RESULTS = 30;
export const DEFAULT_SEARCH_MODE = 'city';
export const DEFAULT_CATEGORIES = ['Travel Agency', 'Tour Operator'];

export function buildSearchQuery(category, city, country) {
  const label = CATEGORY_QUERIES[category] || category;
  return `${label} in ${city}, ${country}`;
}
