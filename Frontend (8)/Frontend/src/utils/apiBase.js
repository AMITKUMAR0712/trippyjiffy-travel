/** Strip trailing /api so `${base}/api/enquiry/post` never becomes /api/api/... */
export const getApiBaseUrl = () => {
  const raw = import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com";
  return raw.replace(/\/api\/?$/, "").replace(/\/$/, "");
};

export const apiPath = (path) => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalized.startsWith("/api") ? normalized : `/api${normalized}`}`;
};
