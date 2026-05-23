
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import SEO from "../HomeCompontent/SEO";
import Style from "../Style/UpcomingLanding.module.scss";
import { getImgUrl } from "../utils/getImgUrl";
import { getPlainText } from "../utils/utils";
import Loader from "../HomeCompontent/Loader.jsx";
import { Heart } from "lucide-react";
import { toast } from "sonner";

const UpcomingLanding = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
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
        item_type: "upcoming",
        title: item.title,
        image: item.images?.[0] || item.banner_image || "https://placehold.co/300x200",
        url: `/upcoming-best-tours/${item.id}`
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) toast.success(`Added to ${action}!`);
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to add to ${action}`);
    }
  };

  return (
    <div className={Style.container}>
      <SEO
        title="Upcoming Trips 2026 | Group Departures & Travelling Packages in India"
        description="Join our upcoming group trips and travelling packages in India for 2026. Best group tour packages for domestic and international destinations. Book your slot with TrippyJiffy now!"
        keywords="upcoming trips 2026, group departures, travelling packages in india, family tours, weekend trips, TrippyJiffy"
      />

      <div className={Style.hero}>
        <div
          className={Style.heroContent}
        >
          <h1>Upcoming <span>Adventures</span></h1>
          <p>Handpicked experiences for the modern traveller. Join our upcoming cohorts.</p>
        </div>
      </div>

      <div className={Style.wrapper}>
        {loading ? (
          <Loader text="Discovering next adventures..." />
        ) : (
          <div className={Style.grid}>
            {trips.map((trip, idx) => (
              <div
                key={trip.id}
                className={Style.card}
              >
                <div className={Style.cardActions}>
                  <button onClick={(e) => handleAction(e, "wishlist", trip)} className={Style.iconBtn} title="Add to Wishlist">
                    <Heart size={16} />
                  </button>
                </div>
                <div className={Style.cardImg}>
                  <img src={getImgUrl(trip.banner_image || (trip.images?.[0]))} alt={trip.title} />
                  <div className={Style.tag}>{trip.tags?.split(',')[0] || 'Upcoming'}</div>
                </div>
                <div className={Style.cardContent}>
                  <h3>{trip.title}</h3>
                  <p>{getPlainText(trip.description)}</p>
                  <div className={Style.footer}>
                    <Link to={`/upcoming-best-tours/${trip.id}`} className={Style.btn}>View Details</Link>
                  </div>
                </div>
              </div>
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
