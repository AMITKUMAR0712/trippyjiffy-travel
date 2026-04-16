import React, { useEffect, useState, useRef, memo } from "react";
import Style from "../Style/Testimonials.module.scss";
import axios from "axios";
import GoogleReviews from "../HomeCompontent/GoogleReviews.jsx";

// Use full-resolution images for the background slider
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

// Thumbnail-sized images for hexagons
const travelThumbs = travelImages.map((url) =>
  url.replace("w=1600", "w=400")
);

const defaultGallery = [
  { title: "River Canyon", subtitle: "Nature Photography" },
  { title: "Mountain Peak", subtitle: "Expedition 2026" },
  { title: "Alpine Fog", subtitle: "Winter Series" },
  { title: "Coastal Waves", subtitle: "Ocean View" },
  { title: "Wilderness", subtitle: "Wildlife Reserve" },
  { title: "Deep Forest", subtitle: "Canopy Exploration" },
  { title: "Aurora", subtitle: "Night Sky" },
  { title: "The Journey", subtitle: "Urban Transit" },
  { title: "Flight", subtitle: "Aerial Photography" },
  { title: "Cozy Mornings", subtitle: "Portrait Series" },
  { title: "Barren Lands", subtitle: "Desert Textures" },
  { title: "Winter Solstice", subtitle: "Fashion Editorial" },
  { title: "Undergrowth", subtitle: "Macro Nature" },
  { title: "Concrete Oasis", subtitle: "Cityscapes" },
];

const HexFeedbackCard = memo(({ item, imgIndex }) => {
  const imageSrc = travelThumbs[imgIndex % travelThumbs.length];

  return (
    <div className={Style.hex} tabIndex="0" role="button">
      <div className={Style.hexShape}>
        <img src={imageSrc} alt={item.title} loading="lazy" decoding="async" />
        <div className={Style.hexCaption}>
          <h3>{item.title}</h3>
          <p>{item.subtitle}</p>

          {item.review && (
            <div className={Style.reviewText}>
              "{item.review.length > 70
                ? item.review.substring(0, 70) + "..."
                : item.review}"
            </div>
          )}

          {item.rating && (
            <div className={Style.stars}>{"⭐".repeat(item.rating)}</div>
          )}
        </div>
      </div>
    </div>
  );
});

/* ── Background Slider ── */
const BgSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % travelImages.length);
    }, 3000); // change every 3s
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
      {/* dark overlay so hexagons/text are always readable */}
      <div className={Style.bgOverlay} />
    </div>
  );
};

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const displayData = defaultGallery.map((defaultItem, index) => {
    const realTestimonial = testimonials[index];
    if (realTestimonial) {
      const location = [realTestimonial.origin, realTestimonial.destination]
        .filter(Boolean)
        .join(" - ");
      return {
        title: realTestimonial.name || "Happy Traveler",
        subtitle: location || "Client Feedback",
        review: realTestimonial.review,
        rating: realTestimonial.rating || 5,
      };
    }
    return {
      title: defaultItem.title,
      subtitle: defaultItem.subtitle,
      review: null,
      rating: null,
    };
  });

  return (
    <>
      <div className={Style.Testimonials}>
        {/* Auto-sliding background using the same travel images */}
        <BgSlider />

        <h2 className={Style.aboutTitle}>
          JOURNEY <span>MEMORIES</span>
        </h2>

        <div className={Style.galleryWrapper}>
          <div className={Style.hexGrid}>
            {displayData.map((item, index) => (
              <HexFeedbackCard key={index} item={item} imgIndex={index} />
            ))}
          </div>
        </div>
      </div>

      <div className={Style.GoogleReviewsContainer}>
        <GoogleReviews />
      </div>
    </>
  );
};

export default Testimonials;
