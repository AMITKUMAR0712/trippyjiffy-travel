import React, { useEffect, useState, useRef } from "react";
import { FaGlobe } from "react-icons/fa";
import { Sparkles, Globe, Plane, Building2 } from "lucide-react";
import axios from "axios";
import Style from "../Style/HeaderTop.module.scss";

const HeaderTop = () => {
  const [language, setLanguage] = useState("Select Language  -->");
  const [messages, setMessages] = useState([
    "The #1 Platform for Global & Domestic Travel Experiences",
    "Support for Multiple Languages Worldwide",
    "Premium Stays & Exclusive Deals Available Now"
  ]);
  const initialized = useRef(false);
  const baseURL = import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com";

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/settings`);
        if (res.data && res.data.tickerMessages) {
           let parsed = typeof res.data.tickerMessages === 'string' ? JSON.parse(res.data.tickerMessages) : res.data.tickerMessages;
           if (Array.isArray(parsed) && parsed.length > 0) {
              setMessages(parsed);
           }
        }
      } catch (err) {
        console.error("Error fetching ticker settings:", err);
      }
    };
    fetchSettings();
  }, [baseURL]);

  useEffect(() => {
    // ⛔ Prevent multiple init
    if (initialized.current) return;
    initialized.current = true;

    // ✅ Google Translate init
    window.googleTranslateElementInit = () => {
      if (
        window.google &&
        window.google.translate &&
        !document.getElementById("google_translate_element")?.hasChildNodes()
      ) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,es,hi,fr,de",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          "google_translate_element"
        );
      }
    };

    // ✅ Load script only once
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }

    const interval = setInterval(() => {
      const selectEl = document.querySelector(".goog-te-combo");

      if (selectEl) {
        document.body.style.top = "0px";

        // Hide default UI
        selectEl.style.color = "transparent";
        selectEl.style.background = "transparent";

        // ⛔ Remove old listener before adding new
        selectEl.onchange = null;

        selectEl.onchange = () => {
          const langMap = {
            en: "English",
            es: "Spanish",
            hi: "Hindi",
            fr: "French",
            de: "German",
          };

          setLanguage(langMap[selectEl.value] || "Language");
        };

        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const openTranslateDropdown = () => {
    const selectEl = document.querySelector(".goog-te-combo");
    if (selectEl) selectEl.focus();
  };

  const icons = [Sparkles, Globe, Plane, Building2];

  return (
    <div className={Style.headerTopWrapper}>
      <div className={Style.marqueeContainer}>
        <div className={Style.marquee}>
          {[...messages, ...messages].map((msg, index) => {
             const Icon = icons[index % icons.length];
             return (
               <span key={index} className={Style.marqueeItem}>
                 <Icon size={14} className={Style.marqueeIcon} />
                 {msg} 
               </span>
             );
          })}
        </div>
      </div>

      <div className={Style.rightActions}>
        <button
          onClick={openTranslateDropdown}
        className={Style.langBtn}
      >
        <FaGlobe />
        <span className={Style.langText}>{language}</span>
      </button>

        <div id="google_translate_element" className={Style.googleTranslate} />
      </div>
    </div>
  );
};

export default HeaderTop;

