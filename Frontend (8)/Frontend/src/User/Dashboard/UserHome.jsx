import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
      <AnimatePresence mode="wait">
        {(isSidebarOpen || !isMobile) && (
          <motion.div
            initial={isMobile ? { x: -300 } : false}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={Style.dashboardLayoutLeft}
          >
            <Sidebar
              isOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
              isMobile={isMobile}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={Style.overlay}
          onClick={toggleSidebar}
        />
      )}

      <div className={`${Style.rightContent} ${!isSidebarOpen && !isMobile ? Style.expanded : ""}`}>
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className={Style.pageContent}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            key={window.location.pathname}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default UserdHome;

