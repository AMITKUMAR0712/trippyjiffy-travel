import pool from "../config/db.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export const addBusinessContact = async (req, res) => {
  try {
    const {
      full_name,
      company_name,
      business_type,
      email,
      country_code,
      phone,
      website_links,
      office_address,
      city,
      country,
    } = req.body;

    if (!full_name || !company_name || !business_type || !email || !phone) {
      return res.status(400).json({
        message:
          "Full Name, Company Name, Business Type, Email and Phone are required",
      });
    }

    const sql = `
      INSERT INTO business_contacts
      (full_name, company_name, business_type, email, country_code, phone, website_links, office_address, city, country)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
      full_name,
      company_name,
      business_type,
      email,
      country_code || "+91",
      phone,
      website_links || "",
      office_address,
      city,
      country,
    ]);

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.GMAIL_USER,
      subject: "New Business Contact Form Submission",
      html: `
        <h3>New Business Contact Received</h3>
        <p><strong>Full Name:</strong> ${full_name}</p>
        <p><strong>Company Name:</strong> ${company_name}</p>
        <p><strong>Business Type:</strong> ${business_type}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${country_code} ${phone}</p>
        <p><strong>Website / Social Links:</strong> ${
          website_links || "N/A"
        }</p>
        <p><strong>Office Address:</strong> ${office_address}, ${city}, ${country}</p>
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.error("Email send error:", err);
      else console.log("Email sent:", info.response);
    });

    res.status(201).json({
      success: true,
      message: "Thank you for contacting us! Our team will get back to you within 24 hours. ✅",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error adding business contact:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllBusinessContacts = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM business_contacts ORDER BY id DESC"
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getBusinessContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM business_contacts WHERE id = ?",
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "Contact not found" });

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error fetching contact:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateBusinessContact = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      full_name,
      company_name,
      business_type,
      email,
      country_code,
      phone,
      website_links,
      office_address,
      city,
      country,
    } = req.body;

    const sql = `
      UPDATE business_contacts
      SET full_name=?, company_name=?, business_type=?, email=?, country_code=?, phone=?, website_links=?, office_address=?, city=?, country=?
      WHERE id=?
    `;

    const [result] = await pool.query(sql, [
      full_name,
      company_name,
      business_type,
      email,
      country_code || "+91",
      phone,
      website_links || "",
      office_address,
      city,
      country,
      id,
    ]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Contact not found" });

    res
      .status(200)
      .json({ success: true, message: "Contact updated successfully" });
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteBusinessContact = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      "DELETE FROM business_contacts WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Contact not found" });

    res
      .status(200)
      .json({ success: true, message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ message: "Server error" });
  }
};
