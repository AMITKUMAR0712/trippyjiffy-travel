import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Style from "../Style/Sidebar.module.scss";

const Sidebar = ({ menuOpen, setMenuOpen }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openSubCategory, setOpenSubCategory] = useState(null);
  const [indiaTours, setIndiaTours] = useState([]);
  const [asiaTours, setAsiaTours] = useState([]);
  const [countriesData, setCountriesData] = useState([]);

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [indiaRes, asiaRes, countryRes] = await Promise.all([
          axios.get(`${baseURL}/api/category-india/get`),
          axios.get(`${baseURL}/api/asia/get`),
          axios.get(`${baseURL}/api/country/get`),
        ]);
        setIndiaTours(Array.isArray(indiaRes.data) ? indiaRes.data : []);
        setAsiaTours(Array.isArray(asiaRes.data) ? asiaRes.data : []);
        setCountriesData(Array.isArray(countryRes.data) ? countryRes.data : []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [baseURL]);

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    if (menuOpen) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [menuOpen, setMenuOpen]);

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
    setOpenSubCategory(null);
  };

  const slugify = (text) =>
    typeof text === "string"
      ? text
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
      : "";

  const navData = [
    { name: "Home", path: "/" },
    {
      name: "India Tours",
      categories: indiaTours.map((region) => ({
        ...region,
        path: `/india-tours/${region.id}/${slugify(region.region_name)}`,
      })),
    },
    {
      name: "Asia Tours",
      categories: asiaTours.map((region) => ({
        ...region,
        path: `/asia-tours/${slugify(region.country_name)}`,
      })),
    },
    {
      name: "Landing Pages",
      categories: [
        { name: "Golden Triangle", path: "/landing-pages/golden-triangle" },
        { name: "South India Tour", path: "/landing-pages/south-india" },
        { name: "Rajasthan", path: "/landing-pages/rajasthan" },
      ],
    },
    {
      name: "Reach Us",
      categories: [
        { name: "Business With Us", path: "/business-with-us" },
        { name: "Contact us", path: "/contact-us" },
      ],
    },
    { name: "About Us", path: "/about-us" },
    { name: "Blogs", path: "/blogpage" },
    { name: "User Login", path: "/register" },
  ];

  const handleClose = () => setMenuOpen(false);

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`${Style.overlay} ${menuOpen ? Style.show : ""}`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Sidebar drawer */}
      <nav
        className={`${Style.sidebar} ${menuOpen ? Style.active : ""}`}
        aria-label="Mobile navigation"
        aria-modal="true"
        role="dialog"
      >
        {/* Close button */}
        <button className={Style.closeBtn} onClick={handleClose} aria-label="Close menu">
          ✕
        </button>

        <ul className={Style.NavList}>
          {navData.map((menu, index) => (
            <li key={index} className={Style.NavItem}>
              <div
                className={Style.MenuLink}
                onClick={() => menu.categories && toggleDropdown(index)}
              >
                {menu.categories ? (
                  <span>{menu.name}</span>
                ) : (
                  <Link to={menu.path} onClick={handleClose}>
                    {menu.name}
                  </Link>
                )}
                {menu.categories && (
                  <span
                    className={`${Style.DropArrow} ${
                      openDropdown === index ? Style.open : ""
                    }`}
                    aria-hidden="true"
                  >
                    ▼
                  </span>
                )}
              </div>

              {menu.categories && (
                <ul
                  className={`${Style.Dropdown} 
                    ${openDropdown === index ? Style.showDropdown : ""} 
                    ${menu.name === "India Tours" ? Style.indiaDropdown : ""} 
                    ${menu.name === "Asia Tours" ? Style.asiaDropdown : ""} 
                    ${menu.name === "Reach Us" ? Style.reachDropdown : ""}`}
                >
                  {menu.categories.map((cat, i) => {
                    const subCategoryKey =
                      menu.name === "India Tours" ? cat.id : cat._id;

                    return (
                      <li key={i} className={Style.DropItem}>
                        {menu.name === "India Tours" && (
                          <Link
                            to={`/india-tours/${cat.id}/${slugify(
                              cat.region_name
                            )}`}
                            className={Style.IndiaLink}
                            onClick={handleClose}
                          >
                            {cat.region_name}
                          </Link>
                        )}
                        {menu.name === "Asia Tours" && (
                          <>
                            <h2
                              className={Style.AsiaHeading}
                              onClick={() =>
                                setOpenSubCategory(
                                  openSubCategory === subCategoryKey
                                    ? null
                                    : subCategoryKey
                                )
                              }
                            >
                              <Link
                                to={`/asia-tours/${slugify(cat.country_name)}`}
                                className={Style.AsiaLink}
                                onClick={handleClose}
                              >
                                {cat.country_name}
                              </Link>
                            </h2>

                            {openSubCategory === cat._id &&
                              countriesData
                                .filter(
                                  (c) =>
                                    String(c.category_id) === String(cat._id)
                                )
                                .map((country) => (
                                  <ul
                                    key={country._id}
                                    className={Style.StateList}
                                  >
                                    <li>
                                      <Link
                                        to={`/asia-tours/${
                                          cat.asiaId
                                        }/${slugify(
                                          cat.country_name
                                        )}/${slugify(country.country_name)}`}
                                        className={Style.AsiaCountryLink}
                                        onClick={handleClose}
                                      >
                                        {country.country_name}
                                      </Link>
                                    </li>
                                  </ul>
                                ))}
                          </>
                        )}

                        {(menu.name === "Reach Us" ||
                          menu.name === "Landing Pages") && (
                          <Link
                            to={cat.path}
                            className={Style.ReachUsLink}
                            onClick={() => {
                              toggleDropdown(null);
                              handleClose();
                            }}
                          >
                            {cat.name}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* CTA buttons at bottom */}
        <div className={Style.HeaderRight}>
          <Link
            to="/enquiry-form"
            className={Style.PlanTripBtn}
            onClick={handleClose}
          >
            ✈ Plan Your Trip
          </Link>
          <Link
            to="/payment"
            className={Style.PlanTripBtn}
            onClick={handleClose}
            style={{ background: "linear-gradient(135deg, #1d4ed8, #1e40af)" }}
          >
            💳 Pay Now
          </Link>
          <Link
            to="/shop"
            className={Style.PlanTripBtn}
            onClick={handleClose}
            style={{ background: "linear-gradient(135deg, #047857, #065f46)" }}
          >
            🛍 Shop With Us
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
