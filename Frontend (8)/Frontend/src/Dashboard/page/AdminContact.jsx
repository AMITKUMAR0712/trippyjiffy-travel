import React, { useState, useEffect } from "react";
import axios from "axios";
import Style from "../Style/AdminContact.module.scss";

const AdminContact = () => {
  const [contacts, setContacts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editContact, setEditContact] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    country_code: "+91",
    phone: "",
    contact_via_email: false,
    contact_via_phone: false,
    contact_via_whatsapp: false,
  });

  const baseURL = import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com";

  const fetchContacts = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/contact/get`);
      setContacts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching contacts:", err);
      setContacts([]);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openModal = (contact = null) => {
    if (contact) {
      setEditContact(contact);
      setFormData({
        full_name: contact.full_name || "",
        email: contact.email || "",
        country_code: contact.country_code || "+91",
        phone: contact.phone || "",
        contact_via_email: contact.contact_via_email || false,
        contact_via_phone: contact.contact_via_phone || false,
        contact_via_whatsapp: contact.contact_via_whatsapp || false,
      });
    } else {
      setEditContact(null);
      setFormData({
        full_name: "",
        email: "",
        country_code: "+91",
        phone: "",
        contact_via_email: false,
        contact_via_phone: false,
        contact_via_whatsapp: false,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditContact(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (editContact) {
        await axios.put(
          `${baseURL}/api/contact/put/${editContact.id}`,
          payload
        );
        alert("Contact updated successfully ✅");
      } else {
        await axios.post(`${baseURL}/api/contact/post`, payload);
        alert("Contact added successfully ✅");
      }
      fetchContacts();
      closeModal();
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Failed to submit. Check console for details.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?"))
      return;
    try {
      await axios.delete(`${baseURL}/api/contact/delete/${id}`);
      fetchContacts();
    } catch (err) {
      console.error("Error deleting contact:", err);
    }
  };

  return (
    <div className={Style.adminContainer}>
      <h2>Contact Enquiries</h2>
      <button onClick={() => openModal()} className={Style.addBtn}>
        Add Contact
      </button>

      <table className={Style.contactTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Country Code</th>
            <th>Email</th>
            <th>Call</th>
            <th>WhatsApp</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.length > 0 ? (
            contacts.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.full_name}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>{c.country_code}</td>
                <td>{c.contact_via_email ? "Yes" : "No"}</td>
                <td>{c.contact_via_phone ? "Yes" : "No"}</td>
                <td>{c.contact_via_whatsapp ? "Yes" : "No"}</td>
                <td>
                  <button onClick={() => openModal(c)}>Edit</button>
                  <button onClick={() => handleDelete(c.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">No contacts found</td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <div className={Style.modalOverlay}>
          <div className={Style.modalContent}>
            <h3>{editContact ? "Edit Contact" : "Add Contact"}</h3>
            <form onSubmit={handleSubmit} className={Style.contactForm}>
              <input
                type="text"
                name="full_name"
                placeholder="Full Name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="country_code"
                placeholder="Country Code"
                value={formData.country_code}
                onChange={handleChange}
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              <label>
                <input
                  type="checkbox"
                  name="contact_via_email"
                  checked={formData.contact_via_email}
                  onChange={handleChange}
                />{" "}
                Contact via Email
              </label>

              <label>
                <input
                  type="checkbox"
                  name="contact_via_phone"
                  checked={formData.contact_via_phone}
                  onChange={handleChange}
                />{" "}
                Contact via Call
              </label>

              <label>
                <input
                  type="checkbox"
                  name="contact_via_whatsapp"
                  checked={formData.contact_via_whatsapp}
                  onChange={handleChange}
                />{" "}
                Contact via WhatsApp
              </label>

              <div className={Style.formButtons}>
                <button type="submit">{editContact ? "Update" : "Add"}</button>
                <button type="button" onClick={closeModal}>
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

export default AdminContact;
