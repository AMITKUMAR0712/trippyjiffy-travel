import React from "react";
import { Link } from "react-router-dom";
import {
  FaMoneyCheckAlt,
  FaTachometerAlt,
  FaCommentDots,
  FaBlog,
  FaFlag,
  FaMapMarkedAlt,
  FaGlobe,
  FaQuestionCircle,
  FaUsers,
  FaRegEnvelope,
  FaPalette,
} from "react-icons/fa";
import Style from "../Style/DashboardSidebar.module.scss";
import Payment from "../../Page/Payment";

const DashboardSidebar = ({ isOpen, toggleSidebar, isMobile }) => {
  const handleLinkClick = () => {
    if (isMobile) toggleSidebar();
  };

  return (
    <>
      {isMobile && (
        <button
          className={`${Style.mobileToggle} ${isOpen ? Style.toggle : ""}`}
          onClick={toggleSidebar}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      )}

      <aside
        className={`${Style.sidebar} ${isOpen ? Style.open : Style.closed} ${isMobile ? Style.mobile : ""
          }`}
      >
        <div className={Style.logo}>Admin Panel</div>
        <ul>
          <li>
            <Link to="/admin/dashboard" onClick={handleLinkClick}>
              <FaTachometerAlt className={Style.icon} /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/dashboard/adminPayments" onClick={handleLinkClick}>
              <FaMoneyCheckAlt className={Style.icon} /> Payment History
            </Link>
          </li>
          <li>
            <Link to="/admin/dashboard/adminprofile" onClick={handleLinkClick}>
              <FaTachometerAlt className={Style.icon} /> AdminProfile
            </Link>
          </li>
          <li>
            <Link
              to="/admin/dashboard/AdminBussianContent"
              onClick={handleLinkClick}
            >
              <FaTachometerAlt className={Style.icon} />
              BusinessContent
            </Link>
          </li>
          <li>
            <Link
              to="/admin/dashboard/usermanagement"
              onClick={handleLinkClick}
            >
              <FaUsers className={Style.icon} /> User Management
            </Link>
          </li>

          <li>
            <Link to="/admin/dashboard/admincontact" onClick={handleLinkClick}>
              <FaRegEnvelope className={Style.icon} /> Contact
            </Link>
          </li>
          <li>
            <Link to="/admin/dashboard/adminenquiry" onClick={handleLinkClick}>
              <FaRegEnvelope className={Style.icon} /> Enquiry
            </Link>
          </li>
          <li>
            <Link to="/admin/dashboard/adminfeedback" onClick={handleLinkClick}>
              <FaCommentDots className={Style.icon} /> Feedback
            </Link>
          </li>
          <li>
            <Link to="/admin/dashboard/adminBlog" onClick={handleLinkClick}>
              <FaBlog className={Style.icon} /> Blog
            </Link>
          </li>
          <li>
            <Link to="/admin/dashboard/CatagoryIndia" onClick={handleLinkClick}>
              <FaFlag className={Style.icon} /> Category India
            </Link>
          </li>
          <li>
            <Link to="/admin/dashboard/Itinerary" onClick={handleLinkClick}>
              <FaMapMarkedAlt className={Style.icon} /> India Itineary
            </Link>
          </li>
          <li>
            <Link to="/admin/dashboard/AdminTours" onClick={handleLinkClick}>
              <FaMapMarkedAlt className={Style.icon} /> Itinerary Tours
            </Link>
          </li>
          <li>
            <Link to="/admin/dashboard/AdminFaq" onClick={handleLinkClick}>
              <FaQuestionCircle className={Style.icon} /> India State FAQ
            </Link>
          </li>
          <li>
            <Link to="/admin/dashboard/AdminAsia" onClick={handleLinkClick}>
              <FaGlobe className={Style.icon} /> Asia
            </Link>
          </li>
          <li>
            <Link
              to="/admin/dashboard/AdminAsiaState"
              onClick={handleLinkClick}
            >
              <FaGlobe className={Style.icon} /> AsiaState
            </Link>
          </li>
          <li>
            <Link to="/admin/dashboard/AdminCountry" onClick={handleLinkClick}>
              <FaGlobe className={Style.icon} /> CountryTours
            </Link>
          </li>
          <li>
            <Link
              to="/admin/dashboard/AdminFaqCountry"
              onClick={handleLinkClick}
            >
              <FaQuestionCircle className={Style.icon} /> CountryFAQ
            </Link>
          </li>
          <li>
            <Link to="/admin/dashboard/admintheme" onClick={handleLinkClick}>
              <FaPalette className={Style.icon} /> Customize Theme
            </Link>
          </li>
          <li>
            <Link to="/admin/dashboard/upcoming-trips" onClick={handleLinkClick}>
              <FaMapMarkedAlt className={Style.icon} /> Upcoming Trips
            </Link>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default DashboardSidebar;
