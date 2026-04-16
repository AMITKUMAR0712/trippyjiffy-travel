import React, { useState, useEffect } from "react";
import Style from "../Style/AdminFeedback.module.scss";
import { Link } from "react-router-dom";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

// ✅ FIXED IMAGE URL FORMATTER
const formatImageURL = (photo) => {
  if (!photo) return "";
  if (photo.startsWith("http")) return photo;

  // Remove any leading or duplicate "uploads/" part
  const cleanPhoto = photo.replace(/^\/?uploads\//, "").replace(/^\/?/, "");
  return `${baseURL.replace(/\/$/, "")}/api/uploads/${cleanPhoto}`;
};

const AdminFeedback = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    photo: "",
    destination: "",
    rating: "",
    review: "",
    origin: "",
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  // -------- FETCH FEEDBACKS --------
  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/feedback/get`);
      setFeedbacks(res.data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      alert("Failed to load feedbacks.");
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const resetForm = () => {
    setFormData({
      id: null,
      name: "",
      photo: "",
      destination: "",
      rating: "",
      review: "",
      origin: "",
    });
    setPhotoFile(null);
    setPhotoPreview("");
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // -------- SUBMIT FEEDBACK --------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.rating || !formData.review) {
      alert("Name, Rating and Review are required.");
      return;
    }

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("destination", formData.destination || "");
      data.append("origin", formData.origin || "");
      data.append("rating", formData.rating);
      data.append("review", formData.review);
      if (photoFile) data.append("photo", photoFile);

      if (isEditing) {
        await axios.put(`${baseURL}/api/feedback/update/${formData.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Feedback updated ✅");
      } else {
        await axios.post(`${baseURL}/api/feedback/add`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Feedback added ✅");
      }

      setShowPopup(false);
      resetForm();
      fetchFeedbacks();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback ❌");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?"))
      return;
    try {
      await axios.delete(`${baseURL}/api/feedback/delete/${id}`);
      fetchFeedbacks();
    } catch (error) {
      console.error(error);
      alert("Failed to delete feedback ❌");
    }
  };

  const handleEdit = (fb) => {
    setFormData({
      id: fb.id,
      name: fb.name,
      photo: fb.photo,
      destination: fb.destination,
      rating: fb.rating,
      review: fb.review,
      origin: fb.origin || "",
    });
    setPhotoFile(null);
    setPhotoPreview(formatImageURL(fb.photo));
    setIsEditing(true);
    setShowPopup(true);
  };

  // -------- RENDER --------
  return (
    <div className={Style.AdminFeedBack}>
      <div className={Style.wrapper}>
        <div className={Style.AdminFeedBackTop}>
          <Link
            to=""
            onClick={(e) => {
              e.preventDefault();
              resetForm();
              setShowPopup(true);
            }}
          >
            + New Feedback
          </Link>
        </div>

        <table className={Style.FeedBackTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Photo</th>
              <th>Name</th>
              <th>Origin</th>
              <th>Destination</th>
              <th>Rating</th>
              <th>Review</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.length === 0 && (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>
                  No feedbacks found.
                </td>
              </tr>
            )}
            {feedbacks.map((fb) => (
              <tr key={fb.id}>
                <td>{fb.id}</td>
                <td>
                  {fb.photo && (
                    <img
                      src={formatImageURL(fb.photo)}
                      alt={fb.name}
                      width="60"
                      height="40"
                      style={{ objectFit: "cover", borderRadius: "4px" }}
                    />
                  )}
                </td>
                <td>{fb.name}</td>
                <td>{fb.origin}</td>
                <td>{fb.destination}</td>
                <td>{fb.rating} ⭐</td>
                <td>{fb.review}</td>
                <td>{new Date(fb.created_at).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleEdit(fb)}>✏️ Edit</button>
                  <button onClick={() => handleDelete(fb.id)}>🗑️ Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPopup && (
        <div className={Style.FeedBackPopupOverlay}>
          <div className={Style.FeedBackPopupBox}>
            <h2>{isEditing ? "Edit Feedback" : "Add New Feedback"}</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="origin"
                placeholder="Origin"
                value={formData.origin}
                onChange={handleChange}
              />
              <input
                type="text"
                name="destination"
                placeholder="Destination"
                value={formData.destination}
                onChange={handleChange}
              />

              {(photoPreview || formData.photo) && (
                <img
                  src={photoPreview || formatImageURL(formData.photo)}
                  alt="preview"
                  width="100"
                  height="70"
                  style={{
                    margin: "5px 0",
                    borderRadius: "4px",
                    objectFit: "cover",
                  }}
                />
              )}

              <input type="file" name="photo" onChange={handlePhotoChange} />

              <input
                type="number"
                name="rating"
                placeholder="Rating (1-5)"
                min="1"
                max="5"
                value={formData.rating}
                onChange={handleChange}
                required
              />

              <textarea
                name="review"
                placeholder="Write your review"
                value={formData.review}
                onChange={handleChange}
                required
              />

              <div className={Style.FeedBackPopupActions}>
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

export default AdminFeedback;
