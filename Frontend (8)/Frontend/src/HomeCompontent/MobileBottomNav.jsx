import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Compass, CreditCard, MessageSquare, User } from "lucide-react";
import { createPortal } from "react-dom";
import Enquiry from "../Page/Enquiry";

const MobileBottomNav = () => {
  const location = useLocation();
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const navItems = [
    { icon: <Home size={20} />, label: "Home", path: "/" },
    { icon: <Compass size={20} />, label: "Explore", path: "/explore" },
    {
      icon: null,
      label: "Plan",
      path: null,
      isAction: true,
    },
    { icon: <CreditCard size={20} />, label: "Pay Now", path: "/payment" },
    {
      icon: <User size={20} />,
      label: isLoggedIn ? "Profile" : "Login",
      path: isLoggedIn ? "/user" : "/register",
    },
  ];

  return (
    <>
      {/* Portal for enquiry modal */}
      {showEnquiry &&
        createPortal(
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15,23,42,0.65)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              paddingTop: "40px",
              zIndex: 99999,
              overflowY: "auto",
            }}
            onClick={() => setShowEnquiry(false)}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: "20px",
                padding: "32px 24px",
                width: "95%",
                maxWidth: "600px",
                maxHeight: "90vh",
                overflowY: "auto",
                position: "relative",
                boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowEnquiry(false)}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "#f1f5f9",
                  border: "none",
                  fontSize: "18px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#64748b",
                  zIndex: 1,
                }}
              >
                ✕
              </button>
              <Enquiry isModal={true} />
            </div>
          </div>,
          document.body
        )}

      {/* Bottom Nav Bar */}
      <nav className="mobile-bottom-nav" role="navigation" aria-label="Mobile navigation">
        {navItems.map((item, i) => {
          if (item.isAction) {
            return (
              <button
                key={i}
                className={`mobile-bottom-nav__action ${showEnquiry ? "mobile-bottom-nav__item--active active-action" : ""}`}
                onClick={() => setShowEnquiry(true)}
                aria-label="Plan Your Trip"
              >
                <span className="mobile-bottom-nav__action-icon">✈</span>
                <span className="mobile-bottom-nav__label">Plan</span>
              </button>
            );
          }

          const isActive = location.pathname === item.path ||
            (item.path !== "/" && location.pathname.startsWith(item.path));

          return (
            <Link
              key={i}
              to={item.path}
              className={`mobile-bottom-nav__item ${isActive ? "mobile-bottom-nav__item--active" : ""}`}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="mobile-bottom-nav__icon">{item.icon}</span>
              <span className="mobile-bottom-nav__label">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default MobileBottomNav;
