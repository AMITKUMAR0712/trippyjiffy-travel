import React, { useState, useEffect } from "react";
import { FaWhatsapp, FaArrowUp } from "react-icons/fa";
import Style from "../Style/WhatsappButton.module.scss";

const WhatsappButton = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScroll && window.scrollY > 200) {
        setShowScroll(true);
      } else if (showScroll && window.scrollY <= 200) {
        setShowScroll(false);
      }
    };
    window.addEventListener("scroll", checkScrollTop);
    return () => window.removeEventListener("scroll", checkScrollTop);
  }, [showScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const whatsappNumber = "919870210896";

  return (
    <>
      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${whatsappNumber}`}
        className={Style.whatsapp_float}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaWhatsapp />
      </a>
      {/* Scroll Top */}
      {showScroll && (
        <button className={Style.scroll_top} onClick={scrollToTop}>
          <FaArrowUp />
        </button>
      )}
    </>
  );
};

export default WhatsappButton;
