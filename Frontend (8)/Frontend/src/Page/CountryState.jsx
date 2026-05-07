import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Style from "../Style/CountryState.module.scss";
import InsiderDealsForm from "../Page/InsiderDealsForm.jsx";
import { Helmet } from "react-helmet-async";
import { getImgUrl } from "../utils/getImgUrl";
import Loader from "../HomeCompontent/Loader.jsx";

const CountryState = () => {
  const { countryId, stateName } = useParams(); // ✅ ADDED stateName
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [states, setStates] = useState([]);
  const [tours, setTours] = useState([]);
  const baseURL = import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com";

  // Normalize image URLs
  const normalizeImages = useCallback(
    (images) => {
      if (!images) return [];
      let imgList = [];
      if (typeof images === "string") {
        try {
          imgList = JSON.parse(images);
        } catch {
          imgList = [images];
        }
      } else {
        imgList = Array.isArray(images) ? images : [images];
      }

      return imgList.flat(Infinity).map((img) => getImgUrl(img));
    },
    []
  );

  const safeParse = (data) => {
    try {
      if (!data) return null;
      if (typeof data === "string") {
        // try parse JSON first, otherwise return string wrapped in a block-like object
        try {
          return JSON.parse(data);
        } catch {
          // Return an EditorJS-like structure so renderSection can handle plain strings too
          return {
            blocks: [
              {
                type: "paragraph",
                data: { text: data },
              },
            ],
          };
        }
      }
      if (typeof data === "object") return data;
      return null;
    } catch {
      return null;
    }
  };

  // UPDATED: renderSection now shows the full text (no truncation).
  // It supports EditorJS blocks and plain strings stored as JSON or raw HTML/text.
  const renderSection = (label, fieldData) => {
    const parsed = safeParse(fieldData);
    if (!parsed?.blocks?.length) {
      return <p style={{ color: "gray" }}>⚠️ No {label} available</p>;
    }

    return (
      <div className={Style.SectionBox}>
        {parsed.blocks.map((block, i) => {
          if (block.type === "paragraph") {
            // Show full paragraph text. If it contains HTML, render it safely.
            const text = block.data?.text ?? "";
            // If the text contains HTML tags and you want to render HTML, use dangerouslySetInnerHTML.
            // BE CAREFUL: only do this if the data is trusted. Otherwise show plain text.
            const containsHtml = /<\/?[a-z][\s\S]*>/i.test(text);
            return containsHtml ? (
              <p key={i} dangerouslySetInnerHTML={{ __html: text }} />
            ) : (
              <p key={i}>{text}</p>
            );
          }

          // handle other block types if needed (e.g., header, list)
          if (block.type === "header") {
            const text = block.data?.text ?? "";
            return <h4 key={i}>{text}</h4>;
          }
          if (block.type === "list") {
            const items = block.data?.items || [];
            return (
              <ul key={i}>
                {items.map((it, idx) => (
                  <li key={idx}>{it}</li>
                ))}
              </ul>
            );
          }

          // default fallback: show JSON string of block
          return (
            <pre key={i} style={{ whiteSpace: "pre-wrap", fontSize: "13px" }}>
              {JSON.stringify(block, null, 2)}
            </pre>
          );
        })}
      </div>
    );
  };

  const fetchWithAlert = async (axiosFunc) => {
    try {
      const res = await axiosFunc();
      const data = res.data?.data || res.data || [];
      return Array.isArray(data) ? data : [];
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      alert(msg);
      console.error(err);
      return [];
    }
  };

  // Fetch Country
  useEffect(() => {
    const fetchCountry = async () => {
      const countries = await fetchWithAlert(() =>
        axios.get(`${baseURL}/api/asia/get`)
      );
      const found = countries.find(
        (item) =>
          item.country_name?.toLowerCase().replace(/\s+/g, "-") ===
          countryId.toLowerCase()
      );
      if (found) setSelectedCountry(found);
      else setError("Country not found");
    };
    fetchCountry();
  }, [countryId, baseURL]);

  // Fetch States
  useEffect(() => {
    if (!selectedCountry?.id) return;
    setLoading(true);
    const fetchStates = async () => {
      const statesData = await fetchWithAlert(() =>
        axios.get(`${baseURL}/api/asiaState/get`)
      );
      const filteredStates = statesData.filter(
        (state) => String(state.asia_id) === String(selectedCountry.id)
      );
      setStates(filteredStates);
      setLoading(false);
    };
    fetchStates();
  }, [selectedCountry, baseURL]);

  // Fetch Tours
  useEffect(() => {
    if (!selectedCountry?.id) return;
    const fetchTours = async () => {
      const toursData = await fetchWithAlert(() =>
        axios.get(`${baseURL}/api/country/get`)
      );
      setTours(Array.isArray(toursData) ? toursData : []);
    };
    fetchTours();
  }, [selectedCountry, baseURL]);

  const toursByState = useMemo(() => {
    if (!states.length || !tours.length) return {};
    const map = {};
    states.forEach((state) => {
      map[state.id] = (tours || []).filter(
        (tour) => String(tour.asiastate_id) === String(state.id)
      );
    });
    return map;
  }, [states, tours]);

  if (error) return <p>{error}</p>;

  const getCountryImage = () => {
    if (!selectedCountry)
      return "https://placehold.co/1200x400?text=No+Image";

    const imgs = normalizeImages(selectedCountry.images);
    if (imgs.length > 0) return imgs[0];

    return "https://placehold.co/1200x400?text=No+Image";
  };

  return (
    <div className={Style.CountryState}>
      {/* ****************************
         ⭐ DYNAMIC HELMET UPDATED ⭐
         — Shows State Name if available
      **************************** */}
     <Helmet>
  <title>
    {selectedCountry
      ? stateName
        ? `${selectedCountry.country_name} – ${stateName.replace(
            /-/g,
            " "
          )} Vacation Packages | Best Tours`
        : `${selectedCountry.country_name} Tour Sites & Vacation Packages`
      : "Country Details & Vacation Packages | TrippyJiffy"}
  </title>

  <meta
    name="description"
    content={
      selectedCountry
        ? stateName
          ? `Explore ${stateName.replace(/-/g, " ")} in ${selectedCountry.country_name}. View popular tours, attractions, and family vacation packages at TrippyJiffy.`
          : `Explore ${selectedCountry.country_name} tour sites, popular travelling packages, and enquiry options at TrippyJiffy.`
        : "Explore international destinations, travel attractions, and family vacation packages with TrippyJiffy."
    }
  />

  {/* ✅ CANONICAL URL (dynamic) */}
  <link
    rel="canonical"
    href={window.location.href}
  />
</Helmet>


      {/* ==================== TOP IMAGE ==================== */}
      <div className={Style.CountryStateImage}>
        <img
          src={(() => {
            let img = getCountryImage();
            if (typeof img === "string") {
              img = img.trim();
              if (img.startsWith("[")) {
                try {
                  const parsed = JSON.parse(img);
                  if (Array.isArray(parsed) && parsed.length > 0) img = parsed[0];
                } catch (e) {}
              } else if (img.includes(",")) {
                img = img.split(",")[0].trim();
              }
            }
            return img || "https://placehold.co/1200x500?text=Country+Banner";
          })()}
          alt={selectedCountry?.country_name || "Country"}
          onError={(e) => { e.currentTarget.src = "https://placehold.co/1200x500?text=Country+Banner"; }}
        />
        <div className={Style.StateText}>
          <div 
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(12px)",
              padding: "40px 60px",
              borderRadius: "24px",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              maxWidth: "900px",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}
          >
            <h1>{selectedCountry?.country_name?.replace(/-/g, " ")}</h1>
            <span style={{ 
              fontSize: "clamp(12px, 2vw, 18px)", 
              letterSpacing: "8px", 
              fontWeight: "400",
              opacity: "0.9",
              textTransform: "uppercase"
            }}>
              Curated Travel Experience
            </span>
          </div>
        </div>
      </div>

      {/* ==================== CONTENT ==================== */}
      <div className={Style.wrapper}>
        <div className={Style.CountryStateFlex}>
          {/* LEFT SIDE */}
          <div className={Style.CountryStateFlexLeft}>
            <div className={Style.StateFlexLeftBox}>
              {loading ? (
                <div style={{ padding: '60px 0' }}><Loader text="Discovering regions..." /></div>
              ) : states.length > 0 ? (
                states.map((state) => (
                  <div key={state.id} className={Style.StateBlockFlex}>
                    {/* LEFT: IMAGE */}
                    <div className={Style.StateBlockLeft}>
                      {(() => {
                        const imgs = normalizeImages(state.state_image);
                        return imgs.length > 0 ? (
                          <img
                            src={imgs[0]}
                            alt={state.state_name}
                            className={Style.TourImage}
                            onError={(e) => { e.currentTarget.src = "https://placehold.co/300x200?text=No+Image"; }}
                          />
                        ) : (
                          <img
                            src="https://placehold.co/300x200?text=No+Image"
                            alt="No State Image"
                            className={Style.TourImage}
                          />
                        );
                      })()}
                    </div>

                    {/* RIGHT: DETAILS */}
                    <div className={Style.StateBlockRight}>
                      <h3>{state.state_name}</h3>

                      {Array.isArray(toursByState[state.id]) &&
                      toursByState[state.id].length > 0 ? (
                        toursByState[state.id].map((tour) => (
                          <div key={tour.id} className={Style.TourBox}>
                            {tour.description ? (
                              renderSection("Description", tour.description)
                            ) : (
                              <p style={{ color: "gray", fontSize: "14px" }}>
                                ⚠️ No Description available
                              </p>
                            )}

                            <Link
                              to={`/country/${countryId}/${state.id}/${state.state_name.replace(
                                /\s+/g,
                                "-"
                              )}`}
                            >
                              View Details
                            </Link>
                          </div>
                        ))
                      ) : (
                        <p style={{ color: "gray", fontSize: "14px" }}>
                          No tours available
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p>No states available.</p>
              )}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className={Style.CountryStateFlexRight}>
            <InsiderDealsForm context={`Overseas Country Sidebar: ${selectedCountry?.country_name}`} />
          </div>
        </div>
      </div>

      {/* ENQUIRY MODAL */}
      {showEnquiry && (
        <div className={Style.modalOverlay}>
          <div className={Style.modalContent}>
            <button
              className={Style.closeBtn}
              onClick={() => setShowEnquiry(false)}
            >
              X
            </button>
            <InsiderDealsForm context={`Overseas Country Modal: ${selectedCountry?.country_name}`} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryState;
