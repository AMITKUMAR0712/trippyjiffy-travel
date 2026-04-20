import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Style from "../Style/Enquiry.module.scss";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Phone, Navigation, MapPin,
  CalendarDays, Hotel, Users, Baby,
  MessageSquare, Send, CheckCircle2, Plane
} from "lucide-react";
import { toast } from "sonner";

const BG_IMAGES = [
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=1600&q=80",
];

const Enquiry = ({ isLandingPage = false, isModal = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "",
    origin: "", destination: "",
    arrival_date: "", departure_date: "",
    hotel_category: "",
    no_of_adults: 1, no_of_children: 0,
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const baseURL = import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com";

  // Pick a random background
  const bg = BG_IMAGES[Math.floor(Math.random() * BG_IMAGES.length)];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const resetForm = () =>
    setFormData({
      name: "", email: "", phone: "",
      origin: "", destination: "",
      arrival_date: "", departure_date: "",
      hotel_category: "", no_of_adults: 1, no_of_children: 0, message: "",
    });

  const postPublic = () => axios.post(`${baseURL}/api/enquiry/post`, formData);
  const postAuth = (token) =>
    axios.post(`${baseURL}/api/enquiry/post-auth`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (token) {
        try { await postAuth(token); }
        catch (err) {
          if (err?.response?.status === 401) {
            localStorage.removeItem("token");
            await postPublic();
          } else throw err;
        }
      } else {
        await postPublic();
      }
      resetForm();
      if (isLandingPage) { setSubmitted(true); }
      else { navigate("/thankyou"); }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (submitted) {
    return (
      <div className={Style.Page} style={{ backgroundImage: `url(${bg})` }}>
        <div className={Style.BgOverlay} />
        <motion.div
          className={Style.Card}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div className={Style.SuccessIcon}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}>
            <CheckCircle2 size={56} />
          </motion.div>
          <h2 className={Style.SuccessTitle}>Enquiry Received! ✈</h2>
          <p className={Style.SuccessMsg}>
            We've received your travel request and our team will reach out to you shortly. Get ready for an incredible journey!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className={`${Style.Page} ${isLandingPage ? Style.landingMode : ""} ${isModal ? Style.modalMode : ""}`}
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className={Style.BgOverlay} />

      {/* Ambient particles */}
      <div className={Style.Particles}>
        {[...Array(7)].map((_, i) => <div key={i} className={Style.Particle} />)}
      </div>

      <motion.div
        className={Style.Card}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
      >
        {/* Header */}
        <div className={Style.CardHeader}>
          <div className={Style.HeaderIcon}><Plane size={24} /></div>
          <div>
            <h1 className={Style.CardTitle}>Plan Your Dream Trip</h1>
            <p className={Style.CardSubtitle}>Fill in the details and we'll craft the perfect itinerary for you</p>
          </div>
        </div>

        <div className={Style.Divider} />



        <form onSubmit={handleSubmit} className={Style.Form}>

          {/* Row 1: Name, Email, Phone */}
          <div className={Style.Grid3}>
            <div className={Style.Field}>
              <label><User size={12} />Full Name</label>
              <input type="text" name="name" placeholder="John Doe"
                value={formData.name} onChange={handleChange} required />
            </div>
            <div className={Style.Field}>
              <label><Mail size={12} />Email</label>
              <input type="email" name="email" placeholder="you@example.com"
                value={formData.email} onChange={handleChange} required />
            </div>
            <div className={Style.Field}>
              <label><Phone size={12} />Phone</label>
              <input type="text" name="phone" placeholder="+91 98765 43210"
                value={formData.phone} onChange={handleChange} required />
            </div>
          </div>

          {/* Row 2: Origin + Destination */}
          <div className={Style.Grid2}>
            <div className={Style.Field}>
              <label><Navigation size={12} />From (Origin)</label>
              <input type="text" name="origin" placeholder="City of Departure"
                value={formData.origin} onChange={handleChange} required />
            </div>
            <div className={Style.Field}>
              <label><MapPin size={12} />Destination</label>
              <input type="text" name="destination" placeholder="Where to?"
                value={formData.destination} onChange={handleChange} required />
            </div>
          </div>

          {/* Row 3: Dates */}
          <div className={Style.Grid2}>
            <div className={Style.Field}>
              <label><CalendarDays size={12} />Arrival Date</label>
              <input type="date" name="arrival_date"
                value={formData.arrival_date} onChange={handleChange} required />
            </div>
            <div className={Style.Field}>
              <label><CalendarDays size={12} />Departure Date</label>
              <input type="date" name="departure_date"
                value={formData.departure_date} onChange={handleChange} required />
            </div>
          </div>

          {/* Row 4: Hotel + Adults + Children */}
          <div className={Style.Grid3}>
            <div className={Style.Field}>
              <label><Hotel size={12} />Hotel Category</label>
              <select name="hotel_category" value={formData.hotel_category}
                onChange={handleChange} required>
                <option value="">Select...</option>
                <option value="3 Star">⭐⭐⭐ 3 Star</option>
                <option value="4 Star">⭐⭐⭐⭐ 4 Star</option>
                <option value="5 Star">⭐⭐⭐⭐⭐ 5 Star</option>
                <option value="Luxury">💎 Luxury</option>
              </select>
            </div>
            <div className={Style.Field}>
              <label><Users size={12} />Adults</label>
              <input type="number" name="no_of_adults" min="1"
                value={formData.no_of_adults} onChange={handleChange} required />
            </div>
            <div className={Style.Field}>
              <label><Baby size={12} />Children</label>
              <input type="number" name="no_of_children" min="0"
                value={formData.no_of_children} onChange={handleChange} />
            </div>
          </div>

          {/* Message */}
          <div className={Style.Field}>
            <label><MessageSquare size={12} />Special Requirements</label>
            <textarea name="message" rows={3}
              placeholder="Any special requests, dietary needs, or preferences? Tell us everything..."
              value={formData.message} onChange={handleChange} />
          </div>

          <button type="submit" className={Style.SubmitBtn} disabled={loading}>
            {loading
              ? <span className={Style.Spinner} />
              : <><Send size={16} /> Send My Enquiry</>
            }
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Enquiry;
