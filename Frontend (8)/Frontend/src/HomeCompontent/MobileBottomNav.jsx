import React, { useState, useEffect, lazy, Suspense } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Compass, CreditCard, User } from "lucide-react";
import { createPortal } from "react-dom";

const Enquiry = lazy(() => import("../Page/Enquiry"));

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
    { icon: <Compass size={20} />, label: "Explore", path: "/family-tours" },
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
            className="enquiry-mobile-overlay"
            onClick={() => setShowEnquiry(false)}
          >
            <div
              className="enquiry-mobile-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="enquiry-mobile-close"
                onClick={() => setShowEnquiry(false)}
                aria-label="Close enquiry form"
              >
                ✕
              </button>
              <Suspense fallback={null}>
                <Enquiry isModal={true} />
              </Suspense>
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
