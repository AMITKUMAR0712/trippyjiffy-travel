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

const baseURL_IMG = import.meta.env.VITE_API_BASE_URL_IMG || "http://localhost:5005/api/uploads";

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

  // 0. If it maps directly to an internally compiled Vite asset, intercept it!
  if (LOCAL_ASSET_MAP[url]) {
    return LOCAL_ASSET_MAP[url];
  }

  const currentHost = window.location.host;
  const isLocal = currentHost.includes("localhost") || currentHost.includes("127.0.0.1");

  if (isLocal && typeof url === "string" && url.includes("trippyjiffy.com")) {
    const filename = url.split("/").pop();
    return `${baseURL_IMG}/${filename}`;
  }

  if (typeof url === "string" && (url.startsWith("http://") || url.startsWith("https://"))) {
    return url;
  }

  let filename = url;
  if (typeof url === "string") {
    filename = url
      .replace(/^https?:\/\/[^\/]+/, "")
      .replace(/^\/?api\/uploads\//, "")
      .replace(/^\/?uploads\//, "")
      .replace(/^\//, "");
  }

  return `${baseURL_IMG}/${filename}`;
};

