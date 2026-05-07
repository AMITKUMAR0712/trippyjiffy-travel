import React, { useEffect, useState, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Style from "../Style/ExploreTours.module.scss";
import { getImgUrl } from "../utils/getImgUrl";
import Loader from "../HomeCompontent/Loader.jsx";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import SEO from "../HomeCompontent/SEO";

const baseURL = import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com";

const DestinationCard = memo(({ item, slugify, type, handleAction }) => {
  const imageUrl = getImgUrl(item.images?.[0]) || "";
  const detailsPath = type === "tour"
    ? `/india-tours/${item.id}/${slugify(item.state_name)}`
    : `/asia-tours/${slugify(item.country_name)}`;

  return (
    <Link
      key={`${type}-${item.id}`}
      to={detailsPath}
      className={Style.card}
      style={{ "--bg-image": `url("${imageUrl}")` }}
    >
      <div className={Style.cardActions}>
        <button onClick={(e) => handleAction(e, "wishlist", { ...item, detailPath: detailsPath })} className={Style.iconBtn} title="Add to Wishlist">
          <Heart size={18} />
        </button>
      </div>
      <div className={Style.badge}>{type === "tour" ? "India" : "Overseas"}</div>
      <div className={Style.content}>
        <h2 className={Style.title}>{item.title}</h2>
        <div className={Style.copy}>
          {item.tags && (
            <span className={Style.tagsInline}>
              {Array.isArray(item.tags)
                ? item.tags.slice(0, 2).join(" • ")
                : typeof item.tags === "string"
                  ? item.tags.split(",").slice(0, 2).join(" • ")
                  : ""}
            </span>
          )}
        </div>
        <div className={Style.btn}>View</div>
      </div>
    </Link>
  );
});

const ExploreTours = ({
  seoTitle = "Best Family Tours in India | India Tour Sites & Travelling Packages",
  seoDesc = "Find the best family tours in India with TrippyJiffy. Explore top India tour sites, premium travelling packages in India, and exciting vacation packages for your loved ones.",
  seoKeywords = "family tours, india tour sites, travelling packages in india, vacation packages",
  h1Text = "Family Tours ",
  h1SpanText = "in India",
  subText = "Explore the best India tour sites and travelling packages in India. Book unforgettable vacation packages for your family today."
}) => {
  const [tours, setTours] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleAction = async (e, action, item) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      toast.error(`Please login to add to ${action}`);
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(`${baseURL}/api/user-features/${action}`, {
        item_id: item.id,
        item_type: item.type === "tour" ? "india" : "asia",
        title: item.title,
        image: item.images?.[0] || "https://placehold.co/300x200",
        url: item.detailPath
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) toast.success(`Added to ${action}!`);
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to add to ${action}`);
    }
  };
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all', 'india', 'asia'

  const getValidImageUrl = (img, image_url) => {
    return getImgUrl(image_url || img);
  };

  const uniqueByState = (data) => {
    const map = new Map();
    data.forEach((item) => {
      if (!map.has(item.id)) map.set(item.id, item);
    });
    return Array.from(map.values());
  };

  const uniqueByCountryName = (data) => {
    const map = new Map();
    data.forEach((item) => {
      const key = item.country_name?.toLowerCase().trim() || "unknown-country";
      if (!map.has(key)) map.set(key, item);
    });
    return Array.from(map.values());
  };

  const slugify = (text) =>
    text
      ? text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
      : "";

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on mount

    const fetchData = async () => {
      try {
        const [stateRes, countryRes] = await Promise.all([
          axios.get(`${baseURL}/api/state/get`),
          axios.get(`${baseURL}/api/asia/get`),
        ]);

        // -------- INDIA TOURS --------
        const stateArray = Array.isArray(stateRes.data)
          ? stateRes.data
          : Array.isArray(stateRes.data.data)
            ? stateRes.data.data
            : [];

        const uniqueTours = uniqueByState(stateArray)
          .filter((s) => s.is_visible === 1)
          .map((item) => {
            const imgUrl = getValidImageUrl(item.image, item.image_url);
            return {
              id: item.id,
              state_name: item.state_name || "Unknown State",
              title: item.state_name || "Unknown State",
              tags: item.tags || [],
              images: imgUrl ? [imgUrl] : [],
              type: "tour",
            };
          });

        // -------- ASIA COUNTRIES --------
        const countryArray = Array.isArray(countryRes.data)
          ? countryRes.data
          : Array.isArray(countryRes.data.data)
            ? countryRes.data.data
            : [];

        const uniqueCountries = uniqueByCountryName(countryArray)
          .filter((c) => c.is_visible === 1)
          .map((item) => {
            const imgList =
              item.images
                ?.flatMap((img) => (Array.isArray(img) ? img : [img]))
                .map((img) => getValidImageUrl(img, item.image_url)) || [];
            return {
              id: item.id,
              country_name: item.country_name || "Unknown Country",
              title: item.country_name || "Unknown Country",
              images: imgList.filter(Boolean),
              tags: item.tags || ["International", "Overseas"],
              type: "country",
            };
          });

        setTours(uniqueTours);
        setCountries(uniqueCountries);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Combine and sort alphabetically
  const allDestinations = [...tours, ...countries].sort((a, b) =>
    a.title.localeCompare(b.title)
  );

  const getFilteredData = () => {
    switch (filter) {
      case 'india': return tours.sort((a, b) => a.title.localeCompare(b.title));
      case 'asia': return countries.sort((a, b) => a.title.localeCompare(b.title));
      default: return allDestinations;
    }
  };

  const filteredData = getFilteredData();

  // Fetch upcoming trips for the bottom section
  const [upcoming, setUpcoming] = useState([]);
  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/upcoming-trips/get`);
        setUpcoming(res.data.filter(t => t.is_visible === 1).slice(0, 4));
      } catch (err) { console.error(err); }
    };
    fetchUpcoming();
  }, []);

  return (
    <div className={Style.ExploreContainer}>
      <div className={Style.wrapper}>

        <SEO
          title={seoTitle}
          description={seoDesc}
          keywords={seoKeywords}
        />

        <div className={Style.header}>
          <h1 title={seoTitle}>{h1Text}<span>{h1SpanText}</span></h1>
          <p>{subText}</p>
        </div>

        <div className={Style.filterTabs}>
          <button
            className={filter === 'all' ? Style.activeBtn : ''}
            onClick={() => setFilter('all')}
          >
            All Locations
          </button>
          <button
            className={filter === 'india' ? Style.activeBtn : ''}
            onClick={() => setFilter('india')}
          >
            India Tours
          </button>
          <button
            className={filter === 'asia' ? Style.activeBtn : ''}
            onClick={() => setFilter('asia')}
          >
            Overseas Tours
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '60px 0' }}><Loader text="Scouting destinations..." /></div>
        ) : filteredData.length > 0 ? (
          <div className={Style.grid}>
            {filteredData.map((item) => (
              <DestinationCard
                key={`${item.type}-${item.id}`}
                item={item}
                slugify={slugify}
                type={item.type}
                handleAction={handleAction}
              />
            ))}
          </div>
        ) : (
          <div className={Style.emptyState}>
            <h3>No destinations found</h3>
            <p>We're constantly adding new locations. Please check back later!</p>
          </div>
        )}

        {/* Upcoming Section at the bottom */}
        {upcoming.length > 0 && (
          <div className={Style.upcomingSection}>
            <div className={Style.upcomingHeader}>
              <span className={Style.badge}>Ready for This?</span>
              <h2>Upcoming <span>Cohorts</span></h2>
              <p>Limited slots for our next group departures. Grab your spot before they're gone!</p>
            </div>

            <div className={Style.upcomingGrid}>
              {upcoming.map((trip) => {
                const detailsPath = `/upcoming-best-tours/${trip.id}`;
                return (
                  <Link key={trip.id} to={detailsPath} className={Style.upcomingCard}>
                    <div className={Style.cardActions}>
                      <button onClick={(e) => handleAction(e, "wishlist", { ...trip, type: "upcoming", detailPath: detailsPath })} className={Style.iconBtn} title="Add to Wishlist">
                        <Heart size={16} />
                      </button>
                    </div>
                    <div className={Style.upcomingImg}>
                      <img src={getImgUrl(trip.banner_image || trip.images?.[0])} alt={trip.title} />
                      <div className={Style.upcomingTag}>Coming Soon</div>
                    </div>
                    <div className={Style.upcomingInfo}>
                      <h3>{trip.title}</h3>
                      <span>View Itinerary →</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className={Style.viewAllWrap}>
              <Link to="/upcoming-best-tours" className={Style.viewAllBtn}>View All Upcoming Trips</Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ExploreTours;
