import React, { useState, useEffect } from "react";
import Style from "../Style/CatagoryIndia.module.scss";
import axios from "axios";

const CatagoryIndia = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [regions, setRegions] = useState([]);
  const [formData, setFormData] = useState({ id: null, region_name: "" });
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
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(
          `${baseURL}/api/category-india/put/${formData.id}`,
          formData
        );
        alert("Region updated ✅");
      } else {
        await axios.post(`${baseURL}/api/category-india/post`, formData);
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
              <th>Region Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {regions.map((region) => (
              <tr key={region.id}>
                <td>{region.id}</td>
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
              <input
                type="text"
                name="region_name"
                placeholder="Region Name"
                value={formData.region_name}
                onChange={handleChange}
                required
              />

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
