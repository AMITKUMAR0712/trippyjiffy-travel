import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Lock, 
  Eye, 
  EyeOff,
  Save,
  Trash2,
  AlertTriangle
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Style from "../Dashboard/Style/UserEdit.module.scss";

const UserEdit = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com";

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please login.");

        const { data } = await axios.get(`${baseURL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser({ ...data, password: "" });
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch user profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [baseURL]);

  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await axios.put(`${baseURL}/api/users/update/users/${user.id}`, user);
      toast.success("Profile updated successfully!");
      // Optionally update local storage if needed
      const stored = JSON.parse(localStorage.getItem("user"));
      localStorage.setItem("user", JSON.stringify({ ...stored, name: user.name, country: user.country }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to permanently delete your account? This action cannot be undone."))
      return;
    try {
      await axios.delete(`${baseURL}/api/users/delete/users/${user.id}`);
      toast.success("Account deleted successfully");
      localStorage.clear();
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete account");
    }
  };

  if (loading) return <div className={Style.loadingState}>Loading settings...</div>;
  if (error || !user) return <div className={Style.errorState}>{error || "User data missing"}</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={Style.container}
    >
      <div className={Style.header}>
        <div className={Style.titleGroup}>
          <h2>Account Settings</h2>
          <p>Manage your profile information and security preferences.</p>
        </div>
      </div>

      <div className={Style.contentGrid}>
        <div className={Style.formSection}>
          <form onSubmit={handleUpdate} className={Style.settingsForm}>
            <div className={Style.inputGrid}>
              <div className={Style.inputGroup}>
                <label><User size={14} /> Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={user.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={Style.inputGroup}>
                <label><Mail size={14} /> Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="email@example.com"
                  value={user.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={Style.inputGroup}>
                <label><Phone size={14} /> Phone Number</label>
                <input
                  type="text"
                  name="mobile"
                  placeholder="+1 234 567 890"
                  value={user.mobile || ""}
                  onChange={handleChange}
                />
              </div>

              <div className={Style.inputGroup}>
                <label><Globe size={14} /> Country</label>
                <input
                  type="text"
                  name="country"
                  placeholder="e.g. India"
                  value={user.country || ""}
                  onChange={handleChange}
                />
              </div>

              <div className={Style.inputGroupFull}>
                <label><Lock size={14} /> New Password</label>
                <div className={Style.passwordInput}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter new password to change"
                    value={user.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={Style.togglePassword}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <small className={Style.helperText}>Leave blank to keep your current password</small>
              </div>
            </div>

            <div className={Style.formActions}>
               <button type="submit" disabled={isUpdating} className={Style.saveBtn}>
                 {isUpdating ? "Saving..." : <><Save size={18} /> Save Changes</>}
               </button>
            </div>
          </form>
        </div>

        <div className={Style.dangerSection}>
           <div className={Style.dangerCard}>
              <div className={Style.dangerHeader}>
                 <AlertTriangle size={24} color="#ef4444" />
                 <h3>Danger Zone</h3>
              </div>
              <p>Permanently remove your account and all associated data from TrippyJiffy. This action is irreversible.</p>
              <button onClick={handleDelete} className={Style.deleteBtn}>
                 <Trash2 size={18} /> Delete My Account
              </button>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserEdit;

