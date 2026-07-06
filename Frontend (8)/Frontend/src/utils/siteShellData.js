import axios from "axios";
import { apiPath } from "./apiBase";

let settingsPromise;
let catalogPromise;
let navigationPromise;

const slugify = (text) =>
  (text || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

export const applyThemeSettings = (settings) => {
  if (!settings) return;

  const root = document.documentElement;
  root.style.setProperty("--primary-color", settings.primaryColor);
  root.style.setProperty("--secondary-color", settings.secondaryColor);
  root.style.setProperty("--font-family", settings.fontFamily);
  root.style.setProperty("--navbar-color", settings.navbarColor);
  root.style.setProperty("--footer-color", settings.footerColor);
  root.style.setProperty("--card-radius", `${settings.borderRadius}px` || "20px");

  document.body.style.fontFamily = `${settings.fontFamily}, sans-serif`;

  if (settings.darkTheme) {
    document.body.classList.add("dark-theme");
  } else {
    document.body.classList.remove("dark-theme");
  }
};

export const getSettingsData = async () => {
  if (!settingsPromise) {
    settingsPromise = axios
      .get(apiPath("/settings/get"))
      .then((res) => res.data)
      .catch((err) => {
        settingsPromise = null;
        throw err;
      });
  }

  return settingsPromise;
};

const getCatalogData = async () => {
  if (!catalogPromise) {
    catalogPromise = Promise.all([
      axios.get(apiPath("/category-india/get")),
      axios.get(apiPath("/asia/get")),
    ])
      .then(([indiaRes, asiaRes]) => ({
        india: Array.isArray(indiaRes.data) ? indiaRes.data : [],
        asia: Array.isArray(asiaRes.data) ? asiaRes.data : [],
      }))
      .catch((err) => {
        catalogPromise = null;
        throw err;
      });
  }

  return catalogPromise;
};

export const getNavigationData = async () => {
  if (!navigationPromise) {
    navigationPromise = Promise.all([
      getCatalogData(),
      axios.get(apiPath("/landing-pages/all")).catch(() => ({ data: [] })),
    ])
      .then(([catalog, exclusivesRes]) => {
        const indiaTours = catalog.india.map((item) => ({
          id: item.id,
          name: item.region_name,
          path: `/india-tours/${slugify(item.region_name)}`,
          image: item.image || item.image_url || null,
        }));

        const asiaTours = catalog.asia.map((item) => ({
          id: item.id,
          name: item.country_name,
          path: `/asia-tours/${slugify(item.country_name)}`,
          images: item.images || [],
        }));

        const pages = exclusivesRes.data?.success
          ? exclusivesRes.data.data
          : Array.isArray(exclusivesRes.data)
            ? exclusivesRes.data
            : [];

        const exclusivePages = pages.map((page) => ({
          name: page.title,
          path: `/family-trips/${page.slug}`,
        }));

        return { indiaTours, asiaTours, exclusivePages };
      })
      .catch((err) => {
        navigationPromise = null;
        throw err;
      });
  }

  return navigationPromise;
};

export const getFooterToursData = async () => {
  const catalog = await getCatalogData();
  return {
    indiaTours: catalog.india,
    asiaTours: catalog.asia,
  };
};

export const prefetchShellData = () => {
  getSettingsData().catch(() => {});
  getCatalogData().catch(() => {});
};
