/** Production uses same-origin /api to avoid mixed-content and wrong baked-in URLs. */
export const getApiBaseUrl = () => {
  if (import.meta.env.PROD) {
    return "";
  }

  const raw = import.meta.env.VITE_API_BASE_URL || "http://localhost:5005";
  return raw.replace(/\/api\/?$/, "").replace(/\/$/, "");
};

export const apiPath = (path) => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const apiSuffix = normalized.startsWith("/api") ? normalized : `/api${normalized}`;
  const base = getApiBaseUrl();
  return base ? `${base}${apiSuffix}` : apiSuffix;
};

/** Image/upload URLs — always same-origin in production */
export const uploadsUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/api/uploads/")) return url;
  if (url.startsWith("/uploads/")) return `/api${url}`;
  const clean = url.replace(/^\/?(api\/uploads\/|uploads\/)/, "");
  return `/api/uploads/${clean}`;
};

export const getSiteOrigin = () => {
  if (typeof window !== "undefined" && import.meta.env.PROD) {
    return window.location.origin;
  }
  return (import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com")
    .replace(/\/api\/?$/, "")
    .replace(/\/$/, "");
};
