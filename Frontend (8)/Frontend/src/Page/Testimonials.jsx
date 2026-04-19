import React, { useEffect, useState, useRef, memo, useCallback } from "react";
import Style from "../Style/Testimonials.module.scss";
import axios from "axios";
import GoogleReviews from "../HomeCompontent/GoogleReviews.jsx";
import { createPortal } from "react-dom";

// Full-resolution images for the background slider
const travelImages = [
  "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1454372182658-c712e4c5a1db?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1504150558240-0b4fd8946624?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1600&q=80",
];

const travelThumbs = travelImages.map((url) => url.replace("w=1600", "w=400"));

const defaultGallery = [
  { title: "River Canyon",     subtitle: "Nature Photography" },
  { title: "Mountain Peak",    subtitle: "Expedition 2026" },
  { title: "Alpine Fog",       subtitle: "Winter Series" },
  { title: "Coastal Waves",    subtitle: "Ocean View" },
  { title: "Wilderness",       subtitle: "Wildlife Reserve" },
  { title: "Deep Forest",      subtitle: "Canopy Exploration" },
  { title: "Aurora",           subtitle: "Night Sky" },
  { title: "The Journey",      subtitle: "Urban Transit" },
  { title: "Flight",           subtitle: "Aerial Photography" },
  { title: "Cozy Mornings",    subtitle: "Portrait Series" },
  { title: "Barren Lands",     subtitle: "Desert Textures" },
  { title: "Winter Solstice",  subtitle: "Fashion Editorial" },
  { title: "Undergrowth",      subtitle: "Macro Nature" },
  { title: "Concrete Oasis",   subtitle: "Cityscapes" },
];

