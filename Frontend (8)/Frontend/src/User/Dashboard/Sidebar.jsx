import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  User,
  Settings,
  Bell,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Home
} from "lucide-react";
import Style from "../Dashboard/Style/Sidebar.module.scss";

const Sidebar = ({ isOpen, toggleSidebar, isMobile }) => {
  const navigate = useNavigate();

  const handleLinkClick = () => {
    if (isMobile && isOpen) toggleSidebar();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new CustomEvent("userLoggedIn", { detail: "Guest" }));
    if (isMobile && isOpen) toggleSidebar();
    navigate("/login");
  };

  const menuItems = [
    { name: "Back to Home", path: "/", icon: <Home size={20} /> },
    { name: "Dashboard", path: "/user", icon: <LayoutDashboard size={20} />, end: true },
    { name: "Profile", path: "/user/profile", icon: <User size={20} /> },
    { name: "Settings", path: "/user/edit", icon: <Settings size={20} /> },
    { name: "Messages", path: "/user/announcement", icon: <Bell size={20} /> },
    { name: "My Documents", path: "/user/UserDocument", icon: <FileText size={20} /> },
  ];

  return (
    <aside className={`${Style.sidebar} ${!isOpen ? Style.closed : ""}`}>
      <div className={Style.sidebarHeader}>
        <div className={Style.logoSection}>
          <div className={Style.logoIcon}>
            <ShieldCheck size={24} color="#f97316" />
          </div>
          {isOpen && (
            <motion.span 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className={Style.logoText}
            >
              User Panel
            </motion.span>
          )}
        </div>
        {!isMobile && (
          <button className={Style.toggleBtn} onClick={toggleSidebar}>
            {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        )}
      </div>

      <nav className={Style.nav}>
        {menuItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            end={item.end}
            onClick={handleLinkClick}
            className={({ isActive }) => `${Style.navLink} ${isActive ? Style.active : ""}`}
            title={!isOpen ? item.name : ""}
          >
            {({ isActive }) => (
              <>
                <span className={Style.icon}>{item.icon}</span>
                {isOpen && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    className={Style.linkText}
                  >
                    {item.name}
                  </motion.span>
                )}
                {isActive && <motion.div layoutId="activeNav" className={Style.activeIndicator} />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className={Style.sidebarFooter}>
        <button className={Style.logoutBtn} onClick={handleLogout}>
          <LogOut size={20} />
          {isOpen && <span className={Style.logoutText}>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

