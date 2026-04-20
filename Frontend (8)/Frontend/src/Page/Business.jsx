import React, { memo, useState } from "react";
import Style from "../Style/Business.module.scss";
import BusinessImage from "../Img/BusinessDisk 1.jpg";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { toast } from "sonner";

const Business = () => {


  const [formData, setFormData] = useState({
    full_name: "",
    company_name: "",
    business_type: "",
    email: "",
    phone: "",
    website_links: "",
    office_address: "",
    city: "",
    country: "",
  });

  const baseURL = import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com";

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullPhone = formData.phone.replace(/\D/g, "");
    if (!/^\d{6,15}$/.test(fullPhone)) {
      toast.error("Please enter a valid phone number (6–15 digits).");
      return;
    }

    try {
      const res = await fetch(`${baseURL}/api/BussianContent/post/business`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          phone: fullPhone,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Application submitted! Our team will reach out within 24 hours. ✅");
        setFormData({
          full_name: "",
          company_name: "",
          business_type: "",
          email: "",
          phone: "",
          website_links: "",
          office_address: "",
          city: "",
          country: "",
        });
      } else {
        toast.error("Error: " + (data.message || data.error));
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={Style.Business}>
      {/* ⭐ Helmet for Dynamic Title & SEO */}
   <Helmet>
  <title>Business With Us | TrippyJiffy</title>

  <meta
    name="description"
    content="Partner with TrippyJiffy to grow your travel business. Submit your details to collaborate with India's leading travel company."
  />

  <meta
    name="keywords"
    content="business, travel agency, partner, trippyjiffy, tourism, collaboration"
  />

  {/* ✅ CANONICAL URL */}
  <link rel="canonical" href="https://trippyjiffy.com/business-with-us" />
</Helmet>


      {/* Banner */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className={Style.BusinessImage}
      >
        <img src={BusinessImage} alt="Banner" />

        <div className={Style.BusinessWith}>
          <h1>Partner with TrippyJiffy</h1>
        </div>
      </motion.div>

      {/* Wrapper */}
      <div className={Style.wrapper}>
        <div className={Style.BusinessFlex}>
          {/* LEFT FORM */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className={Style.BusinessLeft}
          >
            <div className={Style.ContactFormWrapper}>
              <h2>Business Form</h2>

              <form className={Style.ContactForm} onSubmit={handleSubmit}>
                {[
                  {
                    id: "full_name",
                    label: "Full Name",
                    type: "text",
                    required: true,
                  },
                  {
                    id: "company_name",
                    label: "Company Name",
                    type: "text",
                    required: true,
                  },
                  {
                    id: "email",
                    label: "Email",
                    type: "email",
                    required: true,
                  },
                  {
                    id: "office_address",
                    label: "Office Address",
                    type: "text",
                    required: true,
                  },
                  { id: "city", label: "City", type: "text", required: true },
                  {
                    id: "country",
                    label: "Country",
                    type: "text",
                    required: true,
                  },
                  {
                    id: "website_links",
                    label: "Website / Social Links",
                    type: "text",
                  },
                ].map((field) => (
                  <div className={Style.FormGroup} key={field.id}>
                    <label htmlFor={field.id}>{field.label}</label>
                    <input
                      type={field.type}
                      id={field.id}
                      value={formData[field.id]}
                      onChange={handleChange}
                      required={field.required}
                    />
                  </div>
                ))}

                {/* Business Type */}
                <div className={Style.FormGroup}>
                  <label htmlFor="business_type">Business Type</label>
                  <select
                    id="business_type"
                    value={formData.business_type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Travel Agency">Travel Agency</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Transport Provider">
                      Transport Provider
                    </option>
                    <option value="Influencer">Influencer</option>
                    <option value="Vendor">Vendor</option>
                    <option value="Corporate Client">Corporate Client</option>
                  </select>
                </div>

                {/* Phone Number */}
                <div className={Style.FormGroup}>
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                    pattern="\d{6,15}"
                    title="Phone number should be 6–15 digits"
                  />
                </div>

                <button type="submit" className={Style.SubmitBtn}>
                  Submit Application
                </button>
              </form>
            </div>
          </motion.div>

          {/* RIGHT CONTENT */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={Style.BusinessRight}
          >
            <h2>A committed initiative by TrippyJiffy.</h2>
            <p>
              We understand that many travel companies across India and abroad
              are constantly looking for the right business partner who can help
              them multiply their client base year after year.
            </p>
            <p>
              Several international travel companies still do not actively
              promote India…
            </p>
            <p>We help you expand your presence with confidence.</p>
            <p>Even a single booking is enough to show you how we work.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default memo(Business);
