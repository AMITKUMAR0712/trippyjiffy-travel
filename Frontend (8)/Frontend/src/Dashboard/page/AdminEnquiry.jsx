import React, { useEffect, useState } from "react";
import axios from "axios";
import Style from "../Style/AdminEnquiry.module.scss";

const AdminEnquiry = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEnquiry, setEditingEnquiry] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    origin: "",
    destination: "",
    arrival_date: "",
    departure_date: "",
    hotel_category: "",
    no_of_adults: 1,
    no_of_children: 0,
    message: "",
    admin_message: "",
  });

  const fetchEnquiries = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/enquiry/get`);
      setEnquiries(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching enquiries:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this enquiry?")) {
      try {
        await axios.delete(`${baseURL}/api/enquiry/delete/${id}`);
        fetchEnquiries();
      } catch (err) {
        console.error("Error deleting enquiry:", err);
      }
    }
  };

  const handleEdit = (enquiry) => {
    setEditingEnquiry(enquiry.id);
    setForm({
      ...enquiry,
      arrival_date: enquiry.arrival_date
        ? enquiry.arrival_date.slice(0, 10)
        : "",
      departure_date: enquiry.departure_date
        ? enquiry.departure_date.slice(0, 10)
        : "",
    });
    setShowAddForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingEnquiry) {
        await axios.put(
          `${baseURL}/api/enquiry/update/${editingEnquiry}`,
          form
        );
        alert("Enquiry updated ✅");
      } else {
        await axios.post(`${baseURL}/api/enquiry/post`, form);
        alert("Enquiry added ✅");
      }
      setForm({
        name: "",
        email: "",
        phone: "",
        origin: "",
        destination: "",
        arrival_date: "",
        departure_date: "",
        hotel_category: "",
        no_of_adults: 1,
        no_of_children: 0,
        message: "",
        admin_message: "",
      });
      setEditingEnquiry(null);
      setShowAddForm(false);
      fetchEnquiries();
    } catch (err) {
      console.error("Error saving enquiry:", err);
      alert("Failed to save enquiry ❌");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSendAnnouncement = async (id, adminMessage) => {
    if (!adminMessage) return alert("Please enter a message to send.");
    try {
      await axios.put(`${baseURL}/api/enquiry/send-admin-message/${id}`, {
        adminMessage,
      });
      alert("Announcement sent successfully ✅");
      fetchEnquiries();
    } catch (err) {
      console.error("Error sending announcement:", err);
      alert("Failed to send announcement ❌");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className={Style.adminEnquiry}>
      <h2>Admin Enquiries Panel</h2>
      <button className={Style.addBtn} onClick={() => setShowAddForm(true)}>
        + Add Enquiry
      </button>

      <div className={Style.tableWrapper}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Origin</th>
              <th>Destination</th>
              <th>Arrival</th>
              <th>Departure</th>
              <th>Hotel</th>
              <th>Adults</th>
              <th>Children</th>
              <th>Message</th>
              <th>Admin Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((enq) => (
              <tr key={enq.id}>
                <td>{enq.id}</td>
                <td>{enq.name}</td>
                <td>{enq.email}</td>
                <td>{enq.phone}</td>
                <td>{enq.origin}</td>
                <td>{enq.destination}</td>
                <td>{enq.arrival_date}</td>
                <td>{enq.departure_date}</td>
                <td>{enq.hotel_category}</td>
                <td>{enq.no_of_adults}</td>
                <td>{enq.no_of_children}</td>
                <td>{enq.message}</td>
                <td>{enq.admin_message || "-"}</td>
                <td>
                  <button onClick={() => handleEdit(enq)}>Edit</button>
                  <button
                    className={Style.deleteBtn}
                    onClick={() => handleDelete(enq.id)}
                  >
                    Delete
                  </button>
                  <button
                    className={Style.sendBtn}
                    onClick={() => {
                      const msg = prompt(
                        "Enter message to send to user:",
                        enq.admin_message || ""
                      );
                      if (msg !== null) handleSendAnnouncement(enq.id, msg);
                    }}
                  >
                    Send Announcement
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddForm && (
        <div className={Style.overlay}>
          <div className={Style.formBox}>
            <h3>{editingEnquiry ? "Edit Enquiry" : "Add Enquiry"}</h3>
            <form onSubmit={handleSave}>
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
              <label>Origin</label>
              <input
                type="text"
                name="origin"
                value={form.origin}
                onChange={handleChange}
                required
              />
              <label>Destination</label>
              <input
                type="text"
                name="destination"
                value={form.destination}
                onChange={handleChange}
                required
              />
              <label>Arrival Date</label>
              <input
                type="date"
                name="arrival_date"
                value={form.arrival_date}
                onChange={handleChange}
                required
              />
              <label>Departure Date</label>
              <input
                type="date"
                name="departure_date"
                value={form.departure_date}
                onChange={handleChange}
                required
              />
              <label>Hotel Category</label>
              <select
                name="hotel_category"
                value={form.hotel_category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="3 Star">3 Star</option>
                <option value="4 Star">4 Star</option>
                <option value="5 Star">5 Star</option>
                <option value="Luxury">Luxury</option>
              </select>
              <label>No. of Adults</label>
              <input
                type="number"
                name="no_of_adults"
                value={form.no_of_adults}
                onChange={handleChange}
                required
              />
              <label>No. of Children</label>
              <input
                type="number"
                name="no_of_children"
                value={form.no_of_children}
                onChange={handleChange}
              />
              <label>Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
              />
              <label>Admin Message</label>
              <textarea
                name="admin_message"
                value={form.admin_message}
                onChange={handleChange}
              />

              <div className={Style.btnGroup}>
                <button type="submit">
                  {editingEnquiry ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingEnquiry(null);
                    setForm({
                      name: "",
                      email: "",
                      phone: "",
                      origin: "",
                      destination: "",
                      arrival_date: "",
                      departure_date: "",
                      hotel_category: "",
                      no_of_adults: 1,
                      no_of_children: 0,
                      message: "",
                      admin_message: "",
                    });
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

export default AdminEnquiry;
