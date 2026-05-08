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
const baseURL_IMG = `${apiBase.replace(/\/$/, "")}/api/uploads`;

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

  // 1. Check if it's a base64 or blob URL
  if (typeof url === "string" && (url.startsWith("blob:") || url.startsWith("data:"))) {
    return url;
  }

  // 2. Normalize: extract only the filename
  let filename = url;
  if (typeof url === "string") {
    // Remove protocol and domain if present
    filename = url.replace(/^https?:\/\/[^\/]+/, "");
    // Remove /api/uploads/ or uploads/ prefixes
    filename = filename.replace(/^\/?api\/uploads\//, "").replace(/^\/?uploads\//, "").replace(/^\//, "");
  }

  // 3. Check internal asset map with standard path
  const normalizedPath = `/api/uploads/${filename}`;
  if (LOCAL_ASSET_MAP[normalizedPath]) {
    return LOCAL_ASSET_MAP[normalizedPath];
  }

  // 4. Handle absolute URLs (that aren't our domain or are already full)
  if (typeof url === "string" && url.startsWith("http")) {
    // If it's a localhost or old IP URL, redirect to production baseURL_IMG
    if (url.includes("localhost") || url.includes("127.0.0.1") || url.includes("187.127.139.99")) {
       return `${baseURL_IMG}/${filename}`;
    }
    return url;
  }

  // 5. Default: Append to production uploads path
  return `${baseURL_IMG}/${filename}`;
};
