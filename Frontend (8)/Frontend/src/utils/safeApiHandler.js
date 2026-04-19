/**
 * Safe API Response Handler
 * Ensures API responses are properly validated before use
 */

/**
 * Safely extract array data from API response
 * @param {*} data - The response data from API
 * @param {*} fallback - Fallback value if data is not an array (default: [])
 * @returns {Array} - Safe array value
 */
export const ensureArray = (data, fallback = []) => {
  if (Array.isArray(data)) {
    return data;
  }
  return fallback;
};

/**
 * Safely extract nested array data from API response
 * Useful for APIs that return { data: [...] } or { success: true, items: [...] }
 * @param {*} response - The full response object
 * @param {string|string[]} paths - Path(s) to try in order (e.g., 'data', ['data', 'items'])
 * @returns {Array} - Safe array value
 */
export const extractArrayFromResponse = (response, paths = ['data']) => {
  const pathsArray = Array.isArray(paths) ? paths : [paths];
  
  for (const path of pathsArray) {
    const value = path.split('.').reduce((obj, key) => obj?.[key], response);
    if (Array.isArray(value)) {
      return value;
    }
  }
  
  return [];
};

/**
 * Safe wrapper for axios/fetch API calls
 * @param {Function} apiCall - Async function that makes the API call
 * @param {Object} options - Configuration options
 * @param {string|string[]} options.dataPath - Path(s) to array data in response
 * @param {*} options.fallback - Fallback value if extraction fails
 * @returns {Promise} - Promise resolving to safe array
 */
export const safeApiCall = async (apiCall, options = {}) => {
  const { dataPath = 'data', fallback = [] } = options;
  
  try {
    const response = await apiCall();
    return extractArrayFromResponse(response, dataPath);
  } catch (error) {
    console.error('API call failed:', error);
    return fallback;
  }
};

/**
 * Validate and sanitize array data for rendering
 * @param {*} data - Data to validate
 * @param {Function} validator - Optional validator function
 * @returns {Array} - Validated array
 */
export const validateArrayData = (data, validator = null) => {
  const array = ensureArray(data);
  
  if (validator && typeof validator === 'function') {
    return array.filter((item) => {
      try {
        return validator(item);
      } catch {
        return false;
      }
    });
  }
  
  return array;
};
