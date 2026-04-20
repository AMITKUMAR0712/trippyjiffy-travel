
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Style from "../Style/UpcomingLanding.module.scss";
import { getImgUrl } from "../utils/getImgUrl";
import Loader from "../HomeCompontent/Loader.jsx";

const UpcomingLanding = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseURL = import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com";

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/upcoming-trips/get`);
        setTrips(res.data.filter(t => t.is_visible === 1));
      } catch (err) {
        console.error("Error fetching trips:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, [baseURL]);

  return (
    <div className={Style.container}>
      <Helmet>
        <title>Upcoming Trips & Adventures | TrippyJiffy</title>
        <meta name="description" content="Explore our curated upcoming group trips, treks, and international adventures. Book your slot now!" />
      </Helmet>

      <div className={Style.hero}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={Style.heroContent}
        >
          <h1>Upcoming <span>Adventures</span></h1>
          <p>Handpicked experiences for the modern traveller. Join our upcoming cohorts.</p>
        </motion.div>
      </div>

      <div className={Style.wrapper}>
        {loading ? (
          <Loader text="Discovering next adventures..." />
        ) : (
          <div className={Style.grid}>
            {trips.map((trip, idx) => (
              <motion.div 
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={Style.card}
              >
                <div className={Style.cardImg}>
                  <img src={getImgUrl(trip.banner_image || (trip.images?.[0]))} alt={trip.title} />
                  <div className={Style.tag}>{trip.tags?.split(',')[0] || 'Upcoming'}</div>
                </div>
                <div className={Style.cardContent}>
                  <h3>{trip.title}</h3>
                  <p>{trip.description?.substring(0, 100)}...</p>
                  <div className={Style.footer}>
                    <Link to={`/upcoming/${trip.id}`} className={Style.btn}>View Details</Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && trips.length === 0 && (
          <div className={Style.noTrips}>
            <h3>No upcoming trips scheduled yet.</h3>
            <p>Check back soon or contact us for custom planning!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingLanding;
