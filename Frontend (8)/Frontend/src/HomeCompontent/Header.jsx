import React, { useState, memo, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import Sidebar from "./Sidebar";
import Style from "../Style/Header.module.scss";
import logo from "../Img/trippylogo.png";
import Enquiry from "../Page/Enquiry";
import DropDown from "../HomeCompontent/DropDown.jsx";
import axios from "axios";

const ScrollProgressBar = () => {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const totalScroll = document.documentElement.scrollTop;
                    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                    setScrollProgress((totalScroll / windowHeight) * 100);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            className={Style.scrollBar}
            style={{ width: `${scrollProgress}%` }}
        ></div>
    );
};

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [active, setActive] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [showEnquiry, setShowEnquiry] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if token exists to indicate active login state
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const baseURL = import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com";
    const [indiaTours, setIndiaTours] = useState([]);
    const [asiaTours, setAsiaTours] = useState([]);

    const closeTimeout = React.useRef(null);

    const toggleDropdown = (index, isClick = false) => {
        if (closeTimeout.current) {
            clearTimeout(closeTimeout.current);
            closeTimeout.current = null;
        }

        if (index === null) {
            if (isClick) {
                setOpenDropdown(null);
            } else {
                closeTimeout.current = setTimeout(() => {
                    setOpenDropdown(null);
                }, 300);
            }
        } else {
            if (isClick && openDropdown === index) {
                setOpenDropdown(null);
            } else {
                setOpenDropdown(index);
            }
        }
    };

    useEffect(() => {
        const fetchIndiaTours = async () => {
            try {
                const res = await axios.get(`${baseURL}/api/category-india/get`);
                const data = Array.isArray(res.data) ? res.data : [];
                const formatted = data.map((item) => ({
                    id: item.id,
                    name: item.region_name,
                    path: `/india-tours/${item.region_name
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`,
                }));
                setIndiaTours(formatted);
            } catch (error) {
                console.error("Error fetching India Tours:", error);
                setIndiaTours([]);
            }
        };
        fetchIndiaTours();
    }, [baseURL]);

    useEffect(() => {
        const fetchAsiaTours = async () => {
            try {
                const res = await axios.get(`${baseURL}/api/asia/get`);
                const data = Array.isArray(res.data) ? res.data : [];
                const formatted = data.map((item) => ({
                    id: item.id,
                    name: item.country_name,
                    path: `/asia-tours/${item.country_name
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`,
                    images: item.images || [],
                }));
                setAsiaTours(formatted);
            } catch (error) {
                console.error("Error fetching Asia Tours:", error);
                setAsiaTours([]);
            }
        };
        fetchAsiaTours();
    }, [baseURL]);

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setActive(window.scrollY > 30);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navData = [
        { name: "Home", path: "/" },
        { name: "India Tours", categories: indiaTours },
        { name: "Overseas Tours", categories: asiaTours },
        {
            name: "Landing Pages",
            categories: [
                { name: "Upcoming Trips", path: "/upcoming" },
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
    ];

    return (
        <>
            <header className={`${Style.Header} ${active ? Style.active : ""}`}>
                <div className={Style.wrapper}>
                    <div className={Style.HeaderFlex}>
                        <div className={Style.HeaderLeft}>
                            <Link to="/">
                                <img
                                    src={logo}
                                    alt="Trippy Travels Logo"
                                    width="160"
                                    height="60"
                                    decoding="async"
                                />
                            </Link>
                        </div>

                        <div className={Style.HeaderRight}>
                            <DropDown
                                navData={navData}
                                openDropdown={openDropdown}
                                toggleDropdown={toggleDropdown}
                            />

                            <div>
                                <button
                                    className={Style.PlanTripBtn}
                                    onClick={() => setShowEnquiry(true)}
                                >
                                    Plan Your Trip
                                </button>
                                {showEnquiry && createPortal(
                                    <div className={Style.modalOverlay}>
                                        <div className={Style.modalContent}>
                                            <button
                                                className={Style.closeBtn}
                                                onClick={() => setShowEnquiry(false)}
                                            >
                                                X
                                            </button>
                                            <Enquiry isModal={true} />
                                        </div>
                                    </div>,
                                    document.body
                                )}
                            </div>

                            <div className={Style.Payment}>
                                <Link to="/payment">Pay Now</Link>
                            </div>
                            <div className={Style.Payment}>
                                <Link to="/shop">Shop With Us</Link>
                            </div>

                            <div className={Style.HeaderUser}>
                                <Link to={isLoggedIn ? "/user" : "/register"} aria-label={isLoggedIn ? "Dashboard" : "Register"}>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                                        <FaUserCircle
                                            size={26}
                                            color={isLoggedIn ? "var(--primary-color, #d35400)" : "#64748b"}
                                            aria-hidden="true"
                                            style={{ transition: "all 0.3s ease" }}
                                        />
                                        <span style={{
                                            fontSize: "11px",
                                            fontWeight: "600",
                                            marginTop: "2px",
                                            color: isLoggedIn ? "var(--primary-color, #d35400)" : "#64748b"
                                        }}>
                                            {isLoggedIn ? "Dashboard" : "Login"}
                                        </span>
                                        {isLoggedIn && (
                                            <span style={{
                                                position: "absolute",
                                                bottom: "14px",
                                                right: 0,
                                                width: "10px",
                                                height: "10px",
                                                backgroundColor: "#22c55e",
                                                border: "2px solid #fff",
                                                borderRadius: "50%"
                                            }} />
                                        )}
                                    </div>
                                </Link>
                            </div>
                        </div>

                        <div
                            className={`${Style.Headertoggle} ${menuOpen ? Style.open : ""}`}
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>

                <ScrollProgressBar />
            </header>

            <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        </>
    );
};

export default memo(Header);
