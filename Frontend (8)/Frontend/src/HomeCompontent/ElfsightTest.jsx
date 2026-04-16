import React, { useEffect } from "react";

const ELFSIGHT_ID_CLASS = "elfsight-app-4bfd7f01-c029-4aa3-96b3-79c2b5aad84b";

export default function ElfsightTest() {
  useEffect(() => {
    // remove any previous elfsight script to avoid duplicates while testing
    const prev = document.querySelector('script[data-elfsight="platform"]');
    if (prev) prev.remove();

    const script = document.createElement("script");
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = false; // try non-async for test
    script.setAttribute("data-elfsight", "platform");

    script.onload = () => {
      console.log("Elfsight script loaded");
      // attempt to force widget init if function exists
      if (window.elfsight && typeof window.elfsight.init === "function") {
        window.elfsight.init();
        console.log("Elfsight init called");
      }
    };

    script.onerror = (e) => {
      console.error("Elfsight script failed to load", e);
    };

    document.body.appendChild(script);

    return () => {
      // do not remove script permanently; only for tests you may remove
      // document.body.removeChild(script);
    };
  }, []);

  return (
    <section style={{ textAlign: "center", marginTop: 40 }}>
      <h2>Test Elfsight Widget</h2>
      <div className={ELFSIGHT_ID_CLASS} />
      <div style={{ marginTop: 12, color: "#666" }}>
        Check console for <code>Elfsight script loaded</code> or errors.
      </div>
    </section>
  );
}
