
import React, { useState, useEffect } from "react";
import Style from "../Style/AdminUpcomingTrips.module.scss";
import axios from "axios";

const AdminUpcomingTrips = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [trips, setTrips] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    tags: "",
    link: "",
    description: "",
    details: [], // For itinerary
    images: [],
    banner_image: null,
    is_visible: 1,
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [bannerFile, setBannerFile] = useState(null);
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const getValidImageUrl = (img) => {
    if (!img) return null;
    let finalUrl = img;

    if (typeof finalUrl === "string") {
      if (finalUrl.startsWith("http")) return finalUrl;

      if (!finalUrl.startsWith("/api/uploads/")) {
        finalUrl = `/api/uploads/${finalUrl.replace(/^uploads\//, "")}`;
      }
      finalUrl = `${baseURL}${finalUrl}`;
    }
    return finalUrl;
  };

  const fetchTrips = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/upcoming-trips/get`);
      setTrips(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setTrips([]);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const resetForm = () => {
    setFormData({ id: null, title: "", tags: "", link: "", description: "", details: [], images: [], banner_image: null, is_visible: 1 });
    setImageFiles([]);
    setBannerFile(null);
    setIsEditing(false);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleItineraryChange = (idx, value) => {
    const newDetails = [...formData.details];
    newDetails[idx] = value;
    setFormData({ ...formData, details: newDetails });
  };

  const addItineraryStep = () => {
    setFormData({ ...formData, details: [...formData.details, ""] });
  };

  const removeItineraryStep = (idx) => {
    const newDetails = formData.details.filter((_, i) => i !== idx);
    setFormData({ ...formData, details: newDetails });
  };

  const handleImageChange = (e) => setImageFiles(Array.from(e.target.files));
  const handleBannerChange = (e) => setBannerFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return alert("Title is required");

    const data = new FormData();
    data.append("title", formData.title);
    data.append("tags", formData.tags);
    data.append("link", formData.link);
    data.append("description", formData.description);
    data.append("details", JSON.stringify(formData.details));
    data.append("is_visible", formData.is_visible);
    
    imageFiles.forEach((file) => data.append("images", file));
    if (bannerFile) data.append("banner_image", bannerFile);

    try {
      if (isEditing) {
        await axios.put(`${baseURL}/api/upcoming-trips/put/${formData.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Trip updated ✅");
      } else {
        await axios.post(`${baseURL}/api/upcoming-trips/post`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Trip added ✅");
      }
      resetForm();
      setShowPopup(false);
      fetchTrips();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed ❌: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${baseURL}/api/upcoming-trips/delete/${id}`);
      fetchTrips();
      alert("Trip deleted ✅");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Delete failed ❌");
    }
  };

  const handleEdit = (trip) => {
    let details = [];
    try {
      details = typeof trip.details === 'string' ? JSON.parse(trip.details) : (trip.details || []);
    } catch (e) { details = []; }

    setFormData({
      id: trip.id,
      title: trip.title,
      tags: trip.tags || "",
      link: trip.link || "",
      description: trip.description || "",
      details: Array.isArray(details) ? details : [],
      images: trip.images || [],
      banner_image: trip.banner_image || null,
      is_visible: trip.is_visible ?? 1,
    });
    setImageFiles([]);
    setBannerFile(null);
    setIsEditing(true);
    setShowPopup(true);
  };

  const handleToggleVisibility = async (trip) => {
    try {
      await axios.put(`${baseURL}/api/upcoming-trips/toggle/${trip.id}`);
      fetchTrips();
    } catch (err) {
      console.error("Visibility toggle error:", err);
    }
  };

  return (
    <div className={Style.AdminUpcomingTrips}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Manage Upcoming Trips & Tours</h1>
        <button
          className={Style.newBtn}
          onClick={() => {
            resetForm();
            setShowPopup(true);
          }}
        >
          + Add New Trip
        </button>
      </div>

      <table className={Style.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Tags</th>
            <th>Banner</th>
            <th>Visible</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((t) => (
            <tr
              key={t.id}
              className={t.is_visible === 0 ? Style.disabledRow : ""}
            >
              <td>{t.id}</td>
              <td>{t.title}</td>
              <td>{t.tags}</td>
              <td>
                {t.banner_image && (
                  <img src={getValidImageUrl(t.banner_image)} alt="banner" width="60" height="40" style={{ objectFit: 'cover', borderRadius: '4px' }} />
                )}
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={t.is_visible === 1}
                  onChange={() => handleToggleVisibility(t)}
                />
              </td>
              <td>
                <button onClick={() => handleEdit(t)}>✏️ Edit</button>
                <button onClick={() => handleDelete(t.id)}>🗑️ Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPopup && (
        <div className={Style.PopupOverlay}>
          <div className={Style.PopupBox}>
            <h2>{isEditing ? "Edit Upcoming Trip" : "Add New Upcoming Trip"}</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <label>Trip Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Trip Title (e.g. Kedarnath Trek)"
                required
              />
              
              <label>Short Description (For Sub-page)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe this trip beautifully..."
                rows="3"
                style={{ padding: '10px', marginBottom: '15px' }}
              />

              <label>Itinerary Highlights (Sub-page)</label>
              <div style={{ marginBottom: '15px' }}>
                {formData.details.map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
                    <input 
                      type="text" 
                      value={step} 
                      onChange={(e) => handleItineraryChange(idx, e.target.value)}
                      placeholder={`Step ${idx + 1}`}
                      style={{ marginBottom: 0, flex: 1 }}
                    />
                    <button type="button" onClick={() => removeItineraryStep(idx)} style={{ background: '#ff4d4f', padding: '5px 10px', margin: 0 }}>✕</button>
                  </div>
                ))}
                <button type="button" onClick={addItineraryStep} style={{ background: '#27ae60', padding: '5px 10px', fontSize: '0.8rem' }}>+ Add Step</button>
              </div>

              <label>Tags & Link</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Tags (Comma separated, e.g. Adventure, Trekking)"
              />
              <input
                type="text"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="External Link (Optional)"
              />

              <label>Banner Image (Large Top Image)</label>
              <div style={{ marginBottom: '10px' }}>
                {bannerFile ? (
                  <img src={URL.createObjectURL(bannerFile)} alt="preview" width="100" height="40" style={{ objectFit: 'cover' }} />
                ) : formData.banner_image && (
                  <img src={getValidImageUrl(formData.banner_image)} alt="existing" width="100" height="40" style={{ objectFit: 'cover' }} />
                )}
              </div>
              <input type="file" onChange={handleBannerChange} />

              <label>Gallery Images (Carousel)</label>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  margin: "5px 0",
                }}
              >
                {imageFiles.map((file, idx) => (
                  <img
                    key={idx}
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    width="60"
                    height="40"
                    style={{
                      objectFit: "cover",
                      marginRight: "5px",
                      marginBottom: "5px",
                      borderRadius: "4px",
                    }}
                  />
                ))}

                {!imageFiles.length &&
                  formData.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={getValidImageUrl(img)}
                      alt="existing"
                      width="60"
                      height="40"
                      style={{
                        objectFit: "cover",
                        marginRight: "5px",
                        marginBottom: "5px",
                        borderRadius: "4px",
                      }}
                    />
                  ))}
              </div>
              <input type="file" multiple onChange={handleImageChange} />

              <div style={{ marginTop: "10px" }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    checked={formData.is_visible === 1}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_visible: e.target.checked ? 1 : 0,
                      })
                    }
                    style={{ margin: 0, width: 'auto' }}
                  />{" "}
                  Visible on Home Page
                </label>
              </div>

              <div className={Style.Actions}>
                <button type="submit">{isEditing ? "Update" : "Save"}</button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPopup(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUpcomingTrips;
