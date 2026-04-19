import React from "react";
import Style from "../Style/About.module.scss";
import AboutImg from "../Img/travel.jpg";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaWhatsapp, FaComments, FaHeart, FaPencilAlt } from "react-icons/fa";
import Director from "../Img/director2.jpeg";
import Director1 from "../Img/director1.jpeg";
import Certificates1 from "../Img/Certificates1.jpeg";
import Certificates2 from "../Img/Certificates2.jpeg";

import { Helmet } from "react-helmet-async";
import SEO from "../utils/SEO";

const About = () => {


  return (
    <div className={Style.About}>

      <SEO
        title="About Us"
        description="Learn more about TrippyJiffy (Neelasha Travels LLP), your trusted partner for hotel bookings, holiday packages, and custom travel itineraries across India and Asia."
        keywords="TrippyJiffy, Neelasha Travels LLP, travel agency India, holiday packages, custom trips, about TrippyJiffy"
        canonicalUrl={window.location.href}
      />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "TrippyJiffy",
          "url": "https://trippyjiffy.com",
          "logo": "https://trippyjiffy.com/logo.png",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-9870210896",
            "contactType": "customer service"
          }
        })}
      </script>
      <div className={Style.AboutBanner}>
        <div className={Style.AboutImage}>
          <img src={AboutImg} alt="About TrippyJiffy" />
        </div>
      </div>

      <div className={Style.wrapper}>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className={Style.Abouttrippy}
        >
          <h2>About Trippy Jiffy</h2>
          <p>
            TrippyJiffy (Neelasha Travels LLP) is your go-to travel and tourism
            booking company, dedicated to making your travel dreams come true
            effortlessly and efficiently.
          </p>
          <p>
            We offer a comprehensive range of services, including hotel
            bookings, holiday packages, and custom travel itineraries. Whether
            you're planning a relaxing beach vacation, an adventurous trek, or a
            cultural exploration, we ensure a seamless experience.
          </p>
          <p>
            Our expert travel advice and competitive pricing make us the perfect
            partner for your next journey.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 }
            }
          }}
          className={Style.AboutExperts}
        >
          <div className={Style.AboutTrip}>
            <h2>Experts in Customizing Your Trip</h2>

            <div className={Style.ExpertGrid}>
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className={Style.ExpertCard}>
                <FaWhatsapp className={Style.icon} />
                <div>
                  <h3>Staying connected</h3>
                  <p>
                    Get quick answers on WhatsApp — personalized travel help
                    based on your interests and needs.
                  </p>
                </div>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className={Style.ExpertCard}>
                <FaComments className={Style.icon} />
                <div>
                  <h3>Seamless coordination</h3>
                  <p>
                    We handle all planning & support you throughout the journey.
                  </p>
                </div>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className={Style.ExpertCard}>
                <FaHeart className={Style.icon} />
                <div>
                  <h3>Shaping experiences</h3>
                  <p>Less time researching, more time enjoying your trip.</p>
                </div>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className={Style.ExpertCard}>
                <FaPencilAlt className={Style.icon} />
                <div>
                  <h3>Solving challenges</h3>
                  <p>
                    We solve on-trip issues quickly so your experience stays
                    smooth.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>


        <div className={Style.AboutMeet}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2>Meet Our Team</h2>
            <h4>TrippyJiffy’s Most Valuable Asset</h4>
            <p>
              Our strength lies in passionate professionals who craft personalized
              travel experiences.
            </p>
            <h3>Leadership Team</h3>
          </motion.div>

          <div className={Style.AboutFlexmeet}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className={Style.AboutWrapDisk}
            >
              <img src={Director} alt="Arpita Srivastava" />
              <h2>Arpita Srivastava</h2>
              <p>
                With over a decade of experience in the travel industry, Arpita
                Srivastava brings a wealth of knowledge, passion, and global
                perspective to Trippy Jiffy. Having worked across diverse
                segments of travel, she has gained deep insights into customer
                experiences, destination management, and industry operations.
                Over the years, Arpita Srivastava has trained and mentored professionals
                across borders, empowering teams with the right skills and
                mindset to deliver exceptional travel experiences. Her
                understanding of aviation and travel systems further strengthens
                her ability to create seamless and innovative travel solutions
                for clients worldwide. Driven by a vision to make every journey
                memorable, Arpita continues to inspire her team to combine
                expertise with empathy. Turning travel dreams into beautiful
                realities.
              </p>
              <h2>Managing Director</h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={Style.AboutWrapDisk}
            >
              <img src={Director1} alt="Shailee Srivastava" />
              <h2>Shailee Srivastava</h2>
              <p>
                With over 11 years of experience in the travel industry,Shailee
                Shrivastava stands out as a dynamic leader who excels in both
                sales strategy and operational excellence. As the Director of
                Sales & Operations at Trippy Jiffy, she plays a pivotal role in
                driving business growth and ensuring seamless execution across
                all departments. Shailee Srivastava in-depth understanding of travel
                dynamics, coupled with her exceptional team management skills,
                enables her to lead high-performing teams that consistently
                achieve and surpass targets. Her strategic vision, strong
                operational insight, and result-oriented approach make her an
                indispensable part of the organization. Known for her ability to
                transform challenges into opportunities, Shailee Srivastava continues to
                inspire her team with her commitment, leadership, and passion
                for delivering outstanding travel experiences.
              </p>
              <h2>Director Operations & Sales</h2>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className={Style.AboutCertificates}
        >
          <div className={Style.AboutCertificatesDisk}>
            <h2>Ministry of Tourism Certificates</h2>
            <p>
              Official government-issued tourism registration documents for
              verification and compliance
            </p>
          </div>
          <div className={Style.AboutCertificatesFlex}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ ease: "easeOut" }}
              className={Style.AboutCertificatesLeft}
            >
              <img src={Certificates1} alt="Certificates1" />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ ease: "easeOut" }}
              className={Style.AboutCertificatesRight}
            >
              <img src={Certificates2} alt="Certificates2" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
