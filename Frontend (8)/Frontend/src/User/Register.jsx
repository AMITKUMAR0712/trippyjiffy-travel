import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, Globe, Eye, EyeOff, UserPlus } from "lucide-react";
import { useMotionValue, useTransform, useSpring } from "framer-motion";
import Style from "../Style/Register.module.scss";

const Register = () => {
  const navigate = useNavigate();

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

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
    name: "",
    email: "",
    mobile: "",
    password: "",
    country: "",
  });

  const [showPassword, setShowPassword] = useState(false);
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
      const response = await fetch(`${baseURL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setMessage("✅ Registered successfully! Redirecting...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage("❌ " + (data.message || "Registration failed."));
      }
    } catch (error) {
      console.error("❌ Error during registration:", error);
      setMessage("❌ Connection error.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={Style.Register}>
      <motion.div 
        className={Style.container}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        initial={{ opacity: 0, scale: 0.9, x: 50 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Left Section (Image) */}
        <div className={Style.imageSection}>
          <h2 className={Style.quote}>"The world is a book and those who do not travel read only one page"</h2>
        </div>

        {/* Right Section (Form) */}
        <div className={Style.formSection}>
          <div className={Style.brand}>
            <h1>Join TrippyJiffy</h1>
          </div>

          <form onSubmit={handleSubmit} autoComplete="on">
            <div className={Style.row}>
              <div className={Style.inputGroup}>
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <User className={Style.inputIcon} size={16} />
              </div>

              <div className={Style.inputGroup}>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Mail className={Style.inputIcon} size={16} />
              </div>
            </div>

            <div className={Style.row}>
              <div className={Style.inputGroup}>
                <label>Mobile</label>
                <input
                  type="tel"
                  name="mobile"
                  id="mobile"
                  autoComplete="tel"
                  placeholder="Mobile Number"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                />
                <Phone className={Style.inputIcon} size={16} />
              </div>

              <div className={Style.inputGroup}>
                <label>Country</label>
                <input
                  type="text"
                  name="country"
                  id="country"
                  autoComplete="country-name"
                  placeholder="India"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
                <Globe className={Style.inputIcon} size={16} />
              </div>
            </div>

            <div className={Style.inputGroup}>
              <label>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                className={Style.ToggleIcon}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            <button type="submit" className={Style.submitBtn} disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Join Now"}
            </button>
          </form>

          <div className={Style.loginPrompt}>
            Already have an account? <Link to="/login">Login</Link>
          </div>

          {message && <div className={Style.Message}>{message}</div>}
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
