import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, Chrome, Facebook, Linkedin, Instagram, Twitter } from "lucide-react";
import { useMotionValue, useTransform, useSpring } from "framer-motion";
import Style from "../Style/Login.module.scss";

const Login = () => {
  const navigate = useNavigate();
  
  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const baseURL = import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

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
        setTimeout(() => navigate("/user"), 1500);
      } else {
        setMessage("❌ " + (data.message || data.error));
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage("❌ Connection error.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={Style.Login}>
      <motion.div 
        className={Style.container}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Left Section */}
        <div className={Style.imageSection}>
          <h2 className={Style.quote}>"Travel is the only thing you buy that makes you richer"</h2>
          <div className={Style.socialIcons}>
            <a href="#" className={Style.socialIcon}><Facebook size={18} /></a>
            <a href="#" className={Style.socialIcon}><Twitter size={18} /></a>
            <a href="#" className={Style.socialIcon}><Instagram size={18} /></a>
          </div>
        </div>

        {/* Right Section */}
        <div className={Style.formSection}>
          <div className={Style.brand}>
            <h1>TrippyJiffy</h1>
          </div>



          <form onSubmit={handleSubmit} autoComplete="on">
            <div className={Style.inputGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                placeholder="example@mail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <User className={Style.inputIcon} size={18} />
            </div>

            <div className={Style.inputGroup}>
              <label>Password</label>
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Lock className={Style.inputIcon} size={18} />
            </div>

            <Link to="/forgot-password" className={Style.forgotLink}>
              Forgot Your Password?
            </Link>

            <button type="submit" className={Style.submitBtn} disabled={isLoading}>
              {isLoading ? "Signing In..." : "Enter"}
            </button>
          </form>

          <div className={Style.registerPrompt}>
            Don't have an account? <Link to="/register">Register</Link>
          </div>

          {message && <div className={Style.Message}>{message}</div>}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
