import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Style from "../Style/Enquiry.module.scss";
import axios from "axios";
import { toast } from "sonner";
import {
  User, Mail, MessageCircle, MapPin,
  CalendarDays, Hotel, Users, Baby,
  MessageSquare, Send, CheckCircle2, Plane,
  Clock, DollarSign
} from "lucide-react";

const BOOKING_TIMELINE_OPTIONS = [
  "Within 30 Days",
  "Within 1–3 Months",
  "Within 3–6 Months",
  "More than 6 Months",
  "Just Exploring Options",
];

const HOLIDAY_BUDGET_OPTIONS = [
  "Under 1000 USD per person",
  "1000-2000 USD",
  "2000-3000 USD",
  "Above 3000 USD",
];

const BG_IMAGES = [
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=1600&q=80",
];

const Enquiry = ({ isLandingPage = false, isModal = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "",
    destination: "",
    booking_timeline: "", holiday_budget: "",
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
      destination: "",
      booking_timeline: "", holiday_budget: "",
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
        <div className={Style.Card}>
          <div className={Style.SuccessIcon}>
            <CheckCircle2 size={56} />
          </div>
          <h2 className={Style.SuccessTitle}>Enquiry Received! ✈</h2>
          <p className={Style.SuccessMsg}>
            We've received your travel request and our team will reach out to you shortly. Get ready for an incredible journey!
          </p>
        </div>
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

      <div className={Style.Card}>
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
              <label><MessageCircle size={12} />WhatsApp Number</label>
              <input type="tel" name="phone" placeholder="WhatsApp Number (e.g. +91 98765 43210)"
                value={formData.phone} onChange={handleChange} required
                inputMode="tel" autoComplete="tel" />
            </div>
          </div>

          {/* Row 2: Destination */}
          <div className={Style.Field}>
            <label><MapPin size={12} />Destination</label>
            <input type="text" name="destination" placeholder="Where to?"
              value={formData.destination} onChange={handleChange} required />
          </div>

          {/* Row 3: Booking Timeline */}
          <div className={Style.Field}>
            <label><Clock size={12} />When are you planning to book your holiday? (Required)</label>
            <select name="booking_timeline" value={formData.booking_timeline}
              onChange={handleChange} required>
              <option value="">Select...</option>
              {BOOKING_TIMELINE_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Row 4: Holiday Budget */}
          <div className={Style.Field}>
            <label><DollarSign size={12} />Approximate Total Holiday Budget (Required)</label>
            <select name="holiday_budget" value={formData.holiday_budget}
              onChange={handleChange} required>
              <option value="">Select...</option>
              {HOLIDAY_BUDGET_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Row 5: Dates */}
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

          {/* Row 6: Hotel + Adults + Children */}
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
      </div>
    </div>
  );
};

export default Enquiry;
