
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import Style from "../Style/UpcomingDetails.module.scss";
import InsiderDealsForm from "./InsiderDealsForm";
import { getImgUrl } from "../utils/getImgUrl";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import { Heart } from "lucide-react";
import { toast } from "sonner";

const UpcomingDetails = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMobileForm, setShowMobileForm] = useState(false);
  const baseURL = import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com";
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleAddToWishlist = async () => {
    if (!token) {
      toast.error("Please login to add to wishlist");
      navigate("/login");
      return;
    }
    try {
      const res = await axios.post(`${baseURL}/api/user-features/wishlist`, {
        item_id: trip.id,
        item_type: "upcoming",
        title: trip.title || "Upcoming Trip",
        image: getImgUrl(trip.banner_image || (Array.isArray(trip.images) && trip.images[0])) || "https://placehold.co/600x400",
        url: window.location.pathname
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) toast.success("Added to wishlist!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to wishlist");
    }
  };



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
          <div className={Style.actionButtons}>
            <button onClick={handleAddToWishlist} className={Style.actionBtn}><Heart size={18} /> Wishlist</button>
          </div>
        </div>
      </section>

      <div className={Style.mainGrid}>
        <div className={Style.contentArea}>
          {/* About */}
          <section className={Style.glassCard}>
            <h2>Overview</h2>
            <p className={Style.description}>{trip.description}</p>
          </section>

          {/* Gallery Highlights - 5 Images Grid */}
          {images.length > 0 && (
            <section className={Style.glassCard}>
              <div className={Style.galleryHeader}>
                <h2>Gallery <span>Highlights</span></h2>
                <p>Capturing the essence of your next adventure.</p>
              </div>
              <div className={Style.highlightsGrid}>
                {images.slice(0, 5).map((img, idx) => (
                  <div key={idx} className={`${Style.galleryItem} ${Style[`item${idx + 1}`]}`}>
                    <img src={getImgUrl(img)} alt={`Highlight ${idx + 1}`} loading="lazy" />
                  </div>
                ))}
              </div>
              
              {/* Swipeable Carousel for all images on mobile */}
              <div className={Style.mobileCarousel}>
                <Swiper
                  modules={[Autoplay, Navigation]} 
                  spaceBetween={10} 
                  slidesPerView={1.2}
                  autoplay={{ delay: 3000 }} 
                  grabCursor={true}
                  loop={true}
                >
                  {images.map((img, idx) => (
                    <SwiperSlide key={idx}>
                      <div className={Style.carouselCard}>
                        <img src={getImgUrl(img)} alt={`Slide ${idx + 1}`} />
                      </div>
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
      </div>


      {/* Mobile Form Drawer */}
      {showMobileForm && (
        <div className={Style.mobileFormOverlay} onClick={() => setShowMobileForm(false)}>
          <div className={Style.formContent} onClick={(e) => e.stopPropagation()}>
            <button className={Style.close} onClick={() => setShowMobileForm(false)}>&times;</button>
            <InsiderDealsForm context={`Mobile Drawer: ${trip.title}`} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingDetails;
