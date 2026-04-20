import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Style from "../Style/Adminlogin.module.scss";

const baseURL = import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("✅ ENV Base URL:", baseURL);
    console.log("📦 Request Body:", formData);

    try {
      const url = `${baseURL}/api/admin/login`;
      const res = await axios.post(url, formData);
      console.log("✅ Login Response:", res.data);

      if (res.data.success && res.data.admin) {
        localStorage.setItem("adminData", JSON.stringify(res.data.admin));
        setMessage("Login successful!");
        navigate("/admin/dashboard");
      } else {
        setMessage(res.data.message || "Login failed!");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setMessage(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className={Style.adminLoginContainer}>
      <div className={Style.wrapper}>
        <h2>Admin Login</h2>
        <form className={Style.adminLoginForm} onSubmit={handleSubmit}>
          <div className={Style.inputGroup}>
            <label>Name</label>
            <input type="text" name="name" placeholder="Enter Name" value={formData.name} onChange={handleChange} />
          </div>
          <div className={Style.inputGroup}>
            <label>Email</label>
            <input type="email" name="email" placeholder="Enter Email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className={Style.inputGroup}>
            <label>Password</label>
            <input type="password" name="password" placeholder="Enter Password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className={Style.LoginSubmit}>
            <button type="submit" className={Style.loginButton}>Login</button>
          </div>
        </form>
        {message && <div className={Style.Message}>{message}</div>}
      </div>
    </div>
  );
};

export default AdminLogin;
