import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { createPortal } from "react-dom";
import Style from "../Style/AutoLeadPopup.module.scss";

const getInitialActiveUsers = () => Math.floor(Math.random() * 81) + 120;

const AutoLeadPopup = ({
  delay = 5000,
  context = "Homepage",
  forceShow = false,
  onClose = null,
  triggerAfterScrollPercent = null,
}) => {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeUsers, setActiveUsers] = useState(getInitialActiveUsers);
  const animationFrame = useRef(null);
  const baseURL = import.meta.env.VITE_API_BASE_URL || "";

  useEffect(() => {
    if (!show) return undefined;

    const interval = setInterval(() => {
      setActiveUsers(prev => {
        const change = Math.floor(Math.random() * 5) - 2;
        let newValue = prev + change;
        if (newValue < 120) newValue = 120;
        if (newValue > 220) newValue = 220;
        return newValue;
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [show]);

  useEffect(() => {
    if (!show) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [show]);

  useEffect(() => {
    if (forceShow) {
      setShow(true);
      return;
    }

    const hasFilled = sessionStorage.getItem("leadPopupFilled");
    if (hasFilled) return;

    if (typeof triggerAfterScrollPercent === "number") {
      const handleScroll = () => {
        if (animationFrame.current) return;

        animationFrame.current = window.requestAnimationFrame(() => {
          animationFrame.current = null;
          const doc = document.documentElement;
          const maxScroll = doc.scrollHeight - window.innerHeight;
          const scrollPercent = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 100;

          if (scrollPercent >= triggerAfterScrollPercent) {
            setShow(true);
            window.removeEventListener("scroll", handleScroll);
          }
        });
      };

      handleScroll();
      window.addEventListener("scroll", handleScroll, { passive: true });

      return () => {
        window.removeEventListener("scroll", handleScroll);
        if (animationFrame.current) {
          window.cancelAnimationFrame(animationFrame.current);
        }
      };
    }

    const timer = setTimeout(() => {
      setShow(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, forceShow, triggerAfterScrollPercent]);

  const handleClose = () => {
    setShow(false);
    if (onClose) onClose();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;
    setLoading(true);

    try {
      await axios.post(`${baseURL}/api/enquiry/post`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        origin: "Not Specified",
        destination: "Not Specified",
        arrival_date: new Date().toISOString().split("T")[0],
        departure_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        hotel_category: "Quick Lead",
        no_of_adults: 2,
        no_of_children: 0,
        message: `Quick Lead from ${context} pop-up.`,
      });

      setSuccess(true);
      sessionStorage.setItem("leadPopupFilled", "true");
      setTimeout(() => {
        handleClose();
      }, 3000); // close after 3s showing success
    } catch (err) {
      console.error("Popup submit error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return createPortal(
    <div className={Style.overlay} onClick={handleClose}>
      <div
        className={Style.popupCard}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <button className={Style.closeBtn} onClick={handleClose}>&times;</button>

        <div className={Style.imageSection}>
          <div className={Style.badge}>Exclusive Offer</div>
          <h3>Plan Your Dream Vacation</h3>
          <p>Get a customized itinerary & best deals instantly!</p>
        </div>

        <div className={Style.formSection}>
          {success ? (
            <div className={Style.successMsg}>
              <div className={Style.checkIcon}>✓</div>
              <h4>Request Received!</h4>
              <p>Our travel expert will contact you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={Style.leadForm}>
              <div className={Style.liveBadge}>
                <span className={Style.pulseDot}></span>
                {activeUsers} travelers planning right now
              </div>
              <h4>Unlock Insider Travel Deals</h4>
              <p>Just 10 seconds to fill. No spam, promise.</p>

              <div className={Style.inputGroup}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={Style.inputGroup}>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={Style.inputGroup}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className={Style.submitBtn} disabled={loading}>
                {loading ? "Sending..." : "Get Free Quote Now"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AutoLeadPopup;
