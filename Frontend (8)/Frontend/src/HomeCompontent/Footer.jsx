import React, { useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaLinkedin,
  FaFacebookF,
  FaYoutube,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaPlane,
  FaGlobeAmericas
} from "react-icons/fa";


import Style from "../Style/Footer.module.scss";
import Logo from "../Img/trippylogo.png";
import { getFooterToursData } from "../utils/siteShellData";

const Footer = () => {
  const [indiaTours, setIndiaTours] = useState([]);
  const [asiaTours, setAsiaTours] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const fetchFooterTours = async () => {
      try {
        const { indiaTours: nextIndiaTours, asiaTours: nextAsiaTours } = await getFooterToursData();
        if (cancelled) return;
        setIndiaTours(nextIndiaTours);
        setAsiaTours(nextAsiaTours);
      } catch (err) {
        console.error("Error fetching footer tours:", err);
        setIndiaTours([]);
        setAsiaTours([]);
      }
    };

    const scheduleFooterFetch = () => {
      if ("requestIdleCallback" in window) {
        return window.requestIdleCallback(fetchFooterTours, { timeout: 1500 });
      }
      return window.setTimeout(fetchFooterTours, 300);
    };

    const idleId = scheduleFooterFetch();

    return () => {
      cancelled = true;
      if ("requestIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
    };
  }, []);

  const socialLinks = [
    { icon: <FaInstagram aria-hidden="true" />, url: "https://www.instagram.com/trippy.jiffy?igsh=b3A2ZzIxcHdxZmVo&utm_source=qr", label: "Instagram" },
    { icon: <FaLinkedin aria-hidden="true" />, url: "https://www.linkedin.com/company/trippyjiffy/", label: "LinkedIn" },
    { icon: <FaFacebookF aria-hidden="true" />, url: "https://www.facebook.com/profile.php?id=61590639771522", label: "Facebook" },
    { icon: <FaYoutube aria-hidden="true" />, url: "https://youtube.com/@trippyjiffy?si=K9vr-sxTLp2LHYxg", label: "YouTube" },
  ];

  const usefulLinks = [
    { name: "Family Tours", path: "/family-tours" },
    { name: "Blogs", path: "/blogpage" },
    { name: "Valuable Customer Feedback", path: "/feedback-form" },
    { name: "About Us", path: "/about-us" },
    { name: "Plan Your Trip", path: "/enquiry-form" },
    { name: "Pay Now", path: "/payment" },
    { name: "Privacy Policy", path: "/privacypolicy" },
    { name: "Terms & Conditions", path: "/termscondition" },
  ];

  const slugify = (text) =>
    (text || "")
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const handleLinkClick = (e, link) => {
    if (link.isPopup) {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent("openLeadPopup"));
    }
  };

  return (
    <footer className={Style.Footer}>
      {/* Animated Airplane Crossing */}
      <div className={Style.airplaneTrack}>
        <div className={Style.airplane}><FaPlane /></div>
        <div className={Style.airplane2}><FaPlane /></div>
        <div className={Style.airplane3}><FaPlane /></div>
        <div className={Style.airplane4}><FaPlane /></div>
      </div>

      <div className={Style.wrapper}>
        <div className={Style.FooterFlex}>
          <div className={Style.FooterWrap}>
            <div className={Style.FooterImage}>
              <img src={Logo} alt="Footer Logo" width="160" height="60" loading="lazy" />
            </div>
            <p>Where unforgettable memories don't come with a price tag!</p>

            <div className={Style.FooterInsta}>
              <h2>Follow Us:</h2>
              <ul>
                {socialLinks.map((social, i) => (
                  <li key={i}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                    >
                      {social.icon}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={Style.FooterWrap1}>
            <h2>Quick Links</h2>
            <ul>
              {usefulLinks.map((link, i) => (
                <li key={i}>
                  <Link 
                    to={link.path} 
                    onClick={(e) => handleLinkClick(e, link)}
                    className={link.isFeatured ? Style.featuredLink : ""}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={Style.FooterWrap2}>
            <h2>India Tours</h2>
            <ul>
              {indiaTours.length > 0 ? (
                indiaTours.map((tour) => (
                  <li key={tour.id}>
                    <Link
                      to={`/india-tours/${tour.id}/${slugify(tour.region_name)}`}
                    >
                      {tour.region_name}
                    </Link>
                  </li>
                ))
              ) : (
                <li>Loading...</li>
              )}
            </ul>
          </div>

          <div className={Style.FooterWrap2}>
            <h2>Overseas Tours</h2>
            <ul>
              {asiaTours.length > 0 ? (
                asiaTours.map((tour) => (
                  <li key={tour.id || tour._id}>
                    <Link
                      to={`/asia-tours/${slugify(
                        tour.country_name || tour.region_name || tour.name
                      )}`}
                    >
                      {tour.country_name || tour.region_name || tour.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li>Loading...</li>
              )}
            </ul>
          </div>

          <div className={Style.FooterWrap3}>
            <h2>Contact Us</h2>
            <address style={{ fontStyle: 'normal' }}>
              <ul>
                <li>
                  <a href="mailto:travelqueries@trippyjiffy.com" style={{ color: 'inherit', textDecoration: 'none' }}>
                    <FaEnvelope aria-hidden="true" /> travelqueries@trippyjiffy.com
                  </a>
                </li>
                <li>
                  <a href="tel:+919870210896" style={{ color: 'inherit', textDecoration: 'none' }}>
                    <FaPhoneAlt aria-hidden="true" /> +91 98702 10896
                  </a>
                  {' , '}
                  <a href="tel:+918527454549" style={{ color: 'inherit', textDecoration: 'none' }}>
                    85274 54549
                  </a>
                </li>
                <li>
                  <FaMapMarkerAlt aria-hidden="true" />
                  <span>Sector 1, Vikas Nagar Lucknow 226022 (India)</span>
                </li>
              </ul>
              <div style={{ marginTop: '20px' }}>
                <Link 
                  to="/customize-your-holiday-plan" 
                  className={Style.featuredLink}
                >
                  Customize Your Holiday
                </Link>
              </div>
            </address>
          </div>
        </div>

        <div className={Style.FooterBottom}>
          <p>
            <span style={{ display: 'inline-block', marginRight: '8px' }}>
              <FaGlobeAmericas style={{ color: 'var(--primary-color, #d35400)' }} />
            </span>
            © {new Date().getFullYear()} Trippyjiffy Travel. All Rights Reserved. Empowering your next journey.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);
