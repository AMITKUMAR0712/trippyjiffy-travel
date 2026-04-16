import React, { useState } from "react";
import Style from "../Style/Contact.module.scss";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SEO from "../utils/SEO";
import { motion } from "framer-motion";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    contact_via_email: false,
    contact_via_phone: false,
    contact_via_whatsapp: false,
  });

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullPhone = formData.phone.replace(/\D/g, "");
    if (!/^\d{6,15}$/.test(fullPhone)) {
      toast.error("Please enter a valid phone number (6–15 digits).");
      return;
    }

    try {
      const res = await fetch(`${baseURL}/api/contact/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          phone: fullPhone,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Message sent successfully! We'll get back to you soon. ✅");
        setFormData({
          full_name: "",
          email: "",
          phone: "",
          contact_via_email: false,
          contact_via_phone: false,
          contact_via_whatsapp: false,
        });
      } else {
        toast.error("Error: " + data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={Style.Contact}>
      {/* ✅ DYNAMIC TITLE + DESCRIPTION */}
      <SEO 
        title="Contact Us"
        description="Get in touch with TrippyJiffy for travel assistance, custom tour packages, hotel bookings, and 24/7 support. We're here to help you plan your perfect journey."
        keywords="contact TrippyJiffy, travel support, travel booking India, tour assistance"
        canonicalUrl={window.location.href}
      />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "mainEntity": {
            "@type": "Organization",
            "name": "TrippyJiffy",
            "contactPoint": [
              {
                "@type": "ContactPoint",
                "telephone": "+91-9870210896",
                "contactType": "customer service"
              },
              {
                "@type": "ContactPoint",
                "telephone": "+91-8527454549",
                "contactType": "reservations"
              }
            ]
          }
        })}
      </script>


      {/* HEADER IMAGE */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className={Style.ContactImg}
      >
        <img
          src="https://wallpapers.com/images/hd/wooden-blocks-contact-us-vh58juahu6kzh7i8.jpg"
          alt="contact"
        />
      </motion.div>

      {/* WRAPPER */}
      <div className={Style.wrapper}>
        <div className={Style.ContactFlex}>
          {/* LEFT - FORM */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className={Style.ContactLeft}
          >
            <div className={Style.ContactPlan}>
              <h2>We'd love to hear from you</h2>
              <h1>Contact Us</h1>
            </div>

            <form className={Style.ContactForm} onSubmit={handleSubmit}>
              {/* FULL NAME */}
              <div className={Style.FormGroup}>
                <label htmlFor="full_name">Full Name</label>
                <input
                  type="text"
                  id="full_name"
                  placeholder="Enter your full name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* EMAIL */}
              <div className={Style.FormGroup}>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* PHONE */}
              <div className={Style.FormGroup}>
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* CONTACT METHODS */}
              <div className={Style.FormGroupCheckbox}>
                <input
                  type="checkbox"
                  id="contact_via_email"
                  checked={formData.contact_via_email}
                  onChange={handleChange}
                />
                <label htmlFor="contact_via_email">Contact me via Email</label>
              </div>

              <div className={Style.FormGroupCheckbox}>
                <input
                  type="checkbox"
                  id="contact_via_phone"
                  checked={formData.contact_via_phone}
                  onChange={handleChange}
                />
                <label htmlFor="contact_via_phone">Contact me via Call</label>
              </div>

              <div className={Style.FormGroupCheckbox}>
                <input
                  type="checkbox"
                  id="contact_via_whatsapp"
                  checked={formData.contact_via_whatsapp}
                  onChange={handleChange}
                />
                <label htmlFor="contact_via_whatsapp">
                  Contact me via WhatsApp
                </label>
              </div>

              {/* SUBMIT */}
              <button type="submit" className={Style.SubmitBtn}>
                Send Message
              </button>
            </form>
          </motion.div>

          {/* RIGHT - INFO */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={Style.ContactRight}
          >
            <h2>Contact Information</h2>
            <p>
              <strong>Email:</strong>
              <br />
              <Link to="mailto:travelqueries@trippyjiffy.com">
                travelqueries@trippyjiffy.com
              </Link>
            </p>
            <p>
              <strong>Phone:</strong>
              <br />
              <Link to="tel:+919870210896">+91 98702 10896</Link>
              <br />
              <Link to="tel:+918527454549">+91 85274 54549</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
