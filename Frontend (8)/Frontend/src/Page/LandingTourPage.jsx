import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import Style from "../Style/LandingTourPage.module.scss";
import InsiderDealsForm from "./InsiderDealsForm.jsx";
import GoogleReviews from "../HomeCompontent/GoogleReviews.jsx";
import TrendingTripsSection from "../HomeCompontent/TrendingTripsSection.jsx";
import { useLandingPageData } from "../hooks/useLandingPageData";
import { getImgUrl } from "../utils/getImgUrl";
import Loader from "../HomeCompontent/Loader.jsx";
import { motion } from "framer-motion";
import AutoLeadPopup from "../HomeCompontent/AutoLeadPopup.jsx";

const defaultAboutUs = {
  heading: "About TrippyJiffy",
  description: "Trusted travel planners delivering seamless, customized journeys.",
  points: [
    "Expertly crafted itineraries for every traveler.",
    "Local support and responsive trip management.",
    "Transparent pricing with curated stays.",
  ],
};

const LandingTourPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [activeCert, setActiveCert] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const modalTimer = useRef(null);
  const baseURL = import.meta.env.VITE_API_BASE_URL || "";

  // Fetch landing page data from API using the hook
  const { data: apiPageData, loading: pageLoading, error: pageError } = useLandingPageData(slug || "golden-triangle");

  const slugify = (text) =>
    (text || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

  const slugifyTitle = (text) =>
    (text || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

  const formatImageURL = (img) => {
    return getImgUrl(img);
  };

  useEffect(() => {
    if (apiPageData) {
      setPage(apiPageData);
      setRecommended(apiPageData?.recommendedTours || []);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [apiPageData]);

  useEffect(() => {
    const fetchRecommended = async () => {
      if (!page || !baseURL) return;
      try {
        const [toursRes, statesRes] = await Promise.all([
          axios.get(`${baseURL}/api/tours/get`),
          axios.get(`${baseURL}/api/state/get`).catch(() => ({ data: [] })),
        ]);

        const tours = Array.isArray(toursRes.data) ? toursRes.data : [];
        const states = Array.isArray(statesRes.data) ? statesRes.data : [];

        let filtered = [];

        // Priority 1: anchor tour id (e.g., Golden Triangle -> 56)
        let anchorState = null;

        if (page.recommendTourId) {
          const anchorTour = tours.find(
            (t) => Number(t.id) === Number(page.recommendTourId)
          );
          anchorState = states.find(
            (s) => Number(s.id) === Number(anchorTour?.state_id)
          );
          if (anchorState) {
            filtered = tours.filter(
              (t) => Number(t.state_id) === Number(anchorState.id)
            );
          }
          if (!filtered.length && anchorTour) filtered = [anchorTour];
        }

        // Priority 2: match state by slug/title when no anchor id
        if (!anchorState && !filtered.length && states.length) {
          const targetSlug = slugify(page.slug || page.title);

          const matchedState =
            states.find((s) => slugify(s.state_name) === targetSlug) ||
            states.find((s) => slugify(s.state_name).includes(targetSlug)) ||
            states.find((s) => slugify(s.region_name || "").includes(targetSlug));

          if (matchedState) {
            anchorState = matchedState;
            filtered = tours.filter(
              (t) => Number(t.state_id) === Number(matchedState.id)
            );
          }
        }

        // Priority 3: use category of anchor state to show more tours
        if (anchorState && states.length && filtered.length <= 1) {
          const categoryStates = states
            .filter((s) => Number(s.category_id) === Number(anchorState.category_id))
            .map((s) => Number(s.id));

          const categoryTours = tours.filter((t) =>
            categoryStates.includes(Number(t.state_id))
          );

          if (categoryTours.length) filtered = categoryTours;
        }

        const seen = new Set();
        const fallbackStatic = page.recommendedTours || [];

        const mapped = filtered
          .filter((t) => {
            const id = Number(t.id);
            if (seen.has(id)) return false;
            seen.add(id);
            return true;
          })
          .map((t) => {
            const img =
              t.image ||
              t.image_url ||
              page.hero?.image ||
              page.intro?.image ||
              null;
            const apiTitle = t.tour_name || t.title || "Tour";

            let imageUrl = formatImageURL(img);
            let linkUrl = `/tour/${t.id}`;

            if (!imageUrl && fallbackStatic.length) {
              const key = slugifyTitle(apiTitle);
              const match = fallbackStatic.find(
                (s) => slugifyTitle(s.title) === key
              );
              if (match) {
                imageUrl = formatImageURL(match.image) || imageUrl;
                linkUrl = match.link || linkUrl;
              }
            }

            return {
              title: apiTitle,
              image: imageUrl || "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop",
              link: linkUrl,
            };
          });

        const enriched = mapped.map((item, idx) => {
          if (item.image && !item.image.includes("placehold.co")) return item;
          const staticImg = fallbackStatic[idx % (fallbackStatic.length || 1)]?.image;
          const finalImg = formatImageURL(staticImg) || item.image;
          return { ...item, image: finalImg };
        });

        if (mapped.length) {
          setRecommended(mapped);
        } else if (page?.recommendedTours?.length) {
          setRecommended(page.recommendedTours);
        }
      } catch (err) {
        console.error("Error fetching recommended tours:", err);
      }
    };

    fetchRecommended();
  }, [page?.recommendTourId, page?.slug, page?.title, baseURL]);

  if (pageLoading || !page) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', background: '#fff' }}>
       <Loader text={`Welcome to ${slug?.replace(/-/g, ' ')}...`} />
    </div>
  );

  const callNow = (phone) => {
    if (!phone) return;
    const tel = phone.replace(/\s+/g, "");
    window.location.href = `tel:${tel}`;
  };

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const aboutUs = page.aboutUs || defaultAboutUs;

  return (
    <div
      className={Style.page}
      style={{
        "--primary": page.theme?.primary,
        "--secondary": page.theme?.secondary,
        "--accent": page.theme?.accent,
      }}
    >
      <Helmet>
        <title>{page.seo?.title || page.title}</title>
        <meta name="description" content={page.seo?.description || page.hero?.subtitle} />
      </Helmet>

      {/* NEW AUTO LEAD POPUP */}
      <AutoLeadPopup delay={4000} context={`Landing Page: ${page.title}`} />

      <section className={Style.hero}>
        <div className={Style.heroSwiper}>
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            loop
          >
            {page.hero.slides.map((img, index) => (
              <SwiperSlide key={index}>
                <div
                  className={Style.heroSlide}
                  style={{ backgroundImage: `url(${formatImageURL(img)})` }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className={Style.heroOverlay} />
        <div className={Style.heroContent}>
          <div className={Style.heroText}>
            <span className={Style.heroBadge}>{page.hero.badge}</span>
            <h1>{page.hero.title}</h1>
            <p>{page.hero.subtitle}</p>

            <div className={Style.heroActions}>
              <button
                type="button"
                className={Style.primaryBtn}
                onClick={() => scrollToId("contact")}
              >
                {page.hero.ctaPrimary}
              </button>
              <button
                type="button"
                className={Style.secondaryBtn}
                onClick={() => callNow(page.hero.ctaPhone)}
              >
                {page.hero.ctaSecondary}
              </button>
            </div>

            <div className={Style.heroStats}>
              {page.stats.map((stat, i) => (
                <div key={i} className={Style.heroStatItem}>
                  <div className={Style.heroStatValue}>{stat.value}</div>
                  <div className={Style.heroStatLabel}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className={Style.heroFormWrap}
          >
            <InsiderDealsForm context={`Landing Tour Hero: ${page?.title || ""}`} />
          </motion.div>
        </div>
      </section>

      <section id="recommended" className={Style.sectionAlt}>
        <div className={Style.sectionHead}>
          <h2>Recommended Tour</h2>
          <p>Handpicked combinations guests love for this circuit.</p>
        </div>
        <div className={Style.recommendSwiper}>
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 2800, disableOnInteraction: false }}
            spaceBetween={18}
            slidesPerView={1.2}
            breakpoints={{
              480: { slidesPerView: 1.5 },
              640: { slidesPerView: 2 },
              900: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
            }}
            loop={recommended.length > 4}
            speed={700}
          >
            {recommended?.map((item, i) => (
              <SwiperSlide key={i}>
                <motion.a 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  href={item.link || "#"} 
                  className={Style.card}
                  style={{ "--bg-image": `url("${item.image}")` }}
                >
                  <div className={Style.content}>
                    <h2 className={Style.title}>{item.title}</h2>
                    <p className={Style.copy}>Handpicked circuit with premium stays and local experts.</p>
                    <div className={Style.btn}>Explore Now</div>
                  </div>
                </motion.a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <section id="about" className={Style.section}>
        <div className={Style.sectionHead}>
          <h2>About This Journey</h2>
          <p>{page.about.description}</p>
        </div>
        <div className={Style.aboutGrid}>
          <div className={Style.aboutCardLarge}>
            <h3>{page.about.heading}</h3>
            <p>{page.about.description}</p>
            <ul>
              {page.about.points.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>

          <div className={Style.aboutCardLarge}>
            <h3>{aboutUs?.heading || "About TrippyJiffy"}</h3>
            <p>{aboutUs?.description || "Trusted travel planners delivering seamless, customized journeys."}</p>
            <ul>
              {(aboutUs?.points || []).slice(0, 3).map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="highlights" className={Style.sectionAlt}>
        <div className={Style.sectionHead}>
          <h2>Tour Highlights</h2>
          <p>Signature experiences curated to elevate your journey.</p>
        </div>
        <div className={Style.highlightsGrid}>
          {page.highlights.map((item, i) => (
            <article key={i} className={Style.highlightCard}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="trending" className={Style.sectionAlt}>
        <TrendingTripsSection title="Trending Trips" />
      </section>

      <section id="intro" className={Style.section}>
        <div className={Style.introGrid}>
          <div className={Style.introText}>
            <div className={Style.introEyebrow}>{page.intro.eyebrow}</div>
            <h2>{page.intro.heading}</h2>
            <p>{page.intro.description}</p>
            <button
              type="button"
              className={Style.introCta}
              onClick={() => scrollToId("contact")}
            >
              {page.intro.cta}
            </button>
          </div>
          <div className={Style.introImageWrap}>
            <img src={formatImageURL(page.intro.image)} alt={page.intro.heading} loading="lazy" />
          </div>
        </div>
      </section>

      <section id="why-us" className={Style.sectionAlt}>
        <div className={Style.whyLayout}>
          <div className={Style.whyImages}>
            <div className={Style.whyImageTall}>
              <img src={formatImageURL(page.whyIntro.images[0])} alt="Why choose us" />
            </div>
            <div className={Style.whyImageStack}>
              <img src={formatImageURL(page.whyIntro.images[1])} alt="Travel stay" />
              <img src={formatImageURL(page.whyIntro.images[2])} alt="Travel experience" />
            </div>
          </div>

          <div className={Style.whyContent}>
            <div className={Style.whyEyebrow}>{page.whyIntro.eyebrow}</div>
            <h2>{page.whyIntro.heading}</h2>
            <p className={Style.whyLead}>{page.whyIntro.description}</p>

            <div className={Style.whyList}>
              {page.whyChooseUs.map((item, i) => (
                <div key={i} className={Style.whyItem}>
                  <div className={Style.whyIcon}>✓</div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className={Style.section}>
        <div className={Style.sectionHead}>
          <h2>Testimonials</h2>
          <p>What our guests are saying about their trips.</p>
        </div>
        <div className={Style.googleReviewsWrap}>
          <GoogleReviews className={Style.googleReviewsAuto} />
        </div>
      </section>

      <section id="certificates" className={Style.section}>
        <div className={Style.sectionHead}>
          <h2>Certificates</h2>
          <p>Government-recognized registrations for trusted travel services.</p>
        </div>
        <div className={Style.certGrid}>
          {page.certificates.map((cert, i) => (
            <motion.figure 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              key={i} 
              className={Style.certCard}
            >
              <button
                type="button"
                className={Style.certButton}
                onClick={() => setActiveCert(cert)}
                aria-label="Open certificate"
              >
                <img src={formatImageURL(cert.src)} alt={cert.alt} loading="lazy" />
              </button>
            </motion.figure>
          ))}
        </div>
      </section>

      {activeCert && (
        <div
          className={Style.lightboxOverlay}
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveCert(null)}
        >
          <div
            className={Style.lightboxContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={Style.lightboxClose}
              onClick={() => setActiveCert(null)}
              aria-label="Close"
            >
              ×
            </button>
            <img src={formatImageURL(activeCert.src)} alt={activeCert.alt} />
          </div>
        </div>
      )}

      {showModal && (
        <div
          className={Style.modalOverlay}
          role="dialog"
          aria-modal="true"
          onClick={() => setShowModal(false)}
        >
          <div
            className={Style.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={Style.modalClose}
              aria-label="Close"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <div className={Style.modalFormWrap}>
              <InsiderDealsForm context={`Landing Tour Modal: ${page?.title || ""}`} />
            </div>
          </div>
        </div>
      )}

      <section id="contact" className={`${Style.sectionAlt} ${Style.contactSection}`}>
        <div className={Style.sectionHead}>
          <h2>Contact Us</h2>
          <p>Tell us your preferred dates and we will craft a tailored itinerary.</p>
        </div>
        <div className={Style.contactGrid}>
          <div className={Style.contactInfo}>
            <div className={Style.infoCard}>
              <h3>Call Us</h3>
              {page.contact.phones.map((phone, i) => (
                <button
                  key={i}
                  type="button"
                  className={Style.contactLink}
                  onClick={() => callNow(phone)}
                >
                  {phone}
                </button>
              ))}
            </div>
            <div className={Style.infoCard}>
              <h3>Email</h3>
              <a className={Style.contactLink} href={`mailto:${page.contact.email}`}>
                {page.contact.email}
              </a>
            </div>
            <div className={Style.infoCard}>
              <h3>Office</h3>
              <p>{page.contact.address}</p>
            </div>
            <div className={Style.infoCard}>
              <h3>Need immediate help?</h3>
              <button
                type="button"
                className={Style.primaryBtn}
                onClick={() => callNow(page.hero.ctaPhone)}
              >
                Call Now
              </button>
            </div>
          </div>
          <div className={Style.contactForm}>
            <InsiderDealsForm context={`Landing Tour Contact: ${page?.title || ""}`} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingTourPage;
