import '../src/utils/loadEnv.js';
import { isApiKeyConfigured, textSearch } from '../src/services/googlePlacesService.js';

console.log('API key configured:', isApiKeyConfigured());

const { results } = await textSearch('Travel agency in Mumbai, India');
console.log('SUCCESS - Google returned', results.length, 'places');
if (results[0]) console.log('First result:', results[0].name);