/* ─────────────────────────────────────────
   Feedback Detail MODAL
───────────────────────────────────────── */
const FeedbackModal = ({ item, imgSrc, onClose }) => {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const stars = item.rating ? Math.min(Math.max(Math.round(item.rating), 1), 5) : null;

  return createPortal(
    <div
      className={Style.modalOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Feedback details"
    >
      <div
        className={Style.modalCard}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button className={Style.modalClose} onClick={onClose} aria-label="Close">✕</button>

        {/* Top hero image */}
        <div className={Style.modalHero}>
          <img src={imgSrc} alt={item.title} />
          <div className={Style.modalHeroOverlay} />
          {/* Name + location badge */}
          <div className={Style.modalHeroBadge}>
            <div className={Style.modalAvatar}>
              {item.title?.[0]?.toUpperCase() || "T"}
            </div>
            <div>
              <h3 className={Style.modalName}>{item.title}</h3>
              {item.subtitle && (
                <p className={Style.modalLocation}>📍 {item.subtitle}</p>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className={Style.modalBody}>
          {/* Star rating */}
          {stars && (
            <div className={Style.modalStars}>
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  className={s <= stars ? Style.starFilled : Style.starEmpty}
                >
                  ★
                </span>
              ))}
              <span className={Style.modalRatingText}>{stars}/5</span>
            </div>
          )}

          {/* Photo from feedback (if any) */}
          {item.photo && (
            <div className={Style.modalPhotoWrap}>
              <img
                src={item.photo}
                alt="Traveler photo"
                className={Style.modalTravelerPhoto}
              />
            </div>
          )}

          {/* Review text */}
          {item.review ? (
            <div className={Style.modalReviewBox}>
              <span className={Style.quoteIcon}>"</span>
              <p className={Style.modalReviewText}>{item.review}</p>
              <span className={Style.quoteIconClose}>"</span>
            </div>
          ) : (
            <p className={Style.modalNoReview}>
              This traveler hasn't shared a review yet, but their journey with TrippyJiffy was unforgettable! ✈️
            </p>
          )}

          {/* Origin → Destination (if real testimonial) */}
          {item.origin && item.destination && (
            <div className={Style.modalRoute}>
              <span className={Style.routeFrom}>{item.origin}</span>
              <span className={Style.routeArrow}>✈</span>
              <span className={Style.routeTo}>{item.destination}</span>
            </div>
          )}

          {/* Trip type / destination label */}
          {item.tripType && (
            <div className={Style.modalTripBadge}>🗺 {item.tripType}</div>
          )}

          {/* Date */}
          {item.date && (
            <div className={Style.modalDate}>🗓 {item.date}</div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

/* ─────────────────────────────────────────
   Single Hexagon Card
───────────────────────────────────────── */
const HexFeedbackCard = memo(({ item, imgIndex, onOpen }) => {
  const imageSrc = travelThumbs[imgIndex % travelThumbs.length];

  return (
    <div
      className={Style.hex}
      tabIndex="0"
      role="button"
      aria-label={`View feedback from ${item.title}`}
      onClick={() => onOpen(item, imageSrc)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onOpen(item, imageSrc); }}
    >
      <div className={Style.hexShape}>
        <img src={imageSrc} alt={item.title} loading="lazy" decoding="async" />
        <div className={Style.hexCaption}>
          <h3>{item.title}</h3>
          <p>{item.subtitle}</p>

          {item.review && (
            <div className={Style.reviewText}>
              "{item.review.length > 60
                ? item.review.substring(0, 60) + "…"
                : item.review}"
            </div>
          )}

          {item.rating && (
            <div className={Style.stars}>{"⭐".repeat(item.rating)}</div>
          )}

          <div className={Style.hexClickHint}>Tap to read full story</div>
        </div>
      </div>
    </div>
  );
});

/* ─────────────────────────────────────────
   Background Slider
───────────────────────────────────────── */
const BgSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % travelImages.length);
    }, 3000);
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div className={Style.bgSlider} aria-hidden="true">
      {travelImages.map((src, i) => (
        <div
          key={i}
          className={`${Style.bgSlide} ${i === activeIndex ? Style.bgSlideActive : ""}`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}
      <div className={Style.bgOverlay} />
    </div>
  );
};

/* ─────────────────────────────────────────
   Main Testimonials Component
───────────────────────────────────────── */
const INITIAL_VISIBLE = 7; // Show first 7 hexagons, rest behind "View All"

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const baseURL = import.meta.env.VITE_API_BASE_URL || "";

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/feedback/get`);
        setTestimonials(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching testimonials:", err);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };
    if (baseURL) fetchTestimonials();
  }, [baseURL]);

  // Real testimonials first -- then fill remaining with default gallery items
  const realItems = testimonials.map((real) => ({
    title:       real.name        || "Happy Traveler",
    subtitle:    [real.origin, real.destination].filter(Boolean).join(" → ") || "Client Feedback",
    review:      real.review      || null,
    rating:      real.rating      || 5,
    photo:       real.photo       || null,
    origin:      real.origin      || null,
    destination: real.destination || null,
    tripType:    real.tripType    || null,
    date:        real.date        || null,
  }));

  // Filler from defaultGallery (only items not already covered by real ones)
  const fillerItems = defaultGallery
    .slice(realItems.length)
    .map((d) => ({ title: d.title, subtitle: d.subtitle, review: null, rating: null }));

  const displayData = [...realItems, ...fillerItems];

  const visibleData = showAll ? displayData : displayData.slice(0, INITIAL_VISIBLE);
  const hasMore = displayData.length > INITIAL_VISIBLE;

  const handleOpen = useCallback((item, imgSrc) => {
    setSelectedItem(item);
    setSelectedImg(imgSrc);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedItem(null);
    setSelectedImg(null);
  }, []);

  return (
    <>
      <div className={Style.Testimonials}>
        <BgSlider />

        <h2 className={Style.aboutTitle}>
          JOURNEY <span>MEMORIES</span>
        </h2>

        <p className={Style.aboutSubtitle}>
          Real stories from our happy travelers — click any card to read full feedback
        </p>

        <div className={Style.galleryWrapper}>
          <div className={Style.hexGrid}>
            {visibleData.map((item, index) => (
              <HexFeedbackCard
                key={index}
                item={item}
                imgIndex={index}
                onOpen={handleOpen}
              />
            ))}
          </div>
        </div>

        {/* View All / Show Less button */}
        {hasMore && (
          <div className={Style.viewAllWrap}>
            <button
              className={Style.viewAllBtn}
              onClick={() => setShowAll((prev) => !prev)}
            >
              {showAll ? (
                <>⬆ Show Less</>
              ) : (
                <>
                  View All {displayData.length} Memories
                  <span className={Style.viewAllCount}>{displayData.length - INITIAL_VISIBLE} more</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedItem && (
        <FeedbackModal
          item={selectedItem}
          imgSrc={selectedImg}
          onClose={handleClose}
        />
      )}

      <div className={Style.GoogleReviewsContainer}>
        <GoogleReviews />
      </div>
    </>
  );
};

export default Testimonials;
