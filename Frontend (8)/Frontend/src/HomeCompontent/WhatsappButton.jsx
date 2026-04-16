import React, { useState, useEffect } from "react";
import { FaWhatsapp, FaArrowUp } from "react-icons/fa";
import Style from "../Style/WhatsappButton.module.scss";
import ChatSupport from "../Page/ChatSupport";  

const WhatsappButton = () => {
  const [showScroll, setShowScroll] = useState(false);
  const [openChat, setOpenChat] = useState(false);

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

      {/* OVERLAY WITH NO BACKGROUND */}
      {openChat && (
        <div className={Style.modal_overlay}>
          <div className={Style.modal_content}>
            <button
              className={Style.modal_close}
              onClick={() => setOpenChat(false)}
            >
              ×
            </button>

            <ChatSupport />
          </div>
        </div>
      )}
    </>
  );
};

export default WhatsappButton;
