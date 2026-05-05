import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);

    // GTM & GA4 Page Change Tracking
    // Use a small timeout to ensure react-helmet has updated the document.title
    const timer = setTimeout(() => {
      const currentPath = pathname + search;
      
      // Push to GTM DataLayer
      if (window.dataLayer) {
        window.dataLayer.push({
          event: "pageview",
          page: currentPath,
          title: document.title
        });
      }

      // Manual GA4 Page View (if needed)
      if (window.gtag) {
        window.gtag("config", "G-DGEZY5NBY0", {
          page_path: currentPath,
          page_title: document.title
        });
        // Also for Google Ads if tracking conversions on page views
        window.gtag("config", "AW-17771713499", {
          page_path: currentPath
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;


