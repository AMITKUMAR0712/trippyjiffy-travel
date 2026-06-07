import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "../HomeCompontent/Header";
import Footer from "../HomeCompontent/Footer";
import WhatsappButton from "../HomeCompontent/WhatsappButton";
import ScrollToTop from "../HomeCompontent/ScrollToTop";
import HeaderTop from "../HomeCompontent/HeaderTop";
import MobileBottomNav from "../HomeCompontent/MobileBottomNav";
import axios from "axios";

import { LanguageProvider } from "../HomeCompontent/LanguageContext";
import { Toaster } from "sonner";

const App = () => {
  const baseURL = import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com";

  useEffect(() => {
    let cancelled = false;
    const fetchTheme = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/settings/get`);
        if (cancelled) return;
        applyTheme(res.data);
      } catch (err) {
        console.error("Error fetching theme:", err);
      }
    };

    const runWhenIdle = window.requestIdleCallback || ((cb) => window.setTimeout(cb, 1200));
    const idleId = runWhenIdle(fetchTheme);

    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) {
        window.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
    };
  }, [baseURL]);

  const applyTheme = (settings) => {
    if (!settings) return;
    const root = document.documentElement;
    root.style.setProperty("--primary-color", settings.primaryColor);
    root.style.setProperty("--secondary-color", settings.secondaryColor);
    root.style.setProperty("--font-family", settings.fontFamily);
    root.style.setProperty("--navbar-color", settings.navbarColor);
    root.style.setProperty("--footer-color", settings.footerColor);
    root.style.setProperty("--card-radius", `${settings.borderRadius}px` || "20px");

    // Apply font to body
    document.body.style.fontFamily = settings.fontFamily + ", sans-serif";

    // Handle dark theme body class
    if (settings.darkTheme) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  };

  return (
    <LanguageProvider>
      <ScrollToTop />
      {/* Hide header top bar on mobile */}
      <HeaderTop />
      <Header />
      <Outlet />
      <Footer />
      <WhatsappButton />
      {/* Mobile-only bottom nav */}
      <MobileBottomNav />
      <Toaster position="top-right" richColors expand={true} />
    </LanguageProvider>
  );
};

export default App;
