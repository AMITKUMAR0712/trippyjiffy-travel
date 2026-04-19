import React, { useEffect, useState, memo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Style from "../Style/ExploreTours.module.scss";
import { getImgUrl } from "../utils/getImgUrl";
import Loader from "../HomeCompontent/Loader.jsx";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const DestinationCard = memo(({ item, slugify, type }) => {
  const imageUrl = getImgUrl(item.images?.[0]) || "";

  return (
    <Link
      key={`${type}-${item.id}`}
      to={
        type === "tour"
          ? `/india-tours/${item.id}/${slugify(item.state_name)}`
          : `/asia-tours/${slugify(item.country_name)}`
      }
      className={Style.card}
      style={{ "--bg-image": `url("${imageUrl}")` }}
    >
      <div className={Style.badge}>{type === "tour" ? "India" : "Asia"}</div>
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

const ExploreTours = () => {
  const [tours, setTours] = useState([]);
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
              tags: item.tags || ["International", "Asia"],
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
    switch(filter) {
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
        
        <div className={Style.header}>
          <h1>Explore <span>Destinations</span></h1>
          <p>Discover all our mesmerizing tours across India and Asia. Your next adventure starts here.</p>
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
            Asia Tours
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
              {upcoming.map((trip) => (
                <Link key={trip.id} to={`/upcoming/${trip.id}`} className={Style.upcomingCard}>
                  <div className={Style.upcomingImg}>
                    <img src={getImgUrl(trip.banner_image || trip.images?.[0])} alt={trip.title} />
                    <div className={Style.upcomingTag}>Coming Soon</div>
                  </div>
                  <div className={Style.upcomingInfo}>
                    <h3>{trip.title}</h3>
                    <span>View Itinerary →</span>
                  </div>
                </Link>
              ))}
            </div>

            <div className={Style.viewAllWrap}>
              <Link to="/upcoming" className={Style.viewAllBtn}>View All Upcoming Trips</Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ExploreTours;
