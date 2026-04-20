import React, { useState } from "react";
import Style from "../Style/ContactUsForm.module.scss";

const ContactUsForm = ({ title = "Contact Us", variant = "default" }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    message: "",
  });

  const baseURL = import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com";

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullPhone = formData.phone.replace(/\D/g, "");
    if (!/^\d{6,15}$/.test(fullPhone)) {
      alert("Please enter a valid phone number (6–15 digits).");
      return;
    }

    try {
      const res = await fetch(`${baseURL}/api/contact/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          phone: fullPhone,
          message: formData.message,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Message sent successfully ✅");
        setFormData({
          full_name: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong ❌");
    }
  };

  return (
    <div
      className={`${Style.contactFormWrapper} ${variant === "glass" ? Style.glass : ""
        }`}
    >
      <h3 className={Style.formTitle}>{title}</h3>
      <form className={Style.contactForm} onSubmit={handleSubmit}>
        <div className={Style.formGroup}>
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

        <div className={Style.formGroup}>
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

        <div className={Style.formGroup}>
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

        <div className={Style.formGroup}>
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            placeholder="Tell us about your travel plans"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className={Style.submitBtn}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default ContactUsForm;
