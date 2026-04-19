import React, { useState, useEffect } from "react";
import axios from "axios";
import Style from "../Style/AdminBussianContent.module.scss";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const AdminBussianContent = () => {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({
    id: "",
    full_name: "",
    company_name: "",
    business_type: "",
    email: "",
    country_code: "+91",
    phone: "",
    website_links: "",
    office_address: "",
    city: "",
    country: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [viewContact, setViewContact] = useState(null);

  // Fetch All Contacts
  const fetchContacts = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/BussianContent/get/business`);
      setContacts(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setContacts([]);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(
          `${baseURL}/api/BussianContent/put/business/${form.id}`,
          form
        );
        alert("Contact updated successfully!");
      } else {
        await axios.post(`${baseURL}/api/BussianContent/post/business`, form);
        alert("Contact added successfully!");
      }
      resetForm();
      fetchContacts();
    } catch (error) {
      console.error("Error submitting contact:", error);
    }
  };

  const handleEdit = (contact) => {
    setForm(contact);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await axios.delete(
          `${baseURL}/api/BussianContent/delete/business/${id}`
        );
        alert("Contact deleted successfully!");
        fetchContacts();
      } catch (error) {
        console.error("Error deleting contact:", error);
      }
    }
  };

  const handleView = async (id) => {
    try {
      const res = await axios.get(
        `${baseURL}/api/BussianContent/business/${id}`
      );
      setViewContact(res.data);
    } catch (error) {
      console.error("Error fetching single contact:", error);
    }
  };

  const resetForm = () => {
    setForm({
      id: "",
      full_name: "",
      company_name: "",
      business_type: "",
      email: "",
      country_code: "+91",
      phone: "",
      website_links: "",
      office_address: "",
      city: "",
      country: "",
    });
    setIsEditing(false);
    setShowForm(false);
  };

  return (
    <div className={Style.AdminBussianContent}>
      <div className={Style.header}>
        <h2>Business Contacts Management</h2>
        <button
          className={Style.addNewBtn}
          onClick={() => {
            setShowForm(!showForm);
            resetForm();
          }}
        >
          {showForm ? "Close Form" : "Add New Contact"}
        </button>
      </div>
      {showForm && (
        <form className={Style.contactForm} onSubmit={handleSubmit}>
          <div className={Style.inputGroup}>
            <input
              type="text"
              name="full_name"
              placeholder="Full Name"
              value={form.full_name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="company_name"
              placeholder="Company Name"
              value={form.company_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Style.inputGroup}>
            <input
              type="text"
              name="business_type"
              placeholder="Business Type"
              value={form.business_type}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Style.inputGroup}>
            <input
              type="text"
              name="country_code"
              placeholder="Country Code"
              value={form.country_code}
              onChange={handleChange}
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <input
            type="text"
            name="website_links"
            placeholder="Website / Social Links"
            value={form.website_links}
            onChange={handleChange}
          />

          <input
            type="text"
            name="office_address"
            placeholder="Office Address"
            value={form.office_address}
            onChange={handleChange}
          />

          <div className={Style.inputGroup}>
            <input
              type="text"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={form.country}
              onChange={handleChange}
            />
          </div>

          <div className={Style.btnGroup}>
            <button type="submit">
              {isEditing ? "Update Contact" : "Add Contact"}
            </button>
            {isEditing && (
              <button
                type="button"
                className={Style.cancelBtn}
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
      <div className={Style.tableSection}>
        <h3>All Business Contacts</h3>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Company</th>
              <th>Business Type</th>
              <th>Email</th>
              <th>Phone</th>
              <th>City</th>
              <th>Country</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length ? (
              contacts.map((c, index) => (
                <tr key={c.id}>
                  <td>{index + 1}</td>
                  <td>{c.full_name}</td>
                  <td>{c.company_name}</td>
                  <td>{c.business_type}</td>
                  <td>{c.email}</td>
                  <td>
                    {c.country_code} {c.phone}
                  </td>
                  <td>{c.city}</td>
                  <td>{c.country}</td>
                  <td>
                    <div className={Style.actionBtns}>
                      <button
                        className={Style.viewBtn}
                        onClick={() => handleView(c.id)}
                      >
                        View
                      </button>
                      <button
                        className={Style.editBtn}
                        onClick={() => handleEdit(c)}
                      >
                        Edit
                      </button>
                      <button
                        className={Style.deleteBtn}
                        onClick={() => handleDelete(c.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No contacts found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {viewContact && (
        <div
          className={Style.modalOverlay}
          onClick={() => setViewContact(null)}
        >
          <div
            className={Style.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Contact Details</h3>
            <p>
              <strong>Full Name:</strong> {viewContact.full_name}
            </p>
            <p>
              <strong>Company:</strong> {viewContact.company_name}
            </p>
            <p>
              <strong>Business Type:</strong> {viewContact.business_type}
            </p>
            <p>
              <strong>Email:</strong> {viewContact.email}
            </p>
            <p>
              <strong>Phone:</strong> {viewContact.country_code}{" "}
              {viewContact.phone}
            </p>
            <p>
              <strong>Website:</strong> {viewContact.website_links || "N/A"}
            </p>
            <p>
              <strong>Address:</strong> {viewContact.office_address},{" "}
              {viewContact.city}, {viewContact.country}
            </p>
            <button onClick={() => setViewContact(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBussianContent;
