import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "../HomeCompontent/Header";
import Footer from "../HomeCompontent/Footer";
import WhatsappButton from "../HomeCompontent/WhatsappButton";
import ScrollToTop from "../HomeCompontent/ScrollToTop";
import HeaderTop from "../HomeCompontent/HeaderTop";
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

    // Apply font to body
    document.body.style.fontFamily = settings.fontFamily + ", sans-serif";
  };

  return (
    <HelmetProvider>
      <LanguageProvider>
        <ScrollToTop />
        <HeaderTop />
        <Header />
        <Outlet />
        <Footer />
        <WhatsappButton />
        <Toaster position="top-right" richColors expand={true} />
      </LanguageProvider>
    </HelmetProvider>
  );
};

export default App;
