import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "../HomeCompontent/Header";
import Footer from "../HomeCompontent/Footer";
import WhatsappButton from "../HomeCompontent/WhatsappButton";
import ScrollToTop from "../HomeCompontent/ScrollToTop";
import HeaderTop from "../HomeCompontent/HeaderTop";
import MobileBottomNav from "../HomeCompontent/MobileBottomNav";

import { LanguageProvider } from "../HomeCompontent/LanguageContext";
import { Toaster } from "sonner";
import { applyThemeSettings, getSettingsData } from "../utils/siteShellData";

const App = () => {
  useEffect(() => {
    let cancelled = false;
    const fetchTheme = async () => {
      try {
        const res = await getSettingsData();
        if (cancelled) return;
        applyThemeSettings(res);
      } catch (err) {
        console.error("Error fetching theme:", err);
      }
    };

    fetchTheme();

    return () => {
      cancelled = true;
    };
  }, []);

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
