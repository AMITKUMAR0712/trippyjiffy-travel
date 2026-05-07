import cert1 from "../Img/Certificates1.jpeg";
import cert2 from "../Img/Certificates2.jpeg";
import bannerGolden from "../Img/Banner2.jpg";
import bannerSouth from "../Img/travel.jpg";
import bannerRajasthan from "../Img/Banner3.jpg";
import gal1 from "../Img/Banner!.webp";
import gal2 from "../Img/Banner32.webp";
import gal3 from "../Img/contact.jpg";
import gal4 from "../Img/l1.jpeg";
import gal5 from "../Img/people-doi-pha-tang-against-sky-sunrise_1048944-4357386.jpeg";
import gal6 from "../Img/hiker-looking-mountains-from-great-wall-china-sunset_1048944-9830948.jpeg";

const apiBase = import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com";
const baseURL_IMG = `${apiBase}/api/uploads`;


// Map exact db paths to actual Vite imported hashes
const LOCAL_ASSET_MAP = {
  "/api/uploads/Certificates1.jpeg": cert1,
  "/api/uploads/Certificates2.jpeg": cert2,
  "/api/uploads/Banner2.jpg": bannerGolden,
  "/api/uploads/travel.jpg": bannerSouth,
  "/api/uploads/Banner3.jpg": bannerRajasthan,
  "/api/uploads/Banner!.webp": gal1,
  "/api/uploads/Banner32.webp": gal2,
  "/api/uploads/contact.jpg": gal3,
  "/api/uploads/l1.jpeg": gal4,
  "/api/uploads/people-doi-pha-tang-against-sky-sunrise_1048944-4357386.jpeg": gal5,
  "/api/uploads/hiker-looking-mountains-from-great-wall-china-sunset_1048944-9830948.jpeg": gal6,
};

/**
 * Robust utility to resolve image URLs.
 */
export const getImgUrl = (url) => {
  if (!url) return "";

  // Normalize URL for mapping check (handle both /api/uploads/file.jpg and file.jpg)
  const normalizedUrl = typeof url === "string" 
    ? (url.startsWith("/") ? url : `/${url}`).replace(/^\/uploads\//, "/api/uploads/")
    : url;

  // 0. Check internal asset map with normalized path
  if (LOCAL_ASSET_MAP[normalizedUrl]) {
    return LOCAL_ASSET_MAP[normalizedUrl];
  }

  // Also check if just the filename matches anything in the map
  const filenameOnly = typeof url === "string" ? url.split("/").pop() : "";
  const matchByFilename = Object.entries(LOCAL_ASSET_MAP).find(([key]) => key.endsWith(`/${filenameOnly}`));
  if (matchByFilename) {
    return matchByFilename[1];
  }

  // 1. Handle absolute URLs
  if (typeof url === "string" && (url.startsWith("http://") || url.startsWith("https://"))) {
    if (url.includes("localhost") || url.includes("127.0.0.1") || url.includes("187.127.139.99")) {
      const filename = url.split("/").pop();
      return `${baseURL_IMG}/${filename}`;
    }
    return url;
  }

  // 2. Handle paths/filenames
  let finalFilename = url;
  if (typeof url === "string") {
    finalFilename = url
      .replace(/^https?:\/\/[^\/]+/, "")
      .replace(/^\/?api\/uploads\//, "")
      .replace(/^\/?uploads\//, "")
      .replace(/^\//, "");
  }

  // If it's a blob or data URL, return as is
  if (typeof url === "string" && (url.startsWith("blob:") || url.startsWith("data:"))) {
    return url;
  }

  return `${baseURL_IMG}/${finalFilename}`;
};


