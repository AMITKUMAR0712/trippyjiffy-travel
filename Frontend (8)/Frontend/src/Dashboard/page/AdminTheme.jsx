import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiSettings, FiType, FiLayout, FiLayout as FiBox, 
  FiCheck, FiRefreshCw, FiEye, FiMoon, FiSun, FiTrash2 
} from "react-icons/fi";
import Style from "../Style/AdminTheme.module.scss";

const PRESETS = [
  { id: 'sunset', name: 'Sunset Orange', primary: '#f97316', secondary: '#fbbf24', footer: '#0f172a' },
  { id: 'ocean', name: 'Deep Ocean', primary: '#0ea5e9', secondary: '#06b6d4', footer: '#082f49' },
  { id: 'earth', name: 'Royal Forest', primary: '#16a34a', secondary: '#4ade80', footer: '#052e16' },
  { id: 'midnight', name: 'Modern Dark', primary: '#6366f1', secondary: '#818cf8', footer: '#000000' },
];

const AdminTheme = () => {
  const [settings, setSettings] = useState({
    primaryColor: "#f97316",
    secondaryColor: "#fbbf24",
    fontFamily: "Poppins",
    navbarColor: "#ffffff",
    footerColor: "#0f172a",
    glassEffect: false,
    borderRadius: 12,
    cardHoverStyle: "parallax",
    primaryGradient: "linear-gradient(135deg, #f97316 0%, #fbbf24 100%)",
    darkTheme: false
  });

  const [activeTab, setActiveTab] = useState("colors");
  const [loading, setLoading] = useState(false);
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/settings/get`);
        if (res.data) setSettings(res.data);
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };
    fetchSettings();
  }, [baseURL]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const applyPreset = (preset) => {
    setSettings(prev => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      footerColor: preset.footer
    }));
    toast.info(`Applied ${preset.name} palette`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${baseURL}/api/settings/update`, settings);
      toast.success("Design Studio: Theme synchronized successfully!");
      
      // Update CSS variables immediately for preview
      const root = document.documentElement;
      root.style.setProperty("--primary-color", settings.primaryColor);
      root.style.setProperty("--secondary-color", settings.secondaryColor);
      root.style.setProperty("--font-family", settings.fontFamily);
      root.style.setProperty("--navbar-color", settings.navbarColor);
      root.style.setProperty("--footer-color", settings.footerColor);
      document.body.style.fontFamily = settings.fontFamily + ", sans-serif";

    } catch (err) {
      toast.error("Failed to sync design settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={Style.AdminTheme}>
      <header className={Style.header}>
        <div>
          <h1>Design Studio</h1>
          <p>The core identity and visual engine of TrippyJiffy.</p>
        </div>
        <div className={Style.presets}>
          {PRESETS.map(p => (
            <button
              key={p.id}
              className={`${Style.presetBtn} ${settings.primaryColor === p.primary ? Style.active : ""}`}
              style={{ background: p.primary }}
              onClick={() => applyPreset(p)}
              title={p.name}
            />
          ))}
        </div>
      </header>

      <div className={Style.tabs}>
        <button 
          className={`${Style.tab} ${activeTab === 'colors' ? Style.active : ""}`}
          onClick={() => setActiveTab('colors')}
        >
          <FiLayout style={{ marginRight: 8 }} /> Colors & Presets
        </button>
        <button 
          className={`${Style.tab} ${activeTab === 'typography' ? Style.active : ""}`}
          onClick={() => setActiveTab('typography')}
        >
          <FiType style={{ marginRight: 8 }} /> Typography
        </button>
        <button 
          className={`${Style.tab} ${activeTab === 'advanced' ? Style.active : ""}`}
          onClick={() => setActiveTab('advanced')}
        >
          <FiSettings style={{ marginRight: 8 }} /> Advance Layout
        </button>
      </div>

      <form onSubmit={handleSubmit} className={Style.studioContent}>
        <div className={Style.controlPanel}>
          <AnimatePresence mode="wait">
            {activeTab === 'colors' && (
              <motion.div
                key="colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className={Style.sectionTitle}>
                  <FiLayout /> Brand & Interface Colors
                </div>
                <div className={Style.grid}>
                  <div className={Style.inputGroup}>
                    <label>Brand Primary (Action Items)</label>
                    <div className={Style.colorPicker}>
                      <input type="color" name="primaryColor" value={settings.primaryColor} onChange={handleChange} />
                      <input type="text" name="primaryColor" value={settings.primaryColor} onChange={handleChange} />
                    </div>
                  </div>
                  <div className={Style.inputGroup}>
                    <label>Secondary Accent (Stars/Badges)</label>
                    <div className={Style.colorPicker}>
                      <input type="color" name="secondaryColor" value={settings.secondaryColor} onChange={handleChange} />
                      <input type="text" name="secondaryColor" value={settings.secondaryColor} onChange={handleChange} />
                    </div>
                  </div>
                  <div className={Style.inputGroup}>
                    <label>Navbar Color</label>
                    <div className={Style.colorPicker}>
                      <input type="color" name="navbarColor" value={settings.navbarColor} onChange={handleChange} />
                      <input type="text" name="navbarColor" value={settings.navbarColor} onChange={handleChange} />
                    </div>
                  </div>
                  <div className={Style.inputGroup}>
                    <label>Footer Background</label>
                    <div className={Style.colorPicker}>
                      <input type="color" name="footerColor" value={settings.footerColor} onChange={handleChange} />
                      <input type="text" name="footerColor" value={settings.footerColor} onChange={handleChange} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'typography' && (
              <motion.div
                key="typo"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className={Style.sectionTitle}>
                  <FiType /> Global Typography Setup
                </div>
                <div className={Style.inputGroup}>
                  <label>Select Font System</label>
                  <select name="fontFamily" value={settings.fontFamily} onChange={handleChange}>
                    <option value="Poppins">Poppins (Travel-Friendly)</option>
                    <option value="Inter">Inter (Clean & Professional)</option>
                    <option value="Outfit">Outfit (High-End & Sharp)</option>
                    <option value="Montserrat">Montserrat (Bold Presence)</option>
                    <option value="Playfair Display">Playfair (Elegant Luxury)</option>
                  </select>
                </div>
                <div style={{ 
                  fontFamily: settings.fontFamily, 
                  background: '#f8fafc', 
                  padding: 24, 
                  borderRadius: 16,
                  border: '1px dashed #cbd5e1'
                }}>
                  <h2 style={{ fontSize: 24, marginBottom: 8 }}>Heading Preview - 24px</h2>
                  <p style={{ fontSize: 16, opacity: 0.8 }}>
                    Sample paragraph: The quick brown fox jumps over the lazy dog. 
                    This font is currently set to <strong>{settings.fontFamily}</strong>.
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'advanced' && (
              <motion.div
                key="advanced"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className={Style.sectionTitle}>
                  <FiSettings /> Advanced Design Engine
                </div>
                <div className={Style.grid}>
                  <div className={Style.inputGroup}>
                    <label>Global Border Radius (px)</label>
                    <input 
                      type="number" 
                      name="borderRadius" 
                      value={settings.borderRadius} 
                      onChange={handleChange} 
                      min="0" max="40" 
                    />
                  </div>
                  <div className={Style.inputGroup}>
                    <label>Card Hover Interaction</label>
                    <select name="cardHoverStyle" value={settings.cardHoverStyle} onChange={handleChange}>
                      <option value="parallax">Parallax Bento Reveal</option>
                      <option value="zoom">Scale & Shadow Zoom</option>
                      <option value="glow">Neon Primary Glow</option>
                      <option value="minimal">Minimal Lift</option>
                    </select>
                  </div>
                </div>

                <div className={Style.switchGroup}>
                  <div>
                    <h4>Glassmorphism Glass Effect</h4>
                    <p>Enable frosted glass backgrounds for cards and modals.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    name="glassEffect" 
                    checked={settings.glassEffect} 
                    onChange={handleChange} 
                  />
                </div>

                <div className={Style.switchGroup}>
                  <div>
                    <h4>Default Dark Mode</h4>
                    <p>Force website to use dark theme as default.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    name="darkTheme" 
                    checked={settings.darkTheme} 
                    onChange={handleChange} 
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <footer className={Style.actions}>
            <button type="submit" disabled={loading}>
              {loading ? <FiRefreshCw className="spin" /> : <FiCheck />} 
              {loading ? " Synchronizing..." : " Sync Studio Changes"}
            </button>
          </footer>
        </div>

        {/* Live Visualizer Sidebar */}
        <aside className={Style.visualizer}>
          <div className={Style.sectionTitle} style={{ color: '#fff' }}>
            <FiEye /> Real-Time Preview
          </div>
          <h3>Component Snapshot</h3>
          
          <div 
            className={Style.previewCard}
            style={{ 
              borderRadius: `${settings.borderRadius}px`,
              backgroundImage: 'url("https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=400&q=80")',
              fontFamily: settings.fontFamily
            }}
          >
            <div className={Style.cardContent}>
              <h4>Sample Destination</h4>
              <p>Explore the beauty of the world with the new theme engine.</p>
              <button style={{ 
                background: settings.primaryColor, 
                color: '#fff',
                borderRadius: `${settings.borderRadius / 2}px`
              }}>
                Book Now
              </button>
            </div>
          </div>

          <div className={Style.metaInfo}>
            <div className={Style.stat}>
              <h5>Primary</h5>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: settings.primaryColor }} />
                <p>{settings.primaryColor}</p>
              </div>
            </div>
            <div className={Style.stat}>
              <h5>Font</h5>
              <p>{settings.fontFamily}</p>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
};

export default AdminTheme;
