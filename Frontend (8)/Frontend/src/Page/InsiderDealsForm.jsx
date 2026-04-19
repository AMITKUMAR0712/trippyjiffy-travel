
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, ShieldCheck, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import Style from "../Style/InsiderDealsForm.module.scss";

const InsiderDealsForm = ({ context = "Upcoming Trip" }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeUsers, setActiveUsers] = useState(Math.floor(Math.random() * 20) + 10);
  const baseURL = import.meta.env.VITE_API_BASE_URL || "";

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => {
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.max(8, prev + change);
      });
    }, 5000);
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
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={Style.formContainer}
    >
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={Style.successCard}
          >
            <div className={Style.successCircle}>
              <CheckCircle2 size={48} />
            </div>
            <h3>Thank You, {formData.name.split(' ')[0]}!</h3>
            <p>Our lead travel architect has been notified. You'll receive the insider itinerary on WhatsApp/Email within 15 minutes.</p>
            <div className={Style.successBadge}>Priority Lead ID: TJ-{Math.floor(Math.random() * 10000)}</div>
          </motion.div>
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
              <motion.div variants={itemVariants} className={Style.floatingGroup}>
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
              </motion.div>

              {/* Phone Field with Floating Label */}
              <motion.div variants={itemVariants} className={Style.floatingGroup}>
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
              </motion.div>

              {/* Email Field with Floating Label */}
              <motion.div variants={itemVariants} className={Style.floatingGroup}>
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
              </motion.div>
            </div>

            <motion.button 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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
            </motion.button>

            <footer className={Style.footer}>
              <div className={Style.trustRow}>
                <ShieldCheck size={14} /> 256-bit Secure Encryption
              </div>
              <p>Join 50,000+ satisfied explorers today.</p>
            </footer>
          </form>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InsiderDealsForm;
