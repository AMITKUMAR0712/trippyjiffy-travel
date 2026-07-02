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

const buildAdminEnquiryEmail = ({
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
}) => `
  <div style="font-family:Arial,sans-serif;max-width:720px;margin:0 auto;color:#111827;">
    <div style="background:#0f172a;color:#ffffff;padding:24px 28px;border-radius:16px 16px 0 0;">
      <h2 style="margin:0 0 8px;">New Travel Enquiry Received</h2>
      <p style="margin:0;opacity:0.9;">A new lead has been submitted on the website.</p>
    </div>
    <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 16px 16px;padding:24px 28px;background:#ffffff;">
      <table style="width:100%;border-collapse:collapse;">
        ${detailRow("Full Name", escapeHtml(name))}
        ${detailRow("Email Address", escapeHtml(email))}
        ${detailRow("Phone / WhatsApp", escapeHtml(phone))}
        ${detailRow("Lead Source", escapeHtml(origin || "Website enquiry form"))}
        ${detailRow("Destination", escapeHtml(destination))}
        ${detailRow("Booking Timeline", escapeHtml(booking_timeline || "Not provided"))}
        ${detailRow("Holiday Budget", escapeHtml(holiday_budget || "Not provided"))}
        ${detailRow("Arrival Date", escapeHtml(arrival_date))}
        ${detailRow("Departure Date", escapeHtml(departure_date))}
        ${detailRow("Hotel Category", escapeHtml(hotel_category))}
        ${detailRow("Adults", escapeHtml(no_of_adults))}
        ${detailRow("Children", escapeHtml(no_of_children ?? 0))}
        ${detailRow("Special Requirements", formatLineBreaks(message || "Not provided"))}
      </table>
    </div>
  </div>
`;

const buildUserEnquiryEmail = ({
  name,
  destination,
  booking_timeline,
  holiday_budget,
  arrival_date,
  departure_date,
  hotel_category,
}) => `
  <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;color:#111827;">
    <div style="background:#f97316;color:#ffffff;padding:24px 28px;border-radius:16px 16px 0 0;">
      <h2 style="margin:0 0 8px;">Thank You for Reaching Out!</h2>
      <p style="margin:0;opacity:0.95;">We have received your travel enquiry and our team will contact you shortly.</p>
    </div>
    <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 16px 16px;padding:24px 28px;background:#ffffff;">
      <p style="margin-top:0;">Hi ${escapeHtml(name)},</p>
      <p>Thanks for sharing your trip details with TrippyJiffy. Here is a quick summary of your request:</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        ${detailRow("Destination", escapeHtml(destination))}
        ${detailRow("Booking Timeline", escapeHtml(booking_timeline || "Not provided"))}
        ${detailRow("Holiday Budget", escapeHtml(holiday_budget || "Not provided"))}
        ${detailRow("Travel Dates", `${escapeHtml(arrival_date)} to ${escapeHtml(departure_date)}`)}
        ${detailRow("Preferred Stay", escapeHtml(hotel_category))}
      </table>
      <p style="margin-bottom:0;">Our travel expert will connect with you soon with the best options.</p>
      <p style="margin-bottom:0;">Best regards,<br/>TrippyJiffy Team</p>
    </div>
  </div>
`;

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
    const adminMessage = buildAdminEnquiryEmail({
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
    });
    const userSubject = "Enquiry Confirmation - Travel Desk";
    const userMessage = buildUserEnquiryEmail({
      name,
      destination,
      booking_timeline,
      holiday_budget,
      arrival_date,
      departure_date,
      hotel_category,
    });

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
    console.error("Add enquiry error:", err?.sqlMessage || err.message, err);
    res.status(500).json({
      error: "Internal Server Error",
      message: process.env.NODE_ENV === "production"
        ? "Could not save enquiry. Please try again or contact support."
        : err?.sqlMessage || err.message,
    });
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
