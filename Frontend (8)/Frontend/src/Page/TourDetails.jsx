import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Loader from "../HomeCompontent/Loader.jsx";
import Style from "../Style/TourDetails.module.scss";
import InsiderDealsForm from "./InsiderDealsForm";
import { renderBlocks } from "../utils/utils";
import { getImgUrl } from "../utils/getImgUrl";
import {
  FiInfo,
  FiCheckCircle,
  FiNavigation,
  FiXCircle,
  FiActivity,
} from "react-icons/fi";
import { Link as ScrollLink } from "react-scroll";
import Brief from "../Img/Untitled.png";
// ----------------- HELMET -----------------
import { Helmet } from "react-helmet-async";
import SEO from "../utils/SEO";

const TourDetails = () => {
  const { tourId } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [faqs, setFaqs] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const [states, setStates] = useState([]);
  const [allTours, setAllTours] = useState([]);
  const baseURL = import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com";

  const toggleFaq = (id) => setOpenFaq(openFaq === id ? null : id);

  const formatImageURL = (img) => {
    return getImgUrl(img) || "https://via.placeholder.com/600x400?text=No+Image";
  };

  // Helper: extract first text block for meta description (safe)
  const extractMetaDescription = (jsonString) => {
    try {
      if (!jsonString) return "";
      const parsed =
        typeof jsonString === "string" ? JSON.parse(jsonString) : jsonString;
      if (!parsed?.blocks?.length) return "";
      const firstParagraph = parsed.blocks.find((b) => b.type === "paragraph");
      const text =
        firstParagraph?.data?.text || parsed.blocks[0]?.data?.text || "";
      // strip html tags and truncate to 150 chars
      const stripped = text
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim();
      return stripped.length > 150 ? stripped.slice(0, 147) + "..." : stripped;
    } catch {
      return "";
    }
  };

  // 🟢 Fetch Tour
  useEffect(() => {
    const fetchTourData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${baseURL}/api/tours/get`);
        const tours = res.data || [];
        const foundTour = tours.find((t) => Number(t.id) === Number(tourId));
        setTour(foundTour || null);
      } catch (err) {
        console.error("Error fetching tours:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTourData();
  }, [tourId, baseURL]);

  // 🟢 Fetch FAQs
  useEffect(() => {
    if (!tour) return;
    const fetchFaqs = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/faq/get`);
        const tourFaqs = Array.isArray(res.data)
          ? res.data.filter((faq) => Number(faq.tour_id) === Number(tour.id))
          : [];

        const sortedFaqs = tourFaqs
          .map((faq) => ({
            ...faq,
            lowerQ: (faq.question || "").toLowerCase(),
          }))
          .sort((a, b) => {
            const createdDiff =
              new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
            if (createdDiff !== 0) return createdDiff;
            const priority = (q) =>
              q.includes("asia") ? 1 : q.includes("note") ? 3 : 2;
            return priority(a.lowerQ) - priority(b.lowerQ);
          });

        setFaqs(sortedFaqs);
      } catch (err) {
        console.error("Error fetching FAQs:", err);
      }
    };
    fetchFaqs();
  }, [tour, baseURL]);

  // 🟢 Fetch States
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/state/get`);
        setStates(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching states:", err);
      }
    };
    fetchStates();
  }, [baseURL]);

  // 🟢 Fetch All Tours
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/tours/get`);
        setAllTours(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTours();
  }, [baseURL]);

  const safeRender = (jsonString) => {
    if (!jsonString) return null;

    // Helper to clean common encoding artifacts (Mojibake)
    const cleanContent = (str) => {
      if (typeof str !== 'string') return str;
      return str
        .replace(/â—¼/g, "●")
        .replace(/âœ/g, "✔")
        .replace(/â€“/g, "—")
        .replace(/â€™/g, "'")
        .replace(/â\x97\xBC/g, "●") // Hex variation
        .replace(/Â/g, ""); // Remove hidden A characters
    };

    const renderFinal = (content) => {
      const cleaned = cleanContent(content);
      if (typeof cleaned === "string" && /<[a-z][\s\S]*>/i.test(cleaned)) {
        return <span dangerouslySetInnerHTML={{ __html: cleaned }} />;
      }
      return cleaned;
    };

    try {
      // 1. If it's already an object
      if (typeof jsonString === "object") {
        if (jsonString.blocks) return renderBlocks(jsonString);
        return renderFinal(JSON.stringify(jsonString));
      }

      // 2. Try parsing as JSON
      const parsed = JSON.parse(jsonString);

      // If parsed is an EditorJS object
      if (parsed && typeof parsed === "object" && parsed.blocks) {
        return renderBlocks(parsed);
      }

      // If parsed is a string (even if it was a JSON string)
      return renderFinal(String(parsed));
    } catch {
      // 3. Fallback for raw strings
      return renderFinal(jsonString);
    }
  };

  const safeTimelineRender = (jsonString) => {
    if (!jsonString) return null;
    try {
      const parsed =
        typeof jsonString === "string" ? JSON.parse(jsonString) : jsonString;
      if (!parsed.blocks || !parsed.blocks.length) return null;
      return parsed.blocks.map((block, index) => (
        <div key={index} className={Style.timelineItem}>
          <div className={Style.timelineLeft}>
            <span className={Style.day}>Day {index + 1}</span>
            <span className={Style.circle}></span>
          </div>
          <div className={Style.timelineContent}>
            <p dangerouslySetInnerHTML={{ __html: block.data.text }} />
          </div>
        </div>
      ));
    } catch {
      return null;
    }
  };

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', background: '#fff' }}>
      <Loader text="Generating itinerary details..." />
    </div>
  );
  if (!tour) return <p>Tour not found.</p>;

  let relatedStates = [];
  const tourState = states.find((s) => Number(s.id) === Number(tour.state_id));

  if (tourState) {
    const categoryId = tourState.category_id;
    relatedStates = states.filter((s) => s.category_id === categoryId);
  }

  const popularStates = relatedStates.filter(
    (s) => Number(s.id) !== Number(tour.state_id)
  );

  // Dynamic meta values
  const metaTitle = tour.tour_name
    ? `${tour.tour_name} — ${tourState?.state_name || "TrippyJiffy"}`
    : `${tourState?.state_name || "Tour Details"} — TrippyJiffy`;

  const metaDescription =
    extractMetaDescription(tour.description) ||
    `Explore ${tourState?.state_name || "this destination"
    } tour with TrippyJiffy.`;

  return (
    <div className={Style.TourDetails}>
      <SEO
        title={metaTitle}
        description={metaDescription}
        keywords={`${tourState?.state_name || ""}, tour packages, travel guide, ${tour.tour_name || ""}, trippyjiffy tours`}
        ogImage={tour.image ? formatImageURL(tour.image) : formatImageURL(tourState?.image)}
        canonicalUrl={window.location.href}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "TouristTrip",
          "name": tour.tour_name || tourState?.state_name,
          "description": metaDescription,
          "touristType": "Sightseeing",
          "itinerary": {
            "@type": "ItemList",
            "numberOfItems": faqs.length,
            "itemListElement": faqs.map((faq, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "TouristAttraction",
                "name": faq.question
              }
            }))
          },
          "offers": {
            "@type": "Offer",
            "availability": "https://schema.org/InStock",
            "price": "Call for price",
            "priceCurrency": "INR"
          },
          "provider": {
            "@type": "Organization",
            "name": "TrippyJiffy",
            "url": "https://trippyjiffy.com"
          }
        }}
      />

      {/* 🖼 Header Image */}
      <div className={Style.TourImages}>
        <div key={tour.id} className={Style.TourItem}>
          <img
            src={
              tour.image
                ? formatImageURL(tour.image)
                : tourState?.image
                  ? formatImageURL(tourState.image)
                  : "https://via.placeholder.com/600x400?text=No+Image"
            }
            alt={tour.tour_name || tourState?.state_name || "Tour Image"}
          />
          <div className={Style.TourDetailsNAme}>
            <h1>
              {tour.tour_name
                ? `${tour.tour_name} - ${tourState?.state_name || "Unknown"}`
                : tourState?.state_name || "Unknown"}
            </h1>
          </div>
        </div>
      </div>

      {/* 🧭 Scroll Menu */}
      <div className={Style.TourDetailsInfoDisk}>
        <ul>
          <li>
            <ScrollLink to="tourInfo" smooth duration={500} offset={-130}>
              <FiInfo /> Tour Info
            </ScrollLink>
          </li>
          <li>
            <ScrollLink to="brief" smooth duration={500} offset={-130}>
              <FiNavigation /> Brief Itinerary
            </ScrollLink>
          </li>
          <li>
            <ScrollLink to="itinerary" smooth duration={500} offset={-130}>
              <FiNavigation /> Itinerary
            </ScrollLink>
          </li>
          <li>
            <ScrollLink to="inclusions" smooth duration={500} offset={-130}>
              <FiCheckCircle /> Inclusions
            </ScrollLink>
          </li>
          <li>
            <ScrollLink to="exclusions" smooth duration={500} offset={-130}>
              <FiXCircle /> Exclusions
            </ScrollLink>
          </li>
          <li>
            <ScrollLink to="supplemental" smooth duration={500} offset={-130}>
              <FiActivity /> Supplemental Activities
            </ScrollLink>
          </li>
        </ul>
      </div>

      {/* 🧱 Main Content */}
      <div className={Style.wrapper}>
        <div className={Style.TourDetailsFlex}>
          {/* Left Section */}
          <div className={Style.TourDetailsFlexLeft}>
            <div className={Style.TourDetailsPage}>
              {safeRender(tour.description) && (
                <div id="tourInfo" className={Style.Inclusions}>
                  <h3>Tour Info</h3>
                  {safeRender(tour.description)}
                </div>
              )}

              {safeTimelineRender(tour.routing) && (
                <div id="brief" className={Style.Route}>
                  <h3>Brief Itinerary</h3>
                  <img src={Brief} alt="brief" />
                  <div className={Style.timeline}>
                    {safeTimelineRender(tour.routing)}
                  </div>
                </div>
              )}

              {/* 🟢 FAQ Section (same as old version) */}
              {faqs.length > 0 && (
                <div id="itinerary" className={Style.Itinerary}>
                  <h3>Itinerary</h3>
                  <div className={Style.faqtimeline}>
                    <div className={Style.timelineline}></div>
                    <ul className={Style.faqlist}>
                      {(() => {
                        const noteFaqs = faqs.filter((faq) =>
                          faq.question?.toLowerCase().includes("note")
                        );
                        const otherFaqs = faqs.filter(
                          (faq) => !faq.question?.toLowerCase().includes("note")
                        );
                        const sortedOtherFaqs = otherFaqs.sort((a, b) => {
                          const dayA =
                            parseInt(a.question?.match(/day\s*(\d+)/i)?.[1]) ||
                            0;
                          const dayB =
                            parseInt(b.question?.match(/day\s*(\d+)/i)?.[1]) ||
                            0;
                          return dayA - dayB;
                        });
                        const sortedFaqs = [...sortedOtherFaqs, ...noteFaqs];

                        return sortedFaqs.map((faq) => {
                          const isOpen = openFaq === faq.id;
                          return (
                            <li
                              key={faq.id}
                              className={`${Style.faqitem} ${isOpen ? Style.open : ""
                                }`}
                            >
                              <span className={Style.pin}>
                                <span
                                  className={`${Style.pincircle} ${isOpen ? Style.active : ""
                                    }`}
                                >
                                  {isOpen ? (
                                    "📍"
                                  ) : (
                                    <span className={Style.pindot} />
                                  )}
                                </span>
                              </span>
                              <button
                                onClick={() => toggleFaq(faq.id)}
                                aria-expanded={isOpen}
                                aria-controls={`faq-answer-${faq.id}`}
                                className={Style.faqbutton}
                              >
                                <div className={Style.faqheader}>
                                  <h4>{safeRender(faq.question)}</h4>
                                  <span
                                    className={`${Style.arrow} ${isOpen ? Style.rotate : ""
                                      }`}
                                  >
                                    ▼
                                  </span>
                                </div>
                                <div
                                  id={`faq-answer-${faq.id}`}
                                  className={`${Style.faqanswer} ${isOpen ? Style.show : ""
                                    }`}
                                >
                                  {safeRender(faq.answer)}
                                </div>
                              </button>
                            </li>
                          );
                        });
                      })()}
                    </ul>
                  </div>
                </div>
              )}

              {safeRender(tour.inclusions) && (
                <div id="inclusions" className={Style.Inclusions}>
                  <h3>Inclusions</h3>
                  {safeRender(tour.inclusions)}
                </div>
              )}

              {safeRender(tour.exclusions) && (
                <div id="exclusions" className={Style.Exclusions}>
                  <h3>Exclusions</h3>
                  {safeRender(tour.exclusions)}
                </div>
              )}

              {safeRender(tour.supplemental_activities) && (
                <div id="supplemental" className={Style.Supplemental}>
                  <h3>Supplemental Activities</h3>
                  {safeRender(tour.supplemental_activities)}
                </div>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className={Style.TourDetailsFlexRight}>
              <InsiderDealsForm context={`India Tour Detail: ${tour?.tour_name || ""}`} />

            <div className={Style.TourDetailsFlexRightTours}>
              <h3>Recommended Tour</h3>
              {popularStates.length > 0 ? (
                <div className={Style.TourList1}>
                  {popularStates.map((s) => {
                    const firstTour = allTours.find(
                      (t) =>
                        Number(t.state_id) === Number(s.id) &&
                        Number(t.id) !== Number(tour.id)
                    );
                    const safeStateName = s.state_name || "Unknown State";
                    const safeImage = firstTour
                      ? formatImageURL(firstTour.image || s.image)
                      : formatImageURL(s.image);

                    const linkPath = firstTour ? `/tour/${firstTour.id}` : "#";

                    return (
                      <div key={`state-${s.id}`} className={Style.sidebarCardWrapper}>
                        <Link
                          to={linkPath}
                          className={Style.card}
                          style={{ "--bg-image": `url("${safeImage}")` }}
                        >
                          <div className={Style.content}>
                            <h2 className={Style.title}>{safeStateName}</h2>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p>No tours available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TourDetails);
