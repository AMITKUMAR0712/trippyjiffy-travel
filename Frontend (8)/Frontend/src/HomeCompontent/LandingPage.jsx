import React, { useEffect, useMemo, useState } from "react";
import Style from "../Style/LandingPage.module.scss";

import logo from "../Img/trippylogo.png";
import Banner1 from "../Img/people-doi-pha-tang-against-sky-sunrise_1048944-4357386.jpeg";
import Banner2 from "../Img/hiker-looking-mountains-from-great-wall-china-sunset_1048944-9830948.jpeg";
import Banner3 from "../Img/l1.jpeg";

import Certificates1 from "../Img/Certificates1.jpeg";
import Certificates2 from "../Img/Certificates2.jpeg";

import InsiderDealsForm from "../Page/InsiderDealsForm";

import { createPortal } from "react-dom";

const LandingPage = () => {
  const [showEnquiry, setShowEnquiry] = useState(false);
  const slides = useMemo(
    () => [
      { img: Banner1, tag: "Handpicked Stays" },
      { img: Banner2, tag: "Curated Experiences" },
      { img: Banner3, tag: "Smooth Transfers" },
    ],
    []
  );

  const enquiryImages = useMemo(
    () => [
      {
        src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
        alt: "Mountain travel",
      },
      {
        src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
        alt: "Beach travel",
      },
      {
        src: "https://images.unsplash.com/photo-1526779259212-939e64788e3c?auto=format&fit=crop&w=1200&q=80",
        alt: "City travel",
      },
    ],
    []
  );

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => window.scrollTo(0, 0), []);

  useEffect(() => {
    const t = setInterval(() => {
      setActiveSlide((p) => (p + 1) % slides.length);
    }, 3500);
    return () => clearInterval(t);
  }, [slides.length]);

  const scrollToId = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const callNow = (number) => {
    window.location.href = `tel:${number}`;
  };

  const mailNow = (email) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className={Style.tjBody}>
      {showEnquiry && createPortal(
        <div className={Style.modalOverlay} onClick={() => setShowEnquiry(false)}>
          <div className={Style.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={Style.closeBtn} onClick={() => setShowEnquiry(false)}>✕</button>
            <InsiderDealsForm context="Landing Page Modal" />
          </div>
        </div>,
        document.body
      )}

      <div className={Style.pageContent}>
        {/* ================= NAV ================= */}
        <header className={Style.tjNav}>
          <div className={Style.tjNavLeft}>
            <button
              type="button"
              className={Style.brandLink}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <div className={Style.tjLogoWrap}>
                <img src={logo} alt="TrippyJiffy" className={Style.tjLogoImg} />
              </div>
            </button>

            <div>
              <div className={Style.tjLogoText}>TrippyJiffy</div>
              <div className={Style.tjLogoCaption}>Trips that just click.</div>
            </div>
          </div>

          <nav className={Style.tjNavLinks}>
            <button type="button" onClick={() => scrollToId("about")}>About</button>
            <button type="button" onClick={() => scrollToId("why")}>Why Us</button>
            <button type="button" onClick={() => scrollToId("team")}>Team</button>
            <button type="button" onClick={() => scrollToId("certs")}>Certificates</button>
            <button type="button" onClick={() => scrollToId("contact")}>Contact</button>
          </nav>

          <div className={Style.tjNavRight}>
            <button
              type="button"
              className={Style.tjNavPhone}
              onClick={() => callNow("+919870210896")}
            >
              📞 +91 98702 10896
            </button>

            <button
              onClick={() => setShowEnquiry(true)}
              className={`${Style.tjBtn} ${Style.tjBtnPrimary}`}
              type="button"
            >
              Get Free Quote
            </button>
          </div>
        </header>

        <main>
          {/* ================= HERO ================= */}
          <section className={Style.tjHero}>
            <div className={Style.tjHeroLeft}>
              <div className={Style.tjPill}>✈️ Google Ads Exclusive Offer · Limited Slots</div>

              <h1 className={Style.heroTitle}>
                Custom-Made Trips <span className={Style.tjAccent}>at Honest Prices.</span>
              </h1>

              <p className={Style.tjHeroSub}>
                From weekend getaways to international escapes – TrippyJiffy curates end-to-end trips
                with stays, transfers, activities & more.
              </p>

              <ul className={Style.tjHeroBullets}>
                <li>✔ 100% customized itineraries</li>
                <li>✔ No hidden charges, transparent pricing</li>
                <li>✔ Dedicated Trip Specialist for WhatsApp support</li>
              </ul>

              <div className={Style.tjHeroMeta}>
                <div>
                  <div className={Style.tjHeroMetaValue}>10K+</div>
                  <div className={Style.tjHeroMetaLabel}>Happy Travellers</div>
                </div>
                <div>
                  <div className={Style.tjHeroMetaValue}>4.9★</div>
                  <div className={Style.tjHeroMetaLabel}>Average Rating</div>
                </div>
                <div>
                  <div className={Style.tjHeroMetaValue}>50+</div>
                  <div className={Style.tjHeroMetaLabel}>Destinations</div>
                </div>
              </div>

              <div className={Style.quickLinksRow}>
                <button
                  type="button"
                  className={`${Style.tjBtn} ${Style.tjBtnPrimary}`}
                  onClick={() => scrollToId("about")}
                >
                  Explore Destinations
                </button>
                <button
                  type="button"
                  className={`${Style.tjBtn} ${Style.tjBtnOutline}`}
                  onClick={() => scrollToId("tj-enquiry")}
                >
                  Pay Now
                </button>
                <button
                  type="button"
                  className={`${Style.tjBtn} ${Style.tjBtnOutline}`}
                  onClick={() => scrollToId("tj-enquiry")}
                >
                  Shop With Us
                </button>
              </div>
            </div>

            <div className={Style.tjHeroRight}>
              <div className={Style.tjHeroImageCard}>
                <div className={Style.tjHeroImageTag}>{slides[activeSlide].tag}</div>

                <div className={Style.tjHeroImageStage}>
                  {slides.map((s, idx) => (
                    <img
                      key={idx}
                      src={s.img}
                      alt={s.tag}
                      className={`${Style.tjHeroImage} ${
                        idx === activeSlide ? Style.isActive : Style.isHidden
                      }`}
                    />
                  ))}
                </div>

                <div className={Style.tjMiniStrip}>
                  {slides.map((s, i) => (
                    <button
                      key={i}
                      className={`${Style.tjMiniThumb} ${i === activeSlide ? Style.active : ""}`}
                      onClick={() => setActiveSlide(i)}
                      type="button"
                      aria-label={`Slide ${i + 1}`}
                    >
                      <img src={s.img} alt={s.tag} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Enquiry */}
              <div id="tj-enquiry" className={Style.enquiryFullWidth}>
                <div className={Style.tjFormBadge}>Just 20 seconds to fill ✨</div>

                <div className={Style.enquiryGridVertical}>
                  <div className={Style.tjFormCardWide}>
                    <InsiderDealsForm context="Landing Page Section" />
                  </div>

                  <div className={Style.enquiryMedia}>
                    <div className={Style.mediaTop}>
                      <img src={enquiryImages[0].src} alt={enquiryImages[0].alt} />
                    </div>

                    <div className={Style.mediaBottom}>
                      <img src={enquiryImages[1].src} alt={enquiryImages[1].alt} />
                      <img src={enquiryImages[2].src} alt={enquiryImages[2].alt} />
                    </div>

                    <div className={Style.mediaCaption}>
                      🌍 Plan smart. Travel better.
                      <button
                        type="button"
                        className={Style.mediaCta}
                        onClick={() => scrollToId("tj-enquiry")}
                      >
                        Get a free itinerary →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ================= ABOUT ================= */}
          <section id="about" className={Style.section}>
            <div className={Style.sectionHead}>
              <h2>About TrippyJiffy</h2>
              <p>
                TrippyJiffy (Neelasha Travels LLP) is your go-to travel and tourism booking company —
                making travel dreams come true effortlessly.
              </p>
            </div>

            <div className={Style.aboutGrid}>
              <div className={Style.aboutCard}>
                <h3>What we do</h3>
                <p>
                  We offer hotel bookings, holiday packages, and custom travel itineraries. Beach
                  vacation, treks, culture trips — seamless planning guaranteed.
                </p>
                <p className={Style.muted}>
                  Expert advice + competitive pricing = perfect partner for your next journey.
                </p>
              </div>

              <div className={Style.aboutCard}>
                <h3>Experts in Customizing Your Trip</h3>
                <ul className={Style.points}>
                  <li><b>Staying connected:</b> Quick WhatsApp answers, personalized help.</li>
                  <li><b>Seamless coordination:</b> Planning + support throughout the trip.</li>
                  <li><b>Shaping experiences:</b> Less research, more enjoyment.</li>
                  <li><b>Solving challenges:</b> On-trip issues resolved fast.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* ================= WHY US ================= */}
          <section id="why" className={Style.sectionAlt}>
            <div className={Style.sectionHead}>
              <h2>Why Travellers Love TrippyJiffy</h2>
              <p>Classic planning. Modern execution. Transparent pricing.</p>
            </div>

            <div className={Style.featureGrid}>
              {[
                { t: "Transparent Pricing", d: "No hidden charges – clear pricing always.", i: "💎" },
                { t: "End-to-End Planning", d: "Stays, transfers, activities — complete.", i: "🧭" },
                { t: "Local Expertise", d: "Verified partners & on-ground support.", i: "🌍" },
                { t: "24/7 Support", d: "Trip specialist on WhatsApp anytime.", i: "📲" },
              ].map((x, idx) => (
                <div key={idx} className={Style.featureCard}>
                  <div className={Style.featureIcon}>{x.i}</div>
                  <h3>{x.t}</h3>
                  <p>{x.d}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ================= TEAM ================= */}
          <section id="team" className={Style.section}>
            <div className={Style.sectionHead}>
              <h2>Meet Our Team</h2>
              <p>Passionate professionals crafting personalized journeys.</p>
            </div>

            <div className={Style.teamGrid}>
              <div className={Style.teamCard}>
                <div className={Style.avatar}>AS</div>
                <div className={Style.teamInfo}>
                  <h3>Arpita Srivastava</h3>
                  <div className={Style.role}>Managing Director</div>
                  <p>
                    10+ years in travel industry. Global experience, strong operations & customer insights,
                    training and mentoring across borders. Turning travel dreams into realities.
                  </p>
                </div>
              </div>

              <div className={Style.teamCard}>
                <div className={Style.avatar}>SS</div>
                <div className={Style.teamInfo}>
                  <h3>Shailee Srivastava</h3>
                  <div className={Style.role}>Director Operations &amp; Sales</div>
                  <p>
                    11+ years experience. Sales strategy + operational excellence, strong team leadership,
                    result-oriented execution across departments.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ================= CERTS ================= */}
          <section id="certs" className={Style.sectionAlt}>
            <div className={Style.sectionHead}>
              <h2>Ministry of Tourism Certificates</h2>
              <p>Government-issued tourism registration documents for verification & compliance.</p>
            </div>

            <div className={Style.certsGrid}>
              <div className={Style.certCard}>
                <img className={Style.certImg} src={Certificates1} alt="Certificate 1" />
              </div>
              <div className={Style.certCard}>
                <img className={Style.certImg} src={Certificates2} alt="Certificate 2" />
              </div>
            </div>
          </section>

          {/* ================= CONTACT ================= */}
          <section id="contact" className={Style.section}>
            <div className={Style.sectionHead}>
              <h2>Contact Information</h2>
              <p>We’re here to help you plan a smooth, memorable journey.</p>
            </div>

            <div className={Style.contactGrid}>
              <div className={Style.contactCard}>
                <h3>Email</h3>
                <button
                  type="button"
                  className={Style.contactBtnLink}
                  onClick={() => mailNow("travelqueries@trippyjiffy.com")}
                >
                  travelqueries@trippyjiffy.com
                </button>
              </div>

              <div className={Style.contactCard}>
                <h3>Phone</h3>
                <div className={Style.contactPhones}>
                  <button type="button" className={Style.contactBtnLink} onClick={() => callNow("+919870210896")}>
                    +91 98702 10896
                  </button>
                  <button type="button" className={Style.contactBtnLink} onClick={() => callNow("+918527454549")}>
                    +91 85274 54549
                  </button>
                </div>
              </div>

              <div className={Style.contactCard}>
                <h3>Address</h3>
                <p>Sector 1, Vikas Nagar Lucknow 226022 (India)</p>
              </div>
            </div>
          </section>
        </main>

        {/* ================= FOOTER ================= */}
        <footer className={Style.footer}>
          <div className={Style.footerTop}>
            <div className={Style.footerBrand}>
              <div className={Style.footerLogoRow}>
                <img src={logo} alt="TrippyJiffy" className={Style.footerLogo} />
                <div>
                  <div className={Style.footerName}>TrippyJiffy</div>
                  <div className={Style.footerTagline}>
                    Where unforgettable memories don't come with a price tag!
                  </div>
                </div>
              </div>

              <div className={Style.socialRow}>
                <span className={Style.socialLabel}>Follow Us:</span>
                <div className={Style.socialLinks}>
                  <span>Instagram</span>
                  <span>Facebook</span>
                  <span>YouTube</span>
                </div>
              </div>
            </div>

            <div className={Style.footerCols}>
              <div className={Style.footerCol}>
                <h4>Quick Links</h4>
                <button type="button" onClick={() => scrollToId("about")}>Blogs</button>
                <button type="button" onClick={() => scrollToId("why")}>Customer’s Valuable Feedbacks</button>
                <button type="button" onClick={() => scrollToId("about")}>About Us</button>
                <button type="button" onClick={() => setShowEnquiry(true)}>Plan Your Trip</button>
                <button type="button" onClick={() => scrollToId("tj-enquiry")}>Pay Now</button>
                <button type="button" onClick={() => scrollToId("contact")}>Privacy Policy</button>
                <button type="button" onClick={() => scrollToId("contact")}>Terms &amp; Conditions</button>
              </div>

              <div className={Style.footerCol}>
                <h4>Tours</h4>
                <button type="button" onClick={() => scrollToId("about")}>India Tours</button>
                <button type="button" onClick={() => scrollToId("about")}>Asia Tours</button>
                <button type="button" onClick={() => scrollToId("about")}>Weekend Tour</button>
              </div>

              <div className={Style.footerCol}>
                <h4>Reach Us</h4>
                <button type="button" onClick={() => scrollToId("contact")}>Contact Us</button>
                <button type="button" onClick={() => scrollToId("contact")}>Business With Us</button>
                <button type="button" onClick={() => scrollToId("tj-enquiry")}>Shop With Us</button>
              </div>

              <div className={Style.footerCol}>
                <h4>Contact</h4>
                <button type="button" className={Style.footerBtnLink} onClick={() => mailNow("travelqueries@trippyjiffy.com")}>
                  travelqueries@trippyjiffy.com
                </button>
                <button type="button" className={Style.footerBtnLink} onClick={() => callNow("+919870210896")}>
                  9870210896
                </button>
                <button type="button" className={Style.footerBtnLink} onClick={() => callNow("+918527454549")}>
                  8527454549
                </button>
                <div className={Style.footerAddr}>Sector 1, Vikas Nagar Lucknow 226022 (India)</div>
              </div>
            </div>
          </div>

          <div className={Style.footerBottom}>
            <p>© {new Date().getFullYear()} TrippyJiffy. All rights reserved.</p>
            <p>Powered by curated experiences & honest pricing.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
