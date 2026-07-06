export interface Company {
  id: string;
  placeId: string;
  name: string;
  email: string;
  phone: string | null;
  website: string | null;
  address: string | null;
  city: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  googleRating: number | null;
  googleMapsUrl: string | null;
  category: string;
  status: string;
  searchHistoryId: string | null;
  createdAt: string;
  updatedAt: string;
}

export type SearchMode = 'city' | 'country' | 'worldwide';

export interface SearchFormData {
  searchMode: SearchMode;
  country: string;
  city: string;
  radius?: number;
  maxResults: number;
  categories: string[];
}

export interface AppConfig {
  apiKeyConfigured: boolean;
  worldwideCities: number;
  defaultSearchMode?: string;
  defaultMaxResults?: number;
  defaultCategories?: string[];
  message: string;
}

export interface SearchProgress {
  status: string;
  total: number;
  processed: number;
  currentStep: string;
  percent: number;
  error?: string;
  skippedDuplicates?: number;
}

export interface SearchHistory {
  id: string;
  country: string;
  city: string;
  radius: number | null;
  maxResults: number;
  categories: string[];
  totalFound: number;
  status: string;
  createdAt: string;
  completedAt: string | null;
  _count?: { companies: number };
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Analytics {
  totalSearches: number;
  totalCompanies: number;
  emailsFound: number;
  emailRate: number;
  recentSearches: SearchHistory[];
  topCountries: { country: string; count: number }[];
  topCities: { city: string; count: number }[];
}

export const CATEGORIES = [
  'Travel Agency',
  'Tour Operator',
  'Destination Management Company',
  'Holiday Package Company',
  'Visa Consultant',
  'Travel Company',
] as const;

export type Category = (typeof CATEGORIES)[number];

/** Default selection — fewer categories = lower Google API usage */
export const DEFAULT_CATEGORIES: Category[] = [
  'Travel Agency',
  'Tour Operator',
];
