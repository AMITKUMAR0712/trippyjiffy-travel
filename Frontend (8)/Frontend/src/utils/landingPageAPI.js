/**
 * Landing Page Data - Now fetches from backend Prisma database
 * Instead of hardcoded data, use the useLandingPageData hook
 */

export const getLandingPageDataFromAPI = async (slug) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5005/api";
    const response = await fetch(`${apiUrl}/landing-pages/${slug}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch landing page: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.success && result.data) {
      return result.data.data; // Return the data object from the response
    } else {
      throw new Error("Invalid response format from server");
    }
  } catch (error) {
    console.error(`Error fetching landing page '${slug}':`, error);
    throw error;
  }
};

export const getAllLandingPagesFromAPI = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5005/api";
    const response = await fetch(`${apiUrl}/landing-pages/all`);

    if (!response.ok) {
      throw new Error(`Failed to fetch landing pages: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.success && result.data) {
      return result.data;
    } else {
      throw new Error("Invalid response format from server");
    }
  } catch (error) {
    console.error("Error fetching all landing pages:", error);
    throw error;
  }
};
