import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectFade } from "swiper/modules";
import axios from "axios";
import { useDebounce } from "../hooks/useDebounce";
import { Search, MapPin, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import Style from "../Style/Banner.module.scss";
// The first banner image is moved to public and preloaded in index.html for LCP optimization
import Banner2 from "../Img/Banner2 (2).webp";
import Banner3 from "../Img/Banner32.webp";

const Banner = () => {
  const [combinedData, setCombinedData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const debouncedSearch = useDebounce(searchTerm, 500);
  const baseURL = import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/combined-data`);
        setCombinedData(res.data || []);
      } catch (err) {
        console.error("Error fetching combined data:", err.message);
      }
    };
    fetchData();
  }, [baseURL]);

  useEffect(() => {
    if (debouncedSearch.trim() === "") {
      setFilteredResults([]);
      setShowDropdown(false);
      return;
    }

    const filtered = combinedData.filter((item) => {
      const name = item.state_name || item.country_name || "";
      return name.toLowerCase().includes(debouncedSearch.toLowerCase());
    });

    setFilteredResults(filtered);
    setShowDropdown(true);
  }, [debouncedSearch, combinedData]);

  const slugify = (text) => {
    if (!text) return "";
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const handleSelectItem = (item) => {
    const name = item.state_name || item.country_name;
    setSearchTerm(name);
    setShowDropdown(false);

    const slug = slugify(name);
    if (item.state_name) {
      navigate(`/india-tours/state/${item.id}/${slug}`);
    } else {
      navigate(`/asia-tours/${slug}`);
    }
  };

  return (
    <div className={Style.Banner}>
      <Swiper
        modules={[Navigation, Autoplay, EffectFade]}
        loop={true}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        speed={2000}
        className={Style.swiperContainer}
      >
        {["/Banner_LCP.webp", Banner2, Banner3].map((img, idx) => (
          <SwiperSlide key={idx}>
            <div className={Style.slide}>
              <img 
                src={img} 
                alt={`banner-${idx + 1}`} 
                className={Style.bannerImage} 
                loading={idx === 0 ? "eager" : "lazy"} 
                fetchpriority={idx === 0 ? "high" : "auto"}
              />
              <div className={Style.overlay}></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={Style.contentWrapper}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={Style.Bannertext}
        >
          <span className={Style.badge}>Explore the 4th Dimension</span>
          <h1>Unlock India's Hidden<span>Treasures</span></h1>
          <p>
            Experience the magic of India like never before. From the peaks of the Himalayas
            to the serene backwaters of Kerala, your journey starts here.
          </p>

          <div className={Style.searchContainer}>
            <div className={Style.searchBox}>
              <div className={Style.iconWrapper}>
                <MapPin size={20} />
              </div>
              <input
                type="text"
                placeholder="Where do you want to go?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => {
                  if (searchTerm.trim() !== "") setShowDropdown(true);
                }}
              />
              <button className={Style.searchBtn}>
                <Search size={20} />
                <span>Search</span>
              </button>

              <AnimatePresence>
                {showDropdown && filteredResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={Style.searchResults}
                  >
                    {filteredResults.map((item) => (
                      <div
                        key={item.id}
                        className={Style.searchItem}
                        onClick={() => handleSelectItem(item)}
                      >
                        <MapPin size={16} />
                        <span>{item.state_name || item.country_name}</span>
                        <ArrowRight size={14} className={Style.itemArrow} />
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className={Style.features}>
            <div className={Style.featureItem}>
              <strong>500+</strong>
              <span>Destinations</span>
            </div>
            <div className={Style.separator}></div>
            <div className={Style.featureItem}>
              <strong>10k+</strong>
              <span>Happy Travelers</span>
            </div>
            <div className={Style.separator}></div>
            <div className={Style.featureItem}>
              <strong>4.9/5</strong>
              <span>Average Rating</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Banner;


