const getApiUrl = () => {
  const url = import.meta.env.VITE_API_URL || "http://localhost:5005/api";
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

export const getLandingPageDataFromAPI = async (slug) => {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/landing-pages/${slug}`);
    if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error(`Error fetching page ${slug}:`, error);
    throw error;
  }
};

export const getAllLandingPagesFromAPI = async () => {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/landing-pages/all`);
    if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error("Error fetching all pages:", error);
    throw error;
  }
};

export const upsertLandingPageAPI = async (pageData) => {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/landing-pages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pageData),
    });
    if (!response.ok) throw new Error(`Failed to save: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("Error saving page:", error);
    throw error;
  }
};

export const deleteLandingPageAPI = async (id) => {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/landing-pages/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error(`Failed to delete: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error(`Error deleting page ${id}:`, error);
    throw error;
  }
};

