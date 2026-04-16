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

  return (
    <>
      <div
        className={`${Style.overlay} ${menuOpen ? Style.show : ""}`}
        onClick={() => setMenuOpen(false)}
      ></div>

      <div
        className={`${Style.sidebar} ${menuOpen ? Style.active : ""}`}
      >
        <button className={Style.closeBtn} onClick={() => setMenuOpen(false)}>
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
                  <Link to={menu.path} onClick={() => setMenuOpen(false)}>
                    {menu.name}
                  </Link>
                )}
                {menu.categories && (
                  <span
                    className={`${Style.DropArrow} ${
                      openDropdown === index ? Style.open : ""
                    }`}
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
                            onClick={() => setMenuOpen(false)}
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
                                onClick={() => setMenuOpen(false)}
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
                                        onClick={() => setMenuOpen(false)}
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
                              setMenuOpen(false);
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

        <div className={Style.HeaderRight}>
          <Link
            to="/enquiry-form"
            className={Style.PlanTripBtn}
            onClick={() => setMenuOpen(false)}
          >
            Plan Your Trip
          </Link>
          <Link
            to="/shop"
            className={Style.PlanTripBtn}
            onClick={() => setMenuOpen(false)}
          >
            Shop With Us
          </Link>
          <Link
            to="/payment"
            className={Style.PlanTripBtn}
            onClick={() => setMenuOpen(false)}
          >
            Pay Now
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
