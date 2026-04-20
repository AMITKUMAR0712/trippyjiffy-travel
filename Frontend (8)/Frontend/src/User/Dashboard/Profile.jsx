import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Calendar,
  Shield,
  Edit2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Style from "../Dashboard/Style/Profile.module.scss";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const baseURL = import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please login.");
          return;
        }

        const response = await axios.get(`${baseURL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) setUser(response.data);
        else setError("No user data found.");
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setError("Failed to fetch user profile.");
      }
    };
    fetchUserProfile();
  }, [baseURL]);

  if (error) return <div className={Style.errorState}>{error}</div>;
  if (!user) return <div className={Style.loadingState}>Loading profile details...</div>;

  return (
    <div className={Style.container}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={Style.profileCard}
      >
        <div className={Style.header}>
           <div className={Style.avatarSection}>
              <div className={Style.avatar}>
                 <User size={40} color="#94a3b8" />
              </div>
              <div className={Style.headerText}>
                 <h2>{user.name}</h2>
                 <p>{user.email}</p>
              </div>
           </div>
           <button onClick={() => navigate("/user/edit")} className={Style.editBtn}>
              <Edit2 size={16} /> Edit Profile
           </button>
        </div>

        <div className={Style.content}>
           <div className={Style.infoGrid}>
              <div className={Style.infoItem}>
                 <div className={Style.iconBox}><User size={20} /></div>
                 <div className={Style.details}>
                    <label>Full Name</label>
                    <span>{user.name}</span>
                 </div>
              </div>
              <div className={Style.infoItem}>
                 <div className={Style.iconBox}><Mail size={20} /></div>
                 <div className={Style.details}>
                    <label>Email Address</label>
                    <span>{user.email}</span>
                 </div>
              </div>
              <div className={Style.infoItem}>
                 <div className={Style.iconBox}><Phone size={20} /></div>
                 <div className={Style.details}>
                    <label>Phone Number</label>
                    <span>{user.mobile || "Not specified"}</span>
                 </div>
              </div>
              <div className={Style.infoItem}>
                 <div className={Style.iconBox}><Globe size={20} /></div>
                 <div className={Style.details}>
                    <label>Country</label>
                    <span>{user.country || "Not specified"}</span>
                 </div>
              </div>
              <div className={Style.infoItem}>
                 <div className={Style.iconBox}><Calendar size={20} /></div>
                 <div className={Style.details}>
                    <label>Joined On</label>
                    <span>{user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}</span>
                 </div>
              </div>
              <div className={Style.infoItem}>
                 <div className={Style.iconBox}><Shield size={20} /></div>
                 <div className={Style.details}>
                    <label>Account Status</label>
                    <span className={Style.statusActive}>Verified</span>
                 </div>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;

