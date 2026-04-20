import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Style from "../Style/Destinations.module.scss";
import ContactUsForm from "./ContactUsForm";
import { getImgUrl } from "../utils/getImgUrl";

const baseURL = import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com";

const TrendingTripsSection = ({ title = "Trending Trips", limit = 8, featuredTrips }) => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalItem, setModalItem] = useState(null);

  const slugify = (text) =>
    text
      ? text
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
      : "";

  const getValidImageUrl = (img, image_url) => {
    return getImgUrl(image_url || img);
  };

  useEffect(() => {
    const loadFeatured = () => {
      if (!featuredTrips || featuredTrips.length === 0) return false;
      const mapped = featuredTrips.map((item, index) => ({
        id: item.id || `featured-${index}`,
        state_name: item.slug || item.title || "", // used for slugify
        title: item.title,
        duration: item.duration,
        price: item.price,
        images: item.image ? [item.image] : [],
        detailPath: item.detailPath,
      }));
      setTours(mapped);
      setLoading(false);
      return true;
    };

    if (loadFeatured()) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/state/get`);
        const stateArray = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
          ? res.data.data
          : [];

        const visibleTours = stateArray
          .filter((s) => s.is_visible === 1)
          .slice(0, limit)
          .map((item) => {
            const imgUrl = getValidImageUrl(item.image, item.image_url);
            return {
              id: item.id,
              state_name: item.state_name || "Unknown",
              title: item.state_name || "Unknown",
              duration: item.duration || item.days || "Customizable",
              price: item.price || item.starting_price || "On Request",
              images: imgUrl ? [imgUrl] : [],
              detailPath: `/india-tours/${item.id}/${slugify(item.state_name)}`,
            };
          });

        setTours(visibleTours);
      } catch (error) {
        console.error("Trending trips fetch error:", error);
        setTours([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [featuredTrips, limit]);

  const slides = useMemo(
    () =>
      loading
        ? [...Array(4)].map((_, i) => ({ id: `skeleton-${i}` }))
        : tours,
    [loading, tours]
  );

  return (
    <div className={Style.destinationsContainer}>
      <div className={Style.wrapper}>
        <div className={Style.DestinationCardBlock}>
          <h2>
            {title.split(" ")[0]} <span>{title.split(" ").slice(1).join(" ")}</span>
          </h2>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={30}
          slidesPerView={4}
          navigation
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          speed={800}
          loop={slides.length > 4}
          breakpoints={{
            320: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1400: { slidesPerView: 4 },
          }}
        >
          {slides.map((item) => {
            const infoText = loading
              ? ""
              : [item.duration, item.price]
                  .filter((text) => text && !/custom/i.test(text) && !/request/i.test(text))
                  .join(" • ");

            const detailsPath = item.detailPath || `/india-tours/${item.id}/${slugify(item.state_name)}`;

            return (
              <SwiperSlide key={item.id}>
                {loading ? (
                  <div className={Style.skeletonCard}></div>
                ) : (
                  <Link
                    to={detailsPath}
                    className={Style.card}
                    style={{ "--bg-image": `url("${item.images?.[0] || ""}")` }}
                  >
                    <div className={Style.content}>
                      <h2 className={Style.title}>{item.title}</h2>
                      <p className={Style.copy}>
                        {infoText || "Explore the best experience with Trippy Jiffy premium tours."}
                      </p>
                      <div className={Style.btn}>View Experience</div>
                    </div>
                  </Link>
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {modalItem && (
        <div className={Style.modalOverlay} onClick={() => setModalItem(null)}>
          <div className={Style.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={Style.modalClose}
              onClick={() => setModalItem(null)}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className={Style.modalTitle}>Get a quote for {modalItem.title}</h3>
            <ContactUsForm title="Contact Us" />
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendingTripsSection;
