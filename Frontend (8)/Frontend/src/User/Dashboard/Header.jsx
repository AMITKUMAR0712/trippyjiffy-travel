import React, { useEffect, useState } from "react";
import Style from "../Dashboard/Style/Header.module.scss";
import { 
  LogOut, 
  User, 
  Menu, 
  Bell, 
  Search,
  ChevronRight,
  MessageSquare,
  FileText
} from "lucide-react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const [userName, setUserName] = useState("Guest");
  const baseURL = import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com";
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

  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const fetchUserName = async () => {
    const token = localStorage.getItem("token");
    if (!token) return setUserName("Guest");

    try {
      const response = await axios.get(`${baseURL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = response.data;
      setUserName(userData?.name || "Guest");
      
      let newNotifs = [];
      if (userData?.admin_message) {
         newNotifs.push({
           id: "msg",
           title: "New Message from Admin",
           desc: userData.admin_message.length > 30 ? userData.admin_message.substring(0, 30) + "..." : userData.admin_message,
           icon: <MessageSquare size={16} color="#3b82f6" />,
           path: "/user/announcement"
         });
      }

      // Fetch documents too
      try {
         const docRes = await axios.get(`${baseURL}/api/user-documents/user`, {
           headers: { Authorization: `Bearer ${token}` },
         });
         const docs = docRes.data.pdfs || [];
         if (docs.length > 0) {
            newNotifs.push({
               id: "doc",
               title: "New Document Available",
               desc: `You have ${docs.length} document${docs.length > 1 ? "s" : ""} uploaded by admin.`,
               icon: <FileText size={16} color="#f97316" />,
               path: "/user/announcement"
            });
         }
      } catch (err) {}

      setNotifications(newNotifs);

    } catch (error) {
      console.error("Failed to fetch user data for header:", error);
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

        <div className={Style.notificationWrapper}>
          <button 
            className={`${Style.iconBtn} ${notifications.length > 0 ? Style.hasUnread : ""}`}
            onClick={() => setShowNotif(!showNotif)}
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className={Style.notificationBadge}>
                {notifications.length}
              </span>
            )}
          </button>
          
          {showNotif && (
            <div className={Style.notifDropdown}>
              <div className={Style.notifHeader}>
                <h4>Notifications</h4>
                <span>{notifications.length} New</span>
              </div>
              <div className={Style.notifList}>
                {notifications.length > 0 ? (
                  notifications.map((notif, idx) => (
                    <div 
                      key={idx} 
                      className={Style.notifItem}
                      onClick={() => {
                        setShowNotif(false);
                        navigate(notif.path);
                      }}
                    >
                      <div className={Style.notifIconWrap}>{notif.icon}</div>
                      <div className={Style.notifContent}>
                        <p className={Style.notifTitle}>{notif.title}</p>
                        <p className={Style.notifDesc}>{notif.desc}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={Style.emptyNotif}>
                    <p>You're all caught up!</p>
                  </div>
                )}
              </div>
              <div className={Style.notifFooter}>
                <button onClick={() => { setShowNotif(false); navigate("/user/announcement"); }}>
                  View All Messages
                </button>
              </div>
            </div>
          )}
        </div>

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


