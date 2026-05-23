import React, { useState, useEffect, useRef } from "react";
import Style from "../Style/AdminUpcomingTrips.module.scss";
import axios from "axios";
import EditorJS from "@editorjs/editorjs";

import Header from "@editorjs/header";
import List from "@editorjs/list";
import Checklist from "@editorjs/checklist";
import Quote from "@editorjs/quote";
import Warning from "@editorjs/warning";
import Marker from "@editorjs/marker";
import CodeTool from "@editorjs/code";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import LinkTool from "@editorjs/link";
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";

const safeParse = (data, fallback = { blocks: [] }) => {
  if (!data) return fallback;
  if (typeof data === "object") return data;
  try {
    return JSON.parse(data);
  } catch {
    return fallback;
  }
};

const AdminUpcomingTrips = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [trips, setTrips] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    tags: "",
    link: "",
    description: { blocks: [] },
    details: [], // For itinerary highlights
    inclusion: { blocks: [] },
    exclusion: { blocks: [] },
    routing: { blocks: [] },
    duration: "",
    supplementery: { blocks: [] },
    price: "",
    images: [],
    banner_image: null,
    is_visible: 1,
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [bannerFile, setBannerFile] = useState(null);
  const baseURL = import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com";
  const editorsRef = useRef({});

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
      const parsedData = (Array.isArray(res.data) ? res.data : []).map(t => ({
          ...t,
          description: safeParse(t.description),
          inclusion: safeParse(t.inclusion),
          exclusion: safeParse(t.exclusion),
          routing: safeParse(t.routing),
          supplementery: safeParse(t.supplementery)
      }));
      setTrips(parsedData);
    } catch (err) {
      console.error("Fetch error:", err);
      setTrips([]);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const resetForm = () => {
    setFormData({
      id: null,
      title: "",
      tags: "",
      link: "",
      description: { blocks: [] },
      details: [],
      inclusion: { blocks: [] },
      exclusion: { blocks: [] },
      routing: { blocks: [] },
      duration: "",
      supplementery: { blocks: [] },
      price: "",
      images: [],
      banner_image: null,
      is_visible: 1,
    });
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("Maximum 5 gallery images allowed. Only the first 5 will be selected.");
      setImageFiles(files.slice(0, 5));
    } else {
      setImageFiles(files);
    }
  };
  const handleBannerChange = (e) => setBannerFile(e.target.files[0]);

  useEffect(() => {
    if (!showPopup) return;

    const fields = [
      "description",
      "routing",
      "inclusion",
      "exclusion",
      "supplementery",
    ];

    fields.forEach((field) => {
      if (editorsRef.current[field]) {
        editorsRef.current[field].destroy();
        editorsRef.current[field] = null;
      }

      editorsRef.current[field] = new EditorJS({
        holder: `${field}_editor`,
        tools: {
          header: Header,
          list: List,
          checklist: Checklist,
          quote: Quote,
          warning: Warning,
          marker: Marker,
          code: CodeTool,
          delimiter: Delimiter,
          inlineCode: InlineCode,
          linkTool: LinkTool,
          embed: Embed,
          table: Table,
        },
        data: formData[field] || { blocks: [] },
      });
    });

    return () => {
      Object.keys(editorsRef.current).forEach((field) => {
        if (editorsRef.current[field]) {
          editorsRef.current[field].destroy();
          editorsRef.current[field] = null;
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPopup]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return alert("Title is required");

    try {
      const editorData = {};
      for (const field in editorsRef.current) {
        editorData[field] = await editorsRef.current[field].save();
      }

      const data = new FormData();
      data.append("title", formData.title);
      data.append("tags", formData.tags);
      data.append("link", formData.link);
      data.append("details", JSON.stringify(formData.details));
      data.append("duration", formData.duration);
      data.append("price", formData.price);
      data.append("is_visible", formData.is_visible);
      
      for (const field in editorData) {
        data.append(field, JSON.stringify(editorData[field]));
      }

      imageFiles.forEach((file) => data.append("images", file));
      if (bannerFile) data.append("banner_image", bannerFile);

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
      description: safeParse(trip.description),
      details: Array.isArray(details) ? details : [],
      inclusion: safeParse(trip.inclusion),
      exclusion: safeParse(trip.exclusion),
      routing: safeParse(trip.routing),
      duration: trip.duration || "",
      supplementery: safeParse(trip.supplementery),
      price: trip.price || "",
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

              <label>Tags & Link</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="Tags (Comma separated, e.g. Adventure, Trekking)"
                    style={{ flex: 1 }}
                  />
                  <input
                    type="text"
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    placeholder="External Link (Optional)"
                    style={{ flex: 1 }}
                  />
              </div>

              <label>Trip Details (Duration & Price)</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Duration (e.g. 5 Nights / 6 Days)"
                  style={{ flex: 1 }}
                />
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Price (e.g. Starts at ₹10,000)"
                  style={{ flex: 1 }}
                />
              </div>

              {[
                { key: "description", label: "📝 Description" },
                { key: "routing", label: "🛣️ Brief Itinerary (Routing)" },
                { key: "inclusion", label: "✅ Inclusions" },
                { key: "exclusion", label: "❌ Exclusions" },
                { key: "supplementery", label: "➕ Supplementary Info" },
              ].map((field) => (
                <div key={field.key} style={{ marginBottom: "20px", marginTop: "10px" }}>
                  <h3 style={{ fontSize: "16px", marginBottom: "8px", fontWeight: "600", color: "#444" }}>
                    {field.label}
                  </h3>
                  <div
                    id={`${field.key}_editor`}
                    style={{ border: "1px solid #ddd", padding: "12px", minHeight: "150px", borderRadius: "8px", background: "#fafafa" }}
                  />
                </div>
              ))}

              <label>Itinerary Highlights (Sub-page list format)</label>
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
