import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaPhoneAlt, FaEnvelope, FaPlaneDeparture, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";
import SEO from "../HomeCompontent/SEO";
import Style from "../Style/CustomizeTrip.module.scss";
import Banner from "../Img/Banner3.jpg";

const CustomizeTrip = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    destination: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const baseURL = import.meta.env.VITE_API_BASE_URL || "";
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${baseURL}/api/enquiry/post`, {
        ...formData,
        origin: "Dedicated Page",
        arrival_date: new Date().toISOString().split("T")[0],
        departure_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        hotel_category: "Custom Trip",
        no_of_adults: 2,
        no_of_children: 0,
        message: formData.message || "Custom Trip Request from dedicated page.",
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 5000);
    } catch (err) {
      console.error("Submit error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={Style.pageWrapper}>
      <SEO 
        title="Customize Your Dream Holiday | TrippyJiffy"
        description="Get a tailor-made holiday plan curated by our experts. Tell us your preferences and we'll design the perfect itinerary for you."
      />
      
      <div className={Style.heroSection}>
        <div className={Style.overlay}></div>
        <img src={Banner} alt="Travel Background" className={Style.bgImage} />
        
        <div className={Style.container}>
          <div className={Style.contentGrid}>
            <div className={Style.textContent}>
              <span className={Style.badge}>Exclusive Experience</span>
              <h1>Design Your <span>Dream</span> Journey</h1>
              <p>
                Why settle for a generic package when you can have a journey as unique as you? 
                Our travel experts craft personalized itineraries that match your style, pace, and passions.
              </p>
              
              <div className={Style.features}>
                <div className={Style.featureItem}>
                  <div className={Style.icon}><FaCheckCircle /></div>
                  <div>
                    <h4>Handpicked Stays</h4>
                    <p>Boutique hotels & luxury resorts curated for you.</p>
                  </div>
                </div>
                <div className={Style.featureItem}>
                  <div className={Style.icon}><FaCheckCircle /></div>
                  <div>
                    <h4>Local Insights</h4>
                    <p>Hidden gems and authentic experiences.</p>
                  </div>
                </div>
                <div className={Style.featureItem}>
                  <div className={Style.icon}><FaCheckCircle /></div>
                  <div>
                    <h4>24/7 Support</h4>
                    <p>Stress-free travel with our expert team.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={Style.formContainer}>
              {success ? (
                <div className={Style.successCard}>
                  <div className={Style.successIcon}>✓</div>
                  <h2>Request Received!</h2>
                  <p>Our travel specialist will reach out to you within 24 hours with a custom plan.</p>
                  <button onClick={() => navigate("/")} className={Style.homeBtn}>Back to Home</button>
                </div>
              ) : (
                <div className={Style.formCard}>
                  <div className={Style.formHeader}>
                    <h3>Get a Free Quote</h3>
                    <p>Tell us where you want to go!</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className={Style.form}>
                    <div className={Style.inputGroup}>
                      <label><FaUser /> Name</label>
                      <input 
                        type="text" 
                        name="name" 
                        placeholder="Your full name" 
                        value={formData.name}
                        onChange={handleChange}
                        required 
                      />
                    </div>

                    <div className={Style.grid}>
                      <div className={Style.inputGroup}>
                        <label><FaPhoneAlt /> Phone</label>
                        <input 
                          type="tel" 
                          name="phone" 
                          placeholder="Contact number" 
                          value={formData.phone}
                          onChange={handleChange}
                          required 
                        />
                      </div>
                      <div className={Style.inputGroup}>
                        <label><FaEnvelope /> Email</label>
                        <input 
                          type="email" 
                          name="email" 
                          placeholder="Email address" 
                          value={formData.email}
                          onChange={handleChange}
                          required 
                        />
                      </div>
                    </div>

                    <div className={Style.inputGroup}>
                      <label><FaMapMarkerAlt /> Destination</label>
                      <input 
                        type="text" 
                        name="destination" 
                        placeholder="Where do you want to go?" 
                        value={formData.destination}
                        onChange={handleChange}
                        required 
                      />
                    </div>

                    <div className={Style.inputGroup}>
                      <label><FaPlaneDeparture /> Special Requests (Optional)</label>
                      <textarea 
                        name="message" 
                        rows="3" 
                        placeholder="Any specific preferences or requirements?"
                        value={formData.message}
                        onChange={handleChange}
                      ></textarea>
                    </div>

                    <button type="submit" className={Style.submitBtn} disabled={loading}>
                      {loading ? "Processing..." : "Get My Free Plan"}
                    </button>
                    <p className={Style.formFooter}>No spam. No hidden costs. Just pure travel magic.</p>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeTrip;
