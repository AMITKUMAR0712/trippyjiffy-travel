import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import Style from "../Style/AdminTheme.module.scss";

const AdminTheme = () => {
  const [settings, setSettings] = useState({
    primaryColor: "#f97316",
    secondaryColor: "#fbbf24",
    fontFamily: "Poppins",
    navbarColor: "#ffffff",
    footerColor: "#0f172a",
  });
  const [loading, setLoading] = useState(false);
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/settings/get`);
        setSettings(res.data);
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };
    fetchSettings();
  }, [baseURL]);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${baseURL}/api/settings/update`, settings);
      toast.success("Theme updated successfully! Refreshing website...");
      
      // Update CSS variables immediately for preview
      const root = document.documentElement;
      root.style.setProperty("--primary-color", settings.primaryColor);
      root.style.setProperty("--secondary-color", settings.secondaryColor);
      root.style.setProperty("--font-family", settings.fontFamily);
      root.style.setProperty("--navbar-color", settings.navbarColor);
      root.style.setProperty("--footer-color", settings.footerColor);
      document.body.style.fontFamily = settings.fontFamily + ", sans-serif";

    } catch (err) {
      toast.error("Failed to update theme");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={Style.AdminTheme}>
      <div className={Style.header}>
        <h1>Advanced Theme Control</h1>
        <p>Customize your website's primary identity, colors, and typography.</p>
      </div>

      <form onSubmit={handleSubmit} className={Style.form}>
        <div className={Style.grid}>
          <div className={Style.card}>
            <h3>Brand Colors</h3>
            <div className={Style.inputGroup}>
              <label>Primary Color (Main Buttons, Accents)</label>
              <div className={Style.colorPicker}>
                <input type="color" name="primaryColor" value={settings.primaryColor} onChange={handleChange} />
                <input type="text" name="primaryColor" value={settings.primaryColor} onChange={handleChange} />
              </div>
            </div>

            <div className={Style.inputGroup}>
              <label>Secondary Color (Stars, Secondary Badges)</label>
              <div className={Style.colorPicker}>
                <input type="color" name="secondaryColor" value={settings.secondaryColor} onChange={handleChange} />
                <input type="text" name="secondaryColor" value={settings.secondaryColor} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className={Style.card}>
            <h3>Layout Colors</h3>
            <div className={Style.inputGroup}>
              <label>Navbar Background Color</label>
              <div className={Style.colorPicker}>
                <input type="color" name="navbarColor" value={settings.navbarColor} onChange={handleChange} />
                <input type="text" name="navbarColor" value={settings.navbarColor} onChange={handleChange} />
              </div>
            </div>

            <div className={Style.inputGroup}>
              <label>Footer Background Color</label>
              <div className={Style.colorPicker}>
                <input type="color" name="footerColor" value={settings.footerColor} onChange={handleChange} />
                <input type="text" name="footerColor" value={settings.footerColor} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className={Style.card}>
            <h3>Typography</h3>
            <div className={Style.inputGroup}>
              <label>Global Font Family</label>
              <select name="fontFamily" value={settings.fontFamily} onChange={handleChange}>
                <option value="Poppins">Poppins (Modern, Round)</option>
                <option value="Inter">Inter (Clean, Tech)</option>
                <option value="Roboto">Roboto (Classic)</option>
                <option value="Outfit">Outfit (Premium, Sharp)</option>
                <option value="Montserrat">Montserrat (Bold)</option>
              </select>
            </div>
            
            <div className={Style.preview}>
              <p style={{ fontFamily: settings.fontFamily }}>
                Theme Preview: The quick brown fox jumps over the lazy dog.
              </p>
            </div>
          </div>
        </div>

        <div className={Style.actions}>
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Apply Changes To Website"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminTheme;
