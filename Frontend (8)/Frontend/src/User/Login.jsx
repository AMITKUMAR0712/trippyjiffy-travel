import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Style from "../Style/Login.module.scss";

const Login = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${baseURL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setMessage("✅ Login successful!");

        navigate("/user");
      } else {
        setMessage("❌ " + (data.message || data.error));
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage("❌ Something went wrong!");
    }
  };

  return (
    <div className={Style.Login}>
      <div className={Style.wrapper}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className={Style.LoginInput}>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Style.LoginInput}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Style.LoginSubmit}>
            <button type="submit">Login</button>
          </div>

          <div className={Style.ForgotPasswordLink}>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <div className={Style.RegisterLink}>
            <Link to="/register">Don't have an account? Register</Link>
          </div>
        </form>

        {message && <div className={Style.Message}>{message}</div>}
      </div>
    </div>
  );
};

export default Login;
