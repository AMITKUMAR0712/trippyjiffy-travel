import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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

  const stats = [
    { label: "Booked Trips", value: "0", icon: <Trophy color="#f59e0b" />, color: "amber" },
    { label: "Wishlist", value: "0", icon: <TrendingUp color="#3b82f6" />, color: "blue" },
    { label: "Destinations", value: "Global", icon: <MapPin color="#10b981" />, color: "green" },
    { label: "Active Plan", value: "Free", icon: <ShieldCheck color="#6366f1" />, color: "indigo" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className={Style.container}>
      {/* Welcome Section */}
      <section className={Style.welcomeSection}>
        <div className={Style.welcomeText}>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={Style.title}
          >
            Welcome back, <span className={Style.highlight}>{user.name}</span>! 👋
          </motion.h1>
          <motion.p 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.1 }}
             className={Style.subtitle}
          >
            Your next adventure is just a few clicks away. Explore your personalized travel dashboard.
          </motion.p>
        </div>
        
        <div className={Style.dateCard}>
          <Calendar size={20} className={Style.calendarIcon} />
          <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </section>

      {/* Stats Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={Style.statsGrid}
      >
        {stats.map((stat, idx) => (
          <motion.div variants={itemVariants} key={idx} className={Style.statCard}>
             <div className={`${Style.statIcon} ${Style[stat.color]}`}>
               {stat.icon}
             </div>
             <div className={Style.statInfo}>
               <span className={Style.statValue}>{stat.value}</span>
               <span className={Style.statLabel}>{stat.label}</span>
             </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className={Style.mainGrid}>
        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={Style.contentCard}
        >
          <div className={Style.cardHeader}>
            <h3>Recent Activities</h3>
            <button>View All <ArrowRight size={14} /></button>
          </div>
          <div className={Style.emptyState}>
            <Clock size={40} className={Style.emptyIcon} />
            <p>No recent activity found. Start planning your journey!</p>
          </div>
        </motion.div>

        {/* Quick Actions / Tips */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={Style.contentCard}
        >
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
        </motion.div>
      </div>
    </div>
  );
};

export default UserDashboard;

