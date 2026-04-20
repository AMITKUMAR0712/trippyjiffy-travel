import React, { useState } from "react";
import Style from "../Style/FeedbackForm.module.scss";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { User, MapPin, Navigation, Camera, Star, MessageSquareHeart, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const BG_IMAGE =
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80";

const STAR_LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent!"];

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    rating: 0,
    review: "",
    destination: "",
    origin: "",
  });
  const [photo, setPhoto] = useState(null);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const baseURL = import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com";

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.rating) return toast.error("Please select a star rating ⭐");
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("rating", formData.rating);
      data.append("review", formData.review);
      data.append("destination", formData.destination);
      data.append("origin", formData.origin);
      if (photo) data.append("photo", photo);

      await axios.post(`${baseURL}/api/feedback/add`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={Style.Page}>
      {/* Blurred travel background */}
      <div
        className={Style.BgImage}
        style={{ backgroundImage: `url(${BG_IMAGE})` }}
      />
      <div className={Style.BgOverlay} />

      {/* Floating particles for ambiance */}
      <div className={Style.Particles}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className={Style.Particle} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {submitted ? (
          /* ── SUCCESS SCREEN ── */
          <motion.div
            key="success"
            className={Style.Card}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.div
              className={Style.SuccessIcon}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CheckCircle2 size={60} />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={Style.SuccessTitle}
            >
              Thank You, {formData.name || "Explorer"}! 🌍
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className={Style.SuccessMsg}
            >
              Your story inspires others to explore the world. We're grateful
              you shared your journey with us.
            </motion.p>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className={Style.ResetBtn}
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: "", rating: 0, review: "", destination: "", origin: "" });
                setPhoto(null);
              }}
            >
              Share Another Story
            </motion.button>
          </motion.div>
        ) : (
          /* ── FEEDBACK CARD ── */
          <motion.div
            key="form"
            className={Style.Card}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Header */}
            <div className={Style.CardHeader}>
              <div className={Style.HeaderIcon}>
                <MessageSquareHeart size={26} />
              </div>
              <div>
                <h1 className={Style.CardTitle}>Share Your Journey</h1>
                <p className={Style.CardSubtitle}>
                  Every story makes someone's next trip unforgettable
                </p>
              </div>
            </div>

            <div className={Style.Divider} />

            <form onSubmit={handleSubmit} className={Style.Form}>
              {/* Name */}
              <div className={Style.Field}>
                <label><User size={14} /> Your Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="What should we call you?"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Origin + Destination row */}
              <div className={Style.Row}>
                <div className={Style.Field}>
                  <label><Navigation size={14} /> From (City)</label>
                  <input
                    type="text"
                    name="origin"
                    placeholder="Your home city"
                    value={formData.origin}
                    onChange={handleChange}
                  />
                </div>
                <div className={Style.Field}>
                  <label><MapPin size={14} /> Destination</label>
                  <input
                    type="text"
                    name="destination"
                    placeholder="Where did you travel?"
                    value={formData.destination}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Star Rating */}
              <div className={Style.Field}>
                <label><Star size={14} /> Rate Your Experience</label>
                <div className={Style.StarRow}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`${Style.StarBtn} ${
                        n <= (hoveredStar || formData.rating) ? Style.StarActive : ""
                      }`}
                      onMouseEnter={() => setHoveredStar(n)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={() => setFormData({ ...formData, rating: n })}
                      aria-label={`${n} stars`}
                    >
                      ★
                    </button>
                  ))}
                  {(hoveredStar || formData.rating) > 0 && (
                    <span className={Style.StarLabel}>
                      {STAR_LABELS[hoveredStar || formData.rating]}
                    </span>
                  )}
                </div>
              </div>

              {/* Review */}
              <div className={Style.Field}>
                <label><MessageSquareHeart size={14} /> Tell Your Story</label>
                <textarea
                  name="review"
                  placeholder="What made this journey special? Share the moments that touched your heart..."
                  value={formData.review}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>

              {/* Photo upload */}
              <div className={Style.Field}>
                <label><Camera size={14} /> Add a Photo (Optional)</label>
                <label className={Style.PhotoZone}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                  />
                  {photo ? (
                    <div className={Style.PhotoPreviewWrap}>
                      <img
                        src={URL.createObjectURL(photo)}
                        alt="preview"
                        className={Style.PhotoPreview}
                      />
                      <span className={Style.PhotoName}>✅ {photo.name}</span>
                    </div>
                  ) : (
                    <span className={Style.PhotoPlaceholder}>
                      📷 Click to upload a travel memory
                    </span>
                  )}
                </label>
              </div>



              <button
                type="submit"
                className={Style.SubmitBtn}
                disabled={loading}
              >
                {loading ? (
                  <span className={Style.Spinner} />
                ) : (
                  "✈ Share My Story"
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeedbackForm;
