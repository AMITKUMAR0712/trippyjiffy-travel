// LanguageContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [language, setLanguage] = useState("en");
  const [translations, setTranslations] = useState({});

  const translateBatch = async (texts) => {
    // ❌ FIX: Check if baseURL is defined before making API call
    if (!baseURL) {
      console.warn("⚠️ VITE_API_BASE_URL is not defined. Translations disabled.");
      return;
    }

    try {
      const keys = Array.isArray(Object.keys(texts)) ? Object.keys(texts) : [];
      const promises = keys.map(async (key) => {
        const res = await axios.post(`${baseURL}/api/translate`, {
          text: texts[key],
          target: language,
        });
        return [key, res.data.translation || texts[key]];
      });
      const results = await Promise.all(promises);
      setTranslations(Object.fromEntries(results));
    } catch (err) {
      console.error("Translation error:", err);
      // On error, just use the original text
      setTranslations(texts);
    }
  };

  useEffect(() => {
    if (!language) return;
    
    const defaultTexts = {
      home: "Home",
      about: "About Us",
      contact: "Contact Us",
      indiaTours: "India Tours",
      asiaTours: "Asia Tours",
      blogs: "Blogs",
      planTrip: "Plan Your Trip",
      payNow: "Pay Now",
      feedback: "Feedback",
    };
    translateBatch(defaultTexts);
  }, [language, baseURL]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
