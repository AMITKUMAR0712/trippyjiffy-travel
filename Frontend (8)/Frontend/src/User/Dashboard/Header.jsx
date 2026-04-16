import React, { useEffect, useState } from "react";
import Style from "../Dashboard/Style/Header.module.scss";
import { 
  LogOut, 
  User, 
  Menu, 
  Bell, 
  Search,
  ChevronRight
} from "lucide-react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const [userName, setUserName] = useState("Guest");
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const location = useLocation();

  // Determine page title based on path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/user") return "Dashboard";
    if (path === "/user/profile") return "My Profile";
    if (path === "/user/edit") return "Settings";
    if (path === "/user/announcement") return "Messages";
    if (path === "/user/UserDocument") return "Documents";
    return "User Panel";
  };

  const fetchUserName = async () => {
    const token = localStorage.getItem("token");
    if (!token) return setUserName("Guest");

    try {
      const response = await axios.get(`${baseURL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserName(response.data?.name || "Guest");
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUserName("Guest");
    }
  };

  useEffect(() => {
    fetchUserName();
    const handleLogin = (e) => setUserName(e.detail);
    window.addEventListener("userLoggedIn", handleLogin);
    return () => window.removeEventListener("userLoggedIn", handleLogin);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className={Style.header}>
      <div className={Style.headerLeft}>
        <button className={Style.menuBtn} onClick={toggleSidebar}>
          <Menu size={20} />
        </button>
        
        <div className={Style.breadcrumb}>
          <span className={Style.root}>Panel</span>
          <ChevronRight size={14} className={Style.chevron} />
          <span className={Style.current}>{getPageTitle()}</span>
        </div>
      </div>

      <div className={Style.headerRight}>
        <div className={Style.searchBox}>
          <Search size={18} className={Style.searchIcon} />
          <input type="text" placeholder="Search..." />
        </div>

        <button className={Style.iconBtn}>
          <Bell size={20} />
          <span className={Style.notificationBadge} />
        </button>

        <div className={Style.userProfile}>
          <div className={Style.userInfo}>
            <span className={Style.userName}>{userName}</span>
            <span className={Style.userRole}>Member</span>
          </div>
          <div className={Style.avatar}>
            <User size={20} color="#64748b" />
          </div>
          
          <div className={Style.dropdown}>
             <button onClick={() => navigate("/user/profile")}>
                <User size={16} /> Profile
             </button>
             <button onClick={handleLogout} className={Style.logoutBtn}>
                <LogOut size={16} /> Logout
             </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;


