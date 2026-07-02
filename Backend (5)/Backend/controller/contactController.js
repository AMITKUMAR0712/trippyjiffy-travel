import pool from "../config/db.js";
import sendMail from "../utils/mailService.js";

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatLineBreaks = (value) => escapeHtml(value).replace(/\n/g, "<br/>");

const detailRow = (label, value) => `
  <tr>
    <td style="padding:10px 12px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">${escapeHtml(label)}</td>
    <td style="padding:10px 12px;border:1px solid #e5e7eb;">${value || "Not provided"}</td>
  </tr>
`;

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
      <div style="font-family:Arial,sans-serif;max-width:720px;margin:0 auto;color:#111827;">
        <div style="background:#0f172a;color:#ffffff;padding:24px 28px;border-radius:16px 16px 0 0;">
          <h2 style="margin:0 0 8px;">New Contact Form Submission</h2>
          <p style="margin:0;opacity:0.9;">A visitor submitted the website contact form.</p>
        </div>
        <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 16px 16px;padding:24px 28px;background:#ffffff;">
          <table style="width:100%;border-collapse:collapse;">
            ${detailRow("Full Name", escapeHtml(full_name))}
            ${detailRow("Email Address", escapeHtml(email))}
            ${detailRow("Phone Number", escapeHtml(`${normalizedCountryCode} ${phone}`))}
            ${detailRow("Message", formatLineBreaks(message || "Not provided"))}
            ${detailRow("Contact via Email", contact_via_email ? "Yes" : "No")}
            ${detailRow("Contact via Call", contact_via_phone ? "Yes" : "No")}
            ${detailRow("Contact via WhatsApp", contact_via_whatsapp ? "Yes" : "No")}
          </table>
        </div>
      </div>
    `;

    const userSubject = "We received your message - TrippyJiffy";
    const userMessage = `
      <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;color:#111827;">
        <div style="background:#f97316;color:#ffffff;padding:24px 28px;border-radius:16px 16px 0 0;">
          <h2 style="margin:0 0 8px;">Thank You for Contacting TrippyJiffy</h2>
          <p style="margin:0;opacity:0.95;">Your message has been received successfully.</p>
        </div>
        <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 16px 16px;padding:24px 28px;background:#ffffff;">
          <p style="margin-top:0;">Hi ${escapeHtml(full_name)},</p>
          <p>Thanks for contacting us. Our team will get back to you shortly.</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            ${detailRow("Email Address", escapeHtml(email))}
            ${detailRow("Phone Number", escapeHtml(`${normalizedCountryCode} ${phone}`))}
            ${detailRow("Your Message", formatLineBreaks(message || "Not provided"))}
          </table>
          <p style="margin-bottom:0;">Best regards,<br/>TrippyJiffy Team</p>
        </div>
      </div>
    `;

    // Send emails but don't block contact submission if it fails
    try {
      await sendMail(process.env.ADMIN_EMAIL, subject, emailMessage);
      await sendMail(email, userSubject, userMessage);
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
