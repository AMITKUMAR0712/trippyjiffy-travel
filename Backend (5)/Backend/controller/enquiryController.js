import pool from "../config/db.js";
import enquirySend from "../utils/enquirySend.js";

export const addEnquiry = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      origin,
      destination,
      arrival_date,
      departure_date,
      hotel_category,
      no_of_adults,
      no_of_children,
      message,
    } = req.body;

    const userId = req.user ? req.user.id : null;

    const [result] = await pool.query(
      `INSERT INTO enquiries 
      (user_id, name, email, phone, origin, destination, arrival_date, departure_date, hotel_category, no_of_adults, no_of_children, message) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        name,
        email,
        phone,
        origin,
        destination,
        arrival_date,
        departure_date,
        hotel_category,
        no_of_adults,
        no_of_children,
        message,
      ]
    );
    const adminSubject = `New Travel Enquiry from ${name}`;
    const adminMessage = `
      <h3>Enquiry Details</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Origin:</strong> ${origin}</p>
      <p><strong>Destination:</strong> ${destination}</p>
      <p><strong>Arrival Date:</strong> ${arrival_date}</p>
      <p><strong>Departure Date:</strong> ${departure_date}</p>
      <p><strong>Hotel Category:</strong> ${hotel_category}</p>
      <p><strong>No. of Adults:</strong> ${no_of_adults}</p>
      <p><strong>No. of Children:</strong> ${no_of_children}</p>
      <p><strong>Message:</strong> ${message}</p>
    `;
    const userSubject = "Enquiry Confirmation - Travel Desk";
    const userMessage = `
      <h3>Thank you for your enquiry, ${name}!</h3>
      <p>We have received your enquiry and will get back to you shortly.</p>
      <p><strong>Destination:</strong> ${destination}</p>
      <p><strong>Travel Dates:</strong> ${arrival_date} to ${departure_date}</p>
      <br/>
      <p>Best Regards,<br/>Travel Team</p>
    `;

    // Send emails but don't block enquiry if they fail
    try {
      await enquirySend(adminSubject, adminMessage, process.env.ADMIN_EMAIL);
      await enquirySend(userSubject, userMessage, email);
    } catch (emailError) {
      console.error("⚠️ Email sending failed but enquiry saved:", emailError);
    }

    res.status(201).json({
      message: "Enquiry added successfully",
      id: result.insertId,
    });
  } catch (err) {
    console.error("Add enquiry error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getEnquiries = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM enquiries ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Get enquiries error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getEnquiryById = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM enquiries WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Get enquiry by id error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      origin,
      destination,
      arrival_date,
      departure_date,
      hotel_category,
      no_of_adults,
      no_of_children,
      message,
    } = req.body;
    const data = {
      name,
      email,
      phone,
      origin,
      destination,
      arrival_date, 
      departure_date, 
      hotel_category,
      no_of_adults,
      no_of_children,
      message,
    };

    await pool.query("UPDATE enquiries SET ? WHERE id = ?", [data, id]);
    res.json({ message: "Enquiry updated successfully" });
  } catch (err) {
    console.error("Update enquiry error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM enquiries WHERE id = ?", [id]);
    res.json({ message: "Enquiry deleted successfully" });
  } catch (err) {
    console.error("Delete enquiry error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
