import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectFade } from "swiper/modules";
import axios from "axios";
import { useDebounce } from "../hooks/useDebounce";
import { Search, MapPin, ArrowRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import Style from "../Style/Banner.module.scss";
// The first banner image is moved to public and preloaded in index.html for LCP optimization
const Banner1 = "/Banner_LCP.webp";
import Banner2 from "../Img/Hero section-20260507T162428Z-3-001/Hero section/2.webp";
import Banner3 from "../Img/Hero section-20260507T162428Z-3-001/Hero section/3.webp";
import Banner4 from "../Img/Hero section-20260507T162428Z-3-001/Hero section/4.webp";


const Banner = () => {
  const [combinedData, setCombinedData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasLoadedSearchData, setHasLoadedSearchData] = useState(false);

  const navigate = useNavigate();
  const debouncedSearch = useDebounce(searchTerm, 500);
  const baseURL = import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com";

  const loadSearchData = async () => {
    if (hasLoadedSearchData) return;

    try {
      const res = await axios.get(`${baseURL}/api/combined-data`);
      setCombinedData(res.data || []);
      setHasLoadedSearchData(true);
    } catch (err) {
      console.error("Error fetching combined data:", err.message);
    }
  };

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
        {[Banner1, Banner2, Banner3, Banner4].map((img, idx) => (
          <SwiperSlide key={idx}>
            <div className={Style.slide}>
              <img 
                src={img} 
                alt={idx === 0 ? "Best family tours in India" : idx === 1 ? "India tour packages" : "Affordable travelling packages in India"} 
                className={Style.bannerImage} 
                loading={idx === 0 ? "eager" : "lazy"} 
                fetchpriority={idx === 0 ? "high" : "auto"}
                decoding={idx === 0 ? "sync" : "async"}
                width="1920"
                height="1080"
              />
              <div className={Style.overlay}></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={Style.contentWrapper}>
        <div className={Style.Bannertext}>
          <span className={Style.badge}>Explore the 4th Dimension</span>
          <h1 title="Best India Tours & Family Tour Packages">Best India Tours & <span>Family Tour Packages</span></h1>
          <p>
            Explore affordable travelling packages in India with customized family tours, honeymoon trips, group tours, and international holiday packages.
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
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  loadSearchData();
                }}
                onFocus={() => {
                  loadSearchData();
                  if (searchTerm.trim() !== "") setShowDropdown(true);
                }}
              />
              <button className={Style.searchBtn}>
                <Search size={20} />
                <span>Search</span>
              </button>

                {showDropdown && filteredResults.length > 0 && (
                  <div className={Style.searchResults}>
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
                  </div>
                )}
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
        </div>
      </div>
    </div>
  );
};

export default Banner;


