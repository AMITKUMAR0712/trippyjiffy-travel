import React, { useState } from "react";
import { FaUserCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Style from "../Style/Register.module.scss";

const Register = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    country: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Always log baseURL once to confirm it's correct
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  console.log("✅ Base URL:", baseURL);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      // ✅ Full correct API endpoint
      const response = await fetch(`${baseURL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Try parsing response
      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setMessage("✅ Registered successfully! Redirecting to login...");

        // Reset form
        setFormData({
          name: "",
          email: "",
          mobile: "",
          password: "",
          country: "",
        });

        setShowPassword(false);

        // Redirect to login
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage("❌ " + (data.message || "Registration failed."));
      }
    } catch (error) {
      console.error("❌ Error during registration:", error);
      setMessage("❌ Something went wrong! Please try again.");
    }
  };

  return (
    <div className={Style.Register}>
      <div className={Style.wrapper}>
        <div className={Style.RegisterDisk}>
          <div className={Style.RegisterIcon}>
            <FaUserCircle />
          </div>
          <h2>Register</h2>
        </div>

        <div className={Style.RegisterForm}>
          <form className={Style.Form} onSubmit={handleSubmit}>
            <div className={Style.RegisterInput}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className={Style.RegisterInput}>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={Style.RegisterInput}>
              <input
                type="number"
                name="mobile"
                placeholder="Mobile Number"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </div>

            <div className={Style.RegisterInput}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                className={Style.ToggleIcon}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className={Style.RegisterInput}>
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>

            <div className={Style.RegisterSubmit}>
              <button type="submit">Register</button>
            </div>

            <div className={Style.Registeralredy}>
              <Link to="/login">Already have an account? Login</Link>
            </div>
          </form>

          {message && <div className={Style.Message}>{message}</div>}
        </div>
      </div>
    </div>
  );
};

export default Register;
