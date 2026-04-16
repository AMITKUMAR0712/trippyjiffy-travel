import React, { useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
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
import { motion } from "framer-motion";

import Style from "../Style/Footer.module.scss";
import Logo from "../Img/trippylogo.png";
const baseURL = import.meta.env.VITE_API_BASE_URL;

const Footer = () => {
  const [indiaTours, setIndiaTours] = useState([]);
  const [asiaTours, setAsiaTours] = useState([]);

  useEffect(() => {
    const fetchIndiaTours = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/category-india/get`);
        setIndiaTours(res.data || []);
      } catch (err) {
        console.error("Error fetching India Tours:", err);
      }
    };

    const fetchAsiaTours = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/asia/get`);
        setAsiaTours(res.data || []);
      } catch (err) {
        console.error("Error fetching Asia Tours:", err);
      }
    };

    fetchIndiaTours();
    fetchAsiaTours();
  }, [baseURL]);

  const socialLinks = [
    { icon: <FaInstagram aria-hidden="true" />, url: "https://www.instagram.com/trippy.jiffy?igsh=b3A2ZzIxcHdxZmVo&utm_source=qr", label: "Instagram" },
    { icon: <FaLinkedin aria-hidden="true" />, url: "https://www.linkedin.com/company/trippyjiffy/", label: "LinkedIn" },
    { icon: <FaFacebookF aria-hidden="true" />, url: "https://www.facebook.com/share/1G1V1m7gCJ/?mibextid=wwXIfr", label: "Facebook" },
    { icon: <FaYoutube aria-hidden="true" />, url: "https://youtube.com/@trippyjiffy?si=K9vr-sxTLp2LHYxg", label: "YouTube" },
  ];

  const usefulLinks = [
    { name: "Blogs", path: "/blogpage" },
    { name: "Customer’s Valuable Feedbacks", path: "/feedback-form" },
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

  return (
    <footer className={Style.Footer}>
      {/* Animated Airplane Crossing */}
      <div className={Style.airplaneTrack}>
        <motion.div 
          className={Style.airplane}
          animate={{ x: ["-10vw", "110vw"], y: [0, -20, 0, 15, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        >
          <FaPlane />
        </motion.div>
        <motion.div 
          className={Style.airplane2}
          animate={{ x: ["-10vw", "110vw"], y: [10, -10, 15, -5, 10] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 4 }}
        >
          <FaPlane />
        </motion.div>
        <motion.div 
          className={Style.airplane3}
          animate={{ x: ["-10vw", "110vw"], y: [-15, 5, -20, 5, -15] }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear", delay: 8 }}
        >
          <FaPlane />
        </motion.div>
      </div>

      <div className={Style.wrapper}>
        <motion.div 
          className={Style.FooterFlex}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className={Style.FooterWrap}>
            <div className={Style.FooterImage}>
              <img src={Logo} alt="Footer Logo" />
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
          </motion.div>

          <motion.div variants={itemVariants} className={Style.FooterWrap1}>
            <h2>Quick Links</h2>
            <ul>
              {usefulLinks.map((link, i) => (
                <li key={i}>
                  <Link to={link.path}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className={Style.FooterWrap2}>
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
          </motion.div>

          <motion.div variants={itemVariants} className={Style.FooterWrap2}>
            <h2>Asia Tours</h2>
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
          </motion.div>

          <motion.div variants={itemVariants} className={Style.FooterWrap3}>
            <h2>Contact Us</h2>
            <ul>
              <li>
                <FaEnvelope aria-hidden="true" /> travelqueries@trippyjiffy.com
              </li>
              <li>
                <FaPhoneAlt aria-hidden="true" /> 9870210896 , 8527454549
              </li>
              <li>
                <FaMapMarkerAlt aria-hidden="true" />
                <span>Sector 1, Vikas Nagar Lucknow 226022 (India)</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className={Style.FooterBottom}
        >
          <p>
            <FaGlobeAmericas style={{ marginRight: '8px', color: 'var(--primary-color, #d35400)' }} /> 
            © {new Date().getFullYear()} Trippyjiffy Travel. All Rights Reserved. Empowering your next journey.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default memo(Footer);
