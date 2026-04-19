import React, { useState, useEffect } from "react";
import axios from "axios";
import { createPortal } from "react-dom";
import Style from "../Style/AutoLeadPopup.module.scss";

const AutoLeadPopup = ({ delay = 5000, context = "Homepage" }) => {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const baseURL = import.meta.env.VITE_API_BASE_URL || "";

  useEffect(() => {
    // Clear old legacy key from previous version just in case
    sessionStorage.removeItem("hasSeenLeadPopup");

    // Check if successfully submitted in this session
    const hasFilled = sessionStorage.getItem("leadPopupFilled");
    if (hasFilled) return;

    const timer = setTimeout(() => {
      setShow(true);
      document.body.style.overflow = "hidden";
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const handleClose = () => {
    setShow(false);
    // REMOVED sessionStorage setter here so it continues to show on navigation if not filled
    document.body.style.overflow = "auto";
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
              <h4>Unlock Insider Travel Deals ✈️</h4>
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
