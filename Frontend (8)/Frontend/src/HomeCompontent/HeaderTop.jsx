
import React, { useEffect, useState, useRef } from "react";
import { FaGlobe } from "react-icons/fa";

const HeaderTop = () => {
  const [language, setLanguage] = useState("Language");
  const initialized = useRef(false);

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

  return (
    <div
      style={{
        padding: "10px 20px",
        background: "#121212",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      <button
        onClick={openTranslateDropdown}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "#d35400",
          color: "#fff",
          border: "none",
          padding: "6px 12px",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        <FaGlobe />
        {language}
      </button>

      <div id="google_translate_element" style={{ marginLeft: "10px" }} />
    </div>
  );
};

export default HeaderTop;

