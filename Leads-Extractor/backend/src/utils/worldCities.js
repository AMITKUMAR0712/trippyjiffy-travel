export const WORLD_TOP_CITIES = [
  { city: 'New York', country: 'United States' },
  { city: 'Los Angeles', country: 'United States' },
  { city: 'London', country: 'United Kingdom' },
  { city: 'Paris', country: 'France' },
  { city: 'Dubai', country: 'United Arab Emirates' },
  { city: 'Singapore', country: 'Singapore' },
  { city: 'Tokyo', country: 'Japan' },
  { city: 'Sydney', country: 'Australia' },
  { city: 'Toronto', country: 'Canada' },
  { city: 'Berlin', country: 'Germany' },
  { city: 'Mumbai', country: 'India' },
  { city: 'Delhi', country: 'India' },
  { city: 'Bangalore', country: 'India' },
  { city: 'Bangkok', country: 'Thailand' },
  { city: 'Hong Kong', country: 'Hong Kong' },
  { city: 'Istanbul', country: 'Turkey' },
  { city: 'Rome', country: 'Italy' },
  { city: 'Barcelona', country: 'Spain' },
  { city: 'Amsterdam', country: 'Netherlands' },
  { city: 'Cape Town', country: 'South Africa' },
  { city: 'São Paulo', country: 'Brazil' },
  { city: 'Mexico City', country: 'Mexico' },
  { city: 'Seoul', country: 'South Korea' },
  { city: 'Kuala Lumpur', country: 'Malaysia' },
  { city: 'Jakarta', country: 'Indonesia' },
  { city: 'Cairo', country: 'Egypt' },
  { city: 'Riyadh', country: 'Saudi Arabia' },
  { city: 'Doha', country: 'Qatar' },
  { city: 'Vancouver', country: 'Canada' },
  { city: 'Melbourne', country: 'Australia' },
];

export const COUNTRY_CITIES = {
  India: [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Chennai',
    'Kolkata',
    'Hyderabad',
    'Pune',
    'Jaipur',
    'Ahmedabad',
    'Goa',
  ],
  'United States': [
    'New York',
    'Los Angeles',
    'Chicago',
    'Houston',
    'Miami',
    'San Francisco',
    'Las Vegas',
    'Boston',
    'Seattle',
    'Washington DC',
  ],
  'United Kingdom': [
    'London',
    'Manchester',
    'Birmingham',
    'Edinburgh',
    'Glasgow',
    'Liverpool',
    'Bristol',
    'Leeds',
  ],
  UAE: ['Dubai', 'Abu Dhabi', 'Sharjah'],
  'United Arab Emirates': ['Dubai', 'Abu Dhabi', 'Sharjah'],
  Canada: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'],
  Australia: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
  Germany: ['Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Cologne'],
  France: ['Paris', 'Lyon', 'Marseille', 'Nice', 'Bordeaux'],
  Singapore: ['Singapore'],
  Thailand: ['Bangkok', 'Phuket', 'Chiang Mai', 'Pattaya'],
  Japan: ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama'],
  'South Korea': ['Seoul', 'Busan', 'Incheon'],
  Brazil: ['São Paulo', 'Rio de Janeiro', 'Brasília'],
  Mexico: ['Mexico City', 'Cancún', 'Guadalajara'],
  'South Africa': ['Cape Town', 'Johannesburg', 'Durban'],
  Italy: ['Rome', 'Milan', 'Venice', 'Florence'],
  Spain: ['Madrid', 'Barcelona', 'Valencia', 'Seville'],
  Netherlands: ['Amsterdam', 'Rotterdam', 'The Hague'],
  Turkey: ['Istanbul', 'Ankara', 'Antalya'],
  Malaysia: ['Kuala Lumpur', 'Penang', 'Johor Bahru'],
  Indonesia: ['Jakarta', 'Bali', 'Surabaya'],
  'Saudi Arabia': ['Riyadh', 'Jeddah', 'Dammam'],
  Qatar: ['Doha'],
  Egypt: ['Cairo', 'Alexandria', 'Luxor'],
  China: ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen'],
  'Hong Kong': ['Hong Kong'],
};

export function getCitiesForCountry(country) {
  const normalized = country?.trim();
  if (!normalized) return [];

  if (COUNTRY_CITIES[normalized]) {
    return COUNTRY_CITIES[normalized].map((city) => ({
      city,
      country: normalized,
    }));
  }

  const match = Object.keys(COUNTRY_CITIES).find(
    (key) => key.toLowerCase() === normalized.toLowerCase()
  );
  if (match) {
    return COUNTRY_CITIES[match].map((city) => ({ city, country: match }));
  }

  return [{ city: normalized, country: normalized }];
}

export function getLocationsForSearch(searchMode, country, city) {
  if (searchMode === 'worldwide') {
    return WORLD_TOP_CITIES;
  }

  if (searchMode === 'country') {
    const locations = getCitiesForCountry(country);
    return locations.length > 0 ? locations : [{ city: country, country }];
  }

  return [{ city: city?.trim(), country: country?.trim() }];
}
