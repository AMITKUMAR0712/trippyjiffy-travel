import { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://trippyjiffy.com/api";

/**
 * Hook to fetch landing page data from the database
 * @param {string} slug - The slug of the landing page (e.g., "golden-triangle")
 * @returns {object} { data, loading, error }
 */
export const useLandingPageData = (slug) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/landing-pages/${slug}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch landing page: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.success && result.data) {
          // Extract the data object from the response
          setData(result.data.data);
          setError(null);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching landing page:", err);
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  return { data, loading, error };
};

/**
 * Hook to fetch all landing pages (for admin)
 * @returns {object} { pages, loading, error }
 */
export const useAllLandingPages = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/landing-pages/all`);

        if (!response.ok) {
          throw new Error(`Failed to fetch landing pages: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.success && result.data) {
          setPages(result.data);
          setError(null);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching landing pages:", err);
        setError(err.message);
        setPages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, []);

  return { pages, loading, error };
};
