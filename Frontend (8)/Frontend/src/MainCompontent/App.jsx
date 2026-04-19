import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "../HomeCompontent/Header";
import Footer from "../HomeCompontent/Footer";
import WhatsappButton from "../HomeCompontent/WhatsappButton";
import ScrollToTop from "../HomeCompontent/ScrollToTop";
import HeaderTop from "../HomeCompontent/HeaderTop";
import MobileBottomNav from "../HomeCompontent/MobileBottomNav";
import axios from "axios";

import { LanguageProvider } from "../HomeCompontent/LanguageContext";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";

const App = () => {
  const [theme, setTheme] = useState(null);
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/settings/get`);
        setTheme(res.data);
        applyTheme(res.data);
      } catch (err) {
        console.error("Error fetching theme:", err);
      }
    };
    fetchTheme();
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
    <HelmetProvider>
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
    </HelmetProvider>
  );
};

export default App;
