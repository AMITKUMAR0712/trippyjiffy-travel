import pool from "../config/db.js";
import sendMail from "../utils/mailService.js";

const BOOKING_TIMELINE_OPTIONS = [
  "Within 30 Days",
  "Within 1–3 Months",
  "Within 3–6 Months",
  "More than 6 Months",
  "Just Exploring Options",
];

const HOLIDAY_BUDGET_OPTIONS = [
  "Under 1000 USD per person",
  "1000-2000 USD per person",
  "2000-3000 USD per person",
  "Above 3000 USD per person",
];

const validateEnquiryFields = (body, requireNewFields = false) => {
  const {
    name,
    email,
    phone,
    destination,
    arrival_date,
    departure_date,
    hotel_category,
    no_of_adults,
    booking_timeline,
    holiday_budget,
  } = body;

  if (!name || !email || !phone || !destination || !arrival_date || !departure_date || !hotel_category) {
    return "Missing required fields";
  }

  if (requireNewFields) {
    if (!booking_timeline || !BOOKING_TIMELINE_OPTIONS.includes(booking_timeline)) {
      return "Please select when you are planning to book your holiday";
    }
    if (!holiday_budget || !HOLIDAY_BUDGET_OPTIONS.includes(holiday_budget)) {
      return "Please select an approximate holiday budget";
    }
  }

  if (booking_timeline && !BOOKING_TIMELINE_OPTIONS.includes(booking_timeline)) {
    return "Invalid booking timeline option";
  }

  if (holiday_budget && !HOLIDAY_BUDGET_OPTIONS.includes(holiday_budget)) {
    return "Invalid holiday budget option";
  }

  if (Number(no_of_adults) < 1) {
    return "Number of adults must be at least 1";
  }

  return null;
};

export const addEnquiry = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      origin,
      destination,
      booking_timeline,
      holiday_budget,
      arrival_date,
      departure_date,
      hotel_category,
      no_of_adults,
      no_of_children,
      message,
    } = req.body;

    const isQuickLead = ["Quick Lead", "VIP Leads", "Custom Trip"].includes(hotel_category);
    const validationError = validateEnquiryFields(req.body, !isQuickLead);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const userId = req.user ? req.user.id : null;

    const [result] = await pool.query(
      `INSERT INTO enquiries 
      (user_id, name, email, phone, origin, destination, booking_timeline, holiday_budget, arrival_date, departure_date, hotel_category, no_of_adults, no_of_children, message) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        name,
        email,
        phone,
        origin || null,
        destination,
        booking_timeline || null,
        holiday_budget || null,
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
      ${origin ? `<p><strong>Origin:</strong> ${origin}</p>` : ""}
      <p><strong>Destination:</strong> ${destination}</p>
      ${booking_timeline ? `<p><strong>Booking Timeline:</strong> ${booking_timeline}</p>` : ""}
      ${holiday_budget ? `<p><strong>Holiday Budget:</strong> ${holiday_budget}</p>` : ""}
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
      ${booking_timeline ? `<p><strong>Booking Timeline:</strong> ${booking_timeline}</p>` : ""}
      ${holiday_budget ? `<p><strong>Holiday Budget:</strong> ${holiday_budget}</p>` : ""}
      <p><strong>Travel Dates:</strong> ${arrival_date} to ${departure_date}</p>
      <br/>
      <p>Best Regards,<br/>Travel Team</p>
    `;

    try {
      await sendMail(process.env.ADMIN_EMAIL, adminSubject, adminMessage);
      await sendMail(email, userSubject, userMessage);
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
      booking_timeline,
      holiday_budget,
      arrival_date,
      departure_date,
      hotel_category,
      no_of_adults,
      no_of_children,
      message,
    } = req.body;

    const validationError = validateEnquiryFields(req.body, false);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const data = {
      name,
      email,
      phone,
      origin: origin || null,
      destination,
      booking_timeline: booking_timeline || null,
      holiday_budget: holiday_budget || null,
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

export const sendAdminMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminMessage } = req.body;
    await pool.query("UPDATE enquiries SET admin_message = ? WHERE id = ?", [adminMessage, id]);
    res.json({ message: "Announcement sent successfully" });
  } catch (err) {
    console.error("Send announcement error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
