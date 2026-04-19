
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Style from "../Style/UpcomingDetails.module.scss";
import InsiderDealsForm from "./InsiderDealsForm";
import { getImgUrl } from "../utils/getImgUrl";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";

const UpcomingDetails = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMobileForm, setShowMobileForm] = useState(false);
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/upcoming-trips/get/${id}`);
        setTrip(res.data);
      } catch (err) {
        console.error("Error fetching trip:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
    window.scrollTo(0, 0);
  }, [id, baseURL]);

  if (loading) return <div className={Style.loader}>...</div>;
  if (!trip) return <div className={Style.error}>Trip not found</div>;

  const itinerary = Array.isArray(trip.details) 
    ? trip.details 
    : (typeof trip.details === 'string' ? JSON.parse(trip.details) : []);
  const images = Array.isArray(trip.images) ? trip.images : [];

  return (
    <div className={Style.container}>
      <Helmet>
        <title>{trip.title} | TrippyJiffy</title>
      </Helmet>

      {/* Hero */}
      <section className={Style.hero}>
        <div className={Style.heroBg}>
          <img src={getImgUrl(trip.banner_image || images[0])} alt={trip.title} />
          <div className={Style.overlay} />
        </div>
        <div className={Style.heroContent}>
          <span className={Style.tag}>Limited Batch</span>
          <h1>{trip.title}</h1>
        </div>
      </section>

      <div className={Style.mainGrid}>
        <div className={Style.contentArea}>
          {/* About */}
          <section className={Style.glassCard}>
            <h2>Overview</h2>
            <p className={Style.description}>{trip.description}</p>
          </section>

          {/* ADVANCE GALLERY - ONLY ONE FORM REMAINS IN SIDEBAR */}
          {images.length > 0 && (
            <section className={Style.glassCard}>
              <h2>Gallery <span>Highlights</span></h2>
              <div className={Style.tinyGrid}>
                {images.slice(0, 12).map((img, idx) => (
                  <div key={idx} className={Style.tinyPic}>
                    <img src={getImgUrl(img)} alt={idx} loading="lazy" />
                  </div>
                ))}
              </div>
              <div className={Style.miniSwiperWrap}>
                <Swiper 
                  modules={[Autoplay]} spaceBetween={5} slidesPerView={3.5} 
                  autoplay={{ delay: 2500 }} grabCursor={true}
                  breakpoints={{ 480: { slidesPerView: 5.5 } }}
                >
                  {images.map((img, idx) => (
                    <SwiperSlide key={idx}>
                      <div className={Style.microCard}><img src={getImgUrl(img)} alt={idx} /></div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </section>
          )}

          {/* Luxury Timeline Itinerary */}
          {itinerary.length > 0 && (
            <section className={Style.glassCard}>
              <h2>Full Itinerary</h2>
              <div className={Style.itinerary}>
                {itinerary.map((step, idx) => (
                  <div key={idx} className={Style.step}>
                    <span className={Style.stepNumber}>Day {idx + 1}</span>
                    <div className={Style.stepText}>{step}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar - THE ONLY FORM */}
        <aside className={Style.sidebar}>
          <div className={Style.stickyBox}>
            <InsiderDealsForm context={`Upcoming Checkout: ${trip.title}`} />
            {trip.link && (
              <a href={trip.link} target="_blank" rel="noopener noreferrer" className={Style.directLink}>
                Secure Prime Booking →
              </a>
            )}
          </div>
        </aside>
      </div>

      {/* Mobile Action Bar */}
      <div className={Style.mobileAction}>
        <a href={`https://wa.me/919870210896}`} className={Style.waBtn} target="_blank" rel="noopener noreferrer">
           <i className="fa-brands fa-whatsapp"></i>
        </a>
        <button className={Style.enquireBtn} onClick={() => setShowMobileForm(true)}>Enquire Now</button>
      </div>

      {/* Mobile Form Drawer */}
      <AnimatePresence>
        {showMobileForm && (
          <motion.div className={Style.mobileFormOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowMobileForm(false)}>
            <motion.div className={Style.formContent} initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} onClick={(e) => e.stopPropagation()}>
              <button className={Style.close} onClick={() => setShowMobileForm(false)}>&times;</button>
              <InsiderDealsForm context={`Mobile Drawer: ${trip.title}`} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UpcomingDetails;
