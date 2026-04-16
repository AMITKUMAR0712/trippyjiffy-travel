import pool from "../config/db.js";
import contactSend from "../utils/contactToAdmin.js";

export const addContact = async (req, res) => {
  const {
    full_name,
    email,
    country_code,
    phone,
    contact_via_email,
    contact_via_phone,
    contact_via_whatsapp,
    message,
  } = req.body;

  const normalizedCountryCode = country_code || "+91";

  if (!full_name || !email || !phone) {
    return res.status(400).json({
      message: "Full name, email, and phone are required",
    });
  }

  try {
    let insertId = null;
    try {
      const [result] = await pool.query(
        `INSERT INTO contact 
          (full_name, email, country_code, phone, contact_via_email, contact_via_phone, contact_via_whatsapp)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          full_name,
          email,
          normalizedCountryCode,
          phone,
          contact_via_email || false,
          contact_via_phone || false,
          contact_via_whatsapp || false,
        ]
      );
      insertId = result.insertId;
    } catch (dbError) {
      console.error("Contact DB insert error:", dbError);
    }

    const subject = `New Contact Inquiry from ${full_name}`;
    const emailMessage = `
      <h3>Contact Inquiry Details</h3>
      <p><strong>Full Name:</strong> ${full_name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${normalizedCountryCode} ${phone}</p>
      <p><strong>Message:</strong> ${message || "N/A"}</p>
      <p><strong>Preferred Contact Method:</strong></p>
      <ul>
        <li>Email: ${contact_via_email ? "Yes" : "No"}</li>
        <li>Call: ${contact_via_phone ? "Yes" : "No"}</li>
        <li>WhatsApp: ${contact_via_whatsapp ? "Yes" : "No"}</li>
      </ul>
    `;

    // Send email but don't block contact submission if it fails
    try {
      await contactSend(subject, emailMessage, email);
    } catch (emailError) {
      console.error("⚠️ Email sending failed but contact saved:", emailError);
    }

    res.status(201).json({
      message: "Thank you! We’ve received your query and will get back to you soon✅",
      id: insertId,
    });
  } catch (error) {
    console.error("Add contact error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getContacts = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM contact ORDER BY id DESC`);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Get contacts error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getContactById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(`SELECT * FROM contact WHERE id = ?`, [id]);
    if (rows.length === 0)
      return res.status(404).json({ message: "Contact not found" });
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Get contact by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const {
    full_name,
    email,
    country_code,
    phone,
    contact_via_email,
    contact_via_phone,
    contact_via_whatsapp,
  } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE contact
       SET full_name=?, email=?, country_code=?, phone=?, contact_via_email=?, contact_via_phone=?, contact_via_whatsapp=?
       WHERE id=?`,
      [
        full_name,
        email,
        country_code,
        phone,
        contact_via_email || false,
        contact_via_phone || false,
        contact_via_whatsapp || false,
        id,
      ]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Contact not found" });

    res.status(200).json({ message: "Contact updated successfully" });
  } catch (error) {
    console.error("Update contact error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(`DELETE FROM contact WHERE id = ?`, [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Contact not found" });

    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Delete contact error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
