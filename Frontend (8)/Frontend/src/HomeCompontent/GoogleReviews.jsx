import React, { useEffect, useRef } from "react";

const ELFSIGHT_ID_CLASS = "elfsight-app-4bfd7f01-c029-4aa3-96b3-79c2b5aad84b";

export default function ElfsightTest({ className = "" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadScript();
        observer.disconnect();
      }
    }, { rootMargin: '200px' });

    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const loadScript = () => {
    if (document.querySelector('script[data-elfsight="platform"]')) return;

    const script = document.createElement("script");
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;
    script.setAttribute("data-elfsight", "platform");

    script.onload = () => {
      if (window.elfsight && typeof window.elfsight.init === "function") {
        window.elfsight.init();
      }
    };
    document.body.appendChild(script);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let scrollPos = 0;
    const speed = 0.5;
    let animationFrame;

    const tick = () => {
      if (!el) return;
      scrollPos += speed;
      if (scrollPos >= el.scrollWidth - el.clientWidth) {
        scrollPos = 0;
      }
      el.scrollLeft = scrollPos;
      animationFrame = requestAnimationFrame(tick);
    };

    const startObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animationFrame = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(animationFrame);
      }
    });

    startObserver.observe(el);

    return () => {
      cancelAnimationFrame(animationFrame);
      startObserver.disconnect();
    };
  }, []);

  return (
    <section
      style={{ textAlign: "center", marginTop: 20 }}
      className={className}
      ref={containerRef}
    >
      <div className={ELFSIGHT_ID_CLASS} />
    </section>
  );
}
