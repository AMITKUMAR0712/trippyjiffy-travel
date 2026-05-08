import React, { useEffect, useState } from "react";
import axios from "axios";

import { 
  Trophy, 
  MapPin, 
  Clock, 
  Calendar,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import Style from "../Dashboard/Style/UserDashboard.module.scss";

const UserDashboard = () => {
  const [user, setUser] = useState({ name: "User", email: "", country: "" });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const [stats, setStats] = useState({
    bookedTrips: "0",
    wishlist: "0",
    destinations: "Global",
    activePlan: "Free"
  });
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const baseURL = import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com";
        const { data } = await axios.get(`${baseURL}/api/user-features/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (data && data.success) {
          setStats({
            bookedTrips: data.stats.bookedTrips.toString(),
            wishlist: data.stats.wishlist.toString(),
            destinations: data.stats.destinations,
            activePlan: data.stats.activePlan
          });
          setActivities(data.recentActivities || []);
        }
      } catch (err) {
        console.error("Error fetching dashboard stats", err);
      }
    };
    fetchDashboardData();
  }, []);

  const statCards = [
    { label: "Booked Trips", value: stats.bookedTrips, icon: <Trophy color="#f59e0b" />, color: "amber" },
    { label: "Wishlist", value: stats.wishlist, icon: <TrendingUp color="#3b82f6" />, color: "blue" },
    { label: "Destinations", value: stats.destinations, icon: <MapPin color="#10b981" />, color: "green" },
    { label: "Active Plan", value: stats.activePlan, icon: <ShieldCheck color="#6366f1" />, color: "indigo" }
  ];

  return (
    <div className={Style.container}>
      {/* Welcome Section */}
      <section className={Style.welcomeSection}>
        <div className={Style.welcomeText}>
          <h1 className={Style.title}>
            Welcome back, <span className={Style.highlight}>{user.name}</span>! 👋
          </h1>
          <p className={Style.subtitle}>
            Your next adventure is just a few clicks away. Explore your personalized travel dashboard.
          </p>
        </div>
        
        <div className={Style.dateCard}>
          <Calendar size={20} className={Style.calendarIcon} />
          <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </section>

      {/* Stats Grid */}
      <div className={Style.statsGrid}>
        {statCards.map((stat, idx) => (
          <div key={idx} className={Style.statCard}>
             <div className={`${Style.statIcon} ${Style[stat.color]}`}>
               {stat.icon}
             </div>
             <div className={Style.statInfo}>
               <span className={Style.statValue}>{stat.value}</span>
               <span className={Style.statLabel}>{stat.label}</span>
             </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className={Style.mainGrid}>
        {/* Recent Activity */}
        <div className={Style.contentCard}>
          <div className={Style.cardHeader}>
            <h3>Recent Activities</h3>
            <button>View All <ArrowRight size={14} /></button>
          </div>
          {activities.length > 0 ? (
            <div className={Style.activityList}>
              {activities.map((act, i) => (
                <div key={i} className={Style.activityItem}>
                  <div className={Style.activityDot} />
                  <div className={Style.activityDetails}>
                    <p>Enquiry for <strong>{act.destination}</strong></p>
                    <span>{new Date(act.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={Style.emptyState}>
              <Clock size={40} className={Style.emptyIcon} />
              <p>No recent activity found. Start planning your journey!</p>
            </div>
          )}
        </div>

        {/* Quick Actions / Tips */}
        <div className={Style.contentCard}>
          <div className={Style.cardHeader}>
             <h3>Travel Tips</h3>
             <AlertCircle size={20} color="#94a3b8" />
          </div>
          <div className={Style.tipsList}>
             <div className={Style.tipItem}>
                <div className={Style.tipBullet} />
                <p>Complete your profile to get better recommendations.</p>
             </div>
             <div className={Style.tipItem}>
                <div className={Style.tipBullet} />
                <p>Check the latest visa requirements for your next destination.</p>
             </div>
             <div className={Style.tipItem}>
                <div className={Style.tipBullet} />
                <p>Follow us on social media for exclusive travel deals.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

