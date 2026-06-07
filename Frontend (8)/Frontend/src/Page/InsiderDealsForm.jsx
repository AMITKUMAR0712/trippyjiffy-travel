
import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, Mail, Phone, ShieldCheck, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import Style from "../Style/InsiderDealsForm.module.scss";

const getInitialActiveUsers = () => Math.floor(Math.random() * 81) + 120;

const InsiderDealsForm = ({ context = "Upcoming Trip" }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeUsers, setActiveUsers] = useState(getInitialActiveUsers);
  const baseURL = import.meta.env.VITE_API_BASE_URL || "";

  useEffect(() => {
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
  }, []);

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
        origin: "Elite Lead",
        destination: "Floating Label High Priority",
        arrival_date: new Date().toISOString().split("T")[0],
        departure_date: new Date(Date.now() + 86400000 * 7).toISOString().split("T")[0],
        hotel_category: "VIP Leads",
        no_of_adults: 2,
        no_of_children: 0,
        message: `High Priority Elite Lead from ${context}.`,
      });

      setSuccess(true);
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className={Style.formContainer}>
      <div style={{ display: "contents" }}>
        {success ? (
          <div 
            key="success"
            className={Style.successCard}
          >
            <div className={Style.successCircle}>
              <CheckCircle2 size={48} />
            </div>
            <h3>Thank You, {formData.name.split(' ')[0]}!</h3>
            <p>Our lead travel architect has been notified. You'll receive the insider itinerary on WhatsApp/Email within 15 minutes.</p>
          </div>
        ) : (
          <form key="form" onSubmit={handleSubmit} className={Style.mainForm}>
            <div className={Style.liveBadge}>
              <span className={Style.pulseDot}></span>
              {activeUsers} travelers planning right now
            </div>

            <header className={Style.header}>
              <h2>Unlock Insider Deals <Sparkles size={20} className={Style.iconSpark} /></h2>
              <p>Exclusive group rates & hidden itineraries not found on the web.</p>
            </header>

            <div className={Style.formFields}>
              {/* Name Field with Floating Label */}
              <div className={Style.floatingGroup}>
                <div className={Style.iconBox}><User size={18} /></div>
                <input
                  type="text"
                  name="name"
                  id="lead-name"
                  placeholder=" "
                  value={formData.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                />
                <label htmlFor="lead-name">Enter your full name</label>
              </div>

              {/* Phone Field with Floating Label */}
              <div className={Style.floatingGroup}>
                <div className={Style.iconBox}><Phone size={18} /></div>
                <input
                  type="tel"
                  name="phone"
                  id="lead-phone"
                  placeholder=" "
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  autoComplete="tel"
                />
                <label htmlFor="lead-phone">WhatsApp Number (ex: +91...)</label>
              </div>

              {/* Email Field with Floating Label */}
              <div className={Style.floatingGroup}>
                <div className={Style.iconBox}><Mail size={18} /></div>
                <input
                  type="email"
                  name="email"
                  id="lead-email"
                  placeholder=" "
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
                <label htmlFor="lead-email">Email for Itinerary</label>
              </div>
            </div>

            <button
              type="submit" 
              className={Style.ctaBtn} 
              disabled={loading}
            >
              {loading ? (
                <span className={Style.loader}></span>
              ) : (
                <>
                  Get Access Now <ArrowRight size={20} />
                </>
              )}
            </button>

            <footer className={Style.footer}>
              <div className={Style.trustRow}>
                <ShieldCheck size={14} /> 256-bit Secure Encryption
              </div>
              <p>Join 50,000+ satisfied explorers today.</p>
            </footer>
          </form>
        )}
      </div>
    </div>
  );
};

export default InsiderDealsForm;
