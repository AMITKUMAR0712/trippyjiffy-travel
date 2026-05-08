import React, { useState, useEffect } from "react";
import Style from "../Style/CatagoryIndia.module.scss";
import axios from "axios";

const CatagoryIndia = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [regions, setRegions] = useState([]);
  const [formData, setFormData] = useState({ id: null, region_name: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const baseURL = import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com";

  const fetchRegions = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/category-india/get`);
      setRegions(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching regions:", error);
      setRegions([]);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  const resetForm = () => {
    setFormData({ id: null, region_name: "" });
    setSelectedFile(null);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setSelectedFile(e.target.files[0]);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("region_name", formData.region_name);
    if (selectedFile) {
      data.append("image", selectedFile);
    }

    try {
      if (isEditing) {
        await axios.put(`${baseURL}/api/category-india/put/${formData.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        alert("Region updated ✅");
      } else {
        await axios.post(`${baseURL}/api/category-india/post`, data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        alert("Region added ✅");
      }
      setShowPopup(false);
      resetForm();
      fetchRegions();
    } catch (error) {
      console.error("Error submitting region:", error);
      alert("Failed ❌");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${baseURL}/api/category-india/delete/${id}`);
      fetchRegions();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (region) => {
    setFormData({ id: region.id, region_name: region.region_name });
    setIsEditing(true);
    setShowPopup(true);
  };

  return (
    <div className={Style.CatagoryIndia}>
      <div className={Style.wrapper}>
        <div className={Style.top}>
          <button
            onClick={() => {
              resetForm();
              setShowPopup(true);
            }}
          >
            + New Region
          </button>
        </div>

        <table className={Style.Table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Region Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {regions.map((region) => (
              <tr key={region.id}>
                <td>{region.id}</td>
                <td>
                  {region.image ? (
                    <img 
                      src={`${baseURL}/api/uploads/${region.image}`} 
                      alt={region.region_name} 
                      style={{ width: "80px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>{region.region_name}</td>
                <td>
                  <button onClick={() => handleEdit(region)}>✏️ Edit</button>
                  <button onClick={() => handleDelete(region.id)}>
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPopup && (
        <div className={Style.PopupOverlay}>
          <div className={Style.PopupBox}>
            <h2>{isEditing ? "Edit Region" : "Add New Region"}</h2>
            <form onSubmit={handleSubmit}>
              <div className={Style.InputGroup}>
                <label>Region Name</label>
                <input
                  type="text"
                  name="region_name"
                  placeholder="Region Name"
                  value={formData.region_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={Style.InputGroup}>
                <label>Region Image</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  accept="image/*"
                  required={!isEditing}
                />
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

export default CatagoryIndia;
