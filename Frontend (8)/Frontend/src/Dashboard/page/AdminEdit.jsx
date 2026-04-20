import React, { useEffect, useState } from "react";
import axios from "axios";
import Style from "../Style/AdminEdit.module.scss";

const AdminEdit = () => {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [editing, setEditing] = useState(null);

  const baseURL = import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com";

  const fetchAdmins = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/admin/get`);
      if (res.data?.success && Array.isArray(res.data.admins)) {
        setAdmins(res.data.admins);
      } else if (Array.isArray(res.data)) {
        setAdmins(res.data);
      } else {
        setAdmins([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setAdmins([]);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`${baseURL}/api/admin/update/${editing}`, form);
        setEditing(null);
      } else {
        await axios.post(`${baseURL}/api/admin/create`, form);
      }

      setForm({ name: "", email: "", password: "" });
      fetchAdmins();
    } catch (err) {
      console.error("Save error:", err);
      alert("Server not responding or invalid request");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseURL}/api/admin/delete/${id}`);
      fetchAdmins();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Server not responding or invalid request");
    }
  };

  const handleEdit = (admin) => {
    setForm({ name: admin.name, email: admin.email, password: "" });
    setEditing(admin.id);
  };

  return (
    <div className={Style.AdminEdit}>
      <h1>Admin CRUD Panel</h1>

      <form onSubmit={handleSubmit} className={Style.form}>
        <input
          type="text"
          name="name"
          placeholder="Enter name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder={editing ? "Leave blank to keep" : "Enter password"}
          value={form.password}
          onChange={handleChange}
          required={!editing}
        />
        <button type="submit">{editing ? "Update Admin" : "Add Admin"}</button>
      </form>

      <h2>All Admins</h2>
      <table className={Style.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.length > 0 ? (
            admins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.id}</td>
                <td>{admin.name}</td>
                <td>{admin.email}</td>
                <td>{admin.password}</td>
                <td>
                  <button onClick={() => handleEdit(admin)}>Edit</button>
                  <button onClick={() => handleDelete(admin.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No admins found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminEdit;
