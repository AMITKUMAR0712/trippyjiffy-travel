import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import Style from "../Dashboard/Style/UserHome.module.scss";
import Header from "../Dashboard/Header.jsx";
import Sidebar from "../Dashboard/Sidebar.jsx";

const UserdHome = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={Style.dashboardLayout}>
      {/* Sidebar with AnimatePresence for mobile */}
      <div style={{ display: "contents" }}>
        {(isSidebarOpen || !isMobile) && (
          <div>
            className={Style.dashboardLayoutLeft}
          >
            <Sidebar
              isOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
              isMobile={isMobile}
            />
          </div>
        )}
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div
          className={Style.overlay}
          onClick={toggleSidebar}
        />
      )}

      <div className={`${Style.rightContent} ${!isSidebarOpen && !isMobile ? Style.expanded : ""}`}>
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className={Style.pageContent}>
          <div
            key={window.location.pathname}
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserdHome;

