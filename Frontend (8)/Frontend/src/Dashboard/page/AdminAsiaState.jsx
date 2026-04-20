import React, { useEffect, useState } from "react";
import axios from "axios";
import Style from "../Style/AdminAsiaState.module.scss";

const AdminAsiaState = () => {
  const [states, setStates] = useState([]);
  const [asiaList, setAsiaList] = useState([]);
  const [form, setForm] = useState({
    state_name: "",
    state_image: null,
    asia_id: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState("");

  const baseURL = import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com";
  const baseIMG = import.meta.env.VITE_API_BASE_URL_IMG;

  const fetchStates = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/asiaState/get`);
      setStates(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching states:", err);
      setStates([]);
    }
  };

  const fetchAsiaList = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/asia/get`);
      setAsiaList(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching asia list:", err);
      setAsiaList([]);
    }
  };

  useEffect(() => {
    fetchStates();
    fetchAsiaList();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, state_image: file });
    setPreview(URL.createObjectURL(file));
  };

  const openAddModal = () => {
    setForm({ state_name: "", state_image: null, asia_id: "" });
    setPreview("");
    setEditingId(null);
    setShowModal(true);
  };

  const handleEdit = (state) => {
    setForm({
      state_name: state.state_name,
      state_image: null,
      asia_id: state.asia_id,
    });
    setPreview(state.state_image ? `${baseIMG}${state.state_image}` : "");
    setEditingId(state.id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("state_name", form.state_name);
      formData.append("asia_id", form.asia_id);
      if (form.state_image) formData.append("state_image", form.state_image);

      if (editingId) {
        await axios.put(
          `${baseURL}/api/asiaState/update/${editingId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        alert("✅ State updated");
      } else {
        await axios.post(`${baseURL}/api/asiaState/post`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ State added");
      }

      setShowModal(false);
      setEditingId(null);
      fetchStates();
    } catch (err) {
      console.error("Error saving state:", err);
      alert(
        "Error saving state: " + (err.response?.data?.message || err.message)
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this state?")) return;
    try {
      await axios.delete(`${baseURL}/api/asiaState/delete/${id}`);
      fetchStates();
      alert("🗑️ State deleted");
    } catch (err) {
      console.error("Error deleting state:", err);
      alert("Error deleting state");
    }
  };

  return (
    <div className={Style.AdminAsiaState}>
      <h2>🌏 Asia State Management</h2>
      <button className={Style.addBtn} onClick={openAddModal}>
        + Add State
      </button>

      <div className={Style.tableWrapper}>
        <table className={Style.stateTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>State Name</th>
              <th>Image</th>
              <th>Asia</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {states.length > 0 ? (
              states.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.state_name}</td>
                  <td>
                    {s.state_image && (
                      <img
                        src={`${baseIMG}${s.state_image}`}
                        load
                        hoga
                        alt={s.state_name}
                        className={Style.stateImg}
                      />
                    )}
                  </td>
                  <td>
                    {asiaList.find((a) => String(a.id) === String(s.asia_id))
                      ?.country_name || "Unknown"}
                  </td>
                  <td>
                    <button
                      className={Style.editBtn}
                      onClick={() => handleEdit(s)}
                    >
                      Edit
                    </button>
                    <button
                      className={Style.deleteBtn}
                      onClick={() => handleDelete(s.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No States Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className={Style.modalOverlay}>
          <div className={Style.modalBox}>
            <h3>{editingId ? "Edit State" : "Add State"}</h3>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <input
                type="text"
                name="state_name"
                placeholder="State Name"
                value={form.state_name}
                onChange={handleChange}
                required
              />

              <input type="file" accept="image/*" onChange={handleFileChange} />

              <select
                name="asia_id"
                value={form.asia_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Asia</option>
                {asiaList.map((asia) => (
                  <option key={asia.id} value={asia.id}>
                    {asia.country_name}
                  </option>
                ))}
              </select>

              {preview && (
                <img src={preview} alt="preview" className={Style.previewImg} />
              )}

              <div className={Style.btnGroup}>
                <button type="submit" className={Style.saveBtn}>
                  {editingId ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  className={Style.cancelBtn}
                  onClick={() => setShowModal(false)}
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

export default AdminAsiaState;
