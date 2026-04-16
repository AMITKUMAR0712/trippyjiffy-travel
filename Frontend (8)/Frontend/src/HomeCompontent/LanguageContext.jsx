// LanguageContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [language, setLanguage] = useState("en");
  const [translations, setTranslations] = useState({});

  const translateBatch = async (texts) => {
    try {
      const keys = Object.keys(texts);
      const promises = keys.map(async (key) => {
        const res = await axios.post(`${baseURL}/api/translate`, {
          text: texts[key],
          target: language,
        });
        return [key, res.data.translation];
      });
      const results = await Promise.all(promises);
      setTranslations(Object.fromEntries(results));
    } catch (err) {
      console.error("Translation error:", err);
    }
  };

  useEffect(() => {
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
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
