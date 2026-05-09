import pool from "../config/db.js";
import sendMail from "../utils/mailService.js";
const addFeedback = async (req, res) => {
  try {
    const { name, destination, rating, review, origin } = req.body;

    if (!name || !rating || !review) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    let photo = null;
    if (req.file) {
      photo = `/uploads/${req.file.filename}`;
    }

    const [result] = await pool.query(
      "INSERT INTO feedback (name, photo, destination, rating, review, origin) VALUES (?, ?, ?, ?, ?, ?)",
      [name, photo, destination || null, rating, review, origin || null]
    );

    // Email to admin
    try {
      const subject = `New Customer Feedback from ${name}`;
      const html = `
        <h3>New Feedback Received</h3>
        <p><b>Customer:</b> ${name}</p>
        <p><b>Destination:</b> ${destination || "N/A"}</p>
        <p><b>Rating:</b> ${rating} Stars</p>
        <p><b>Review:</b> ${review}</p>
        <p><b>Origin:</b> ${origin || "N/A"}</p>
      `;
      await sendMail(process.env.ADMIN_EMAIL, subject, html);
    } catch (err) {
      console.log("Feedback email error:", err.message);
    }

    res.status(201).json({ message: "Feedback added successfully", id: result.insertId, photo });
  } catch (error) {
    console.error("Error adding feedback:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all feedbacks
const getFeedbacks = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM feedback ORDER BY created_at DESC");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const getFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM feedback WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, destination, rating, review, origin } = req.body;

    const [existing] = await pool.query("SELECT * FROM feedback WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    let photo = existing[0].photo;
    if (req.file) {
      photo = `/uploads/${req.file.filename}`;
    }

    await pool.query(
      "UPDATE feedback SET name=?, photo=?, destination=?, rating=?, review=?, origin=? WHERE id=?",
      [
        name || existing[0].name,
        photo,
        destination || existing[0].destination,
        rating || existing[0].rating,
        review || existing[0].review,
        origin || existing[0].origin,
        id,
      ]
    );

    res.json({ message: "Feedback updated successfully" });
  } catch (error) {
    console.error("Error updating feedback:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete feedback
const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await pool.query("SELECT * FROM feedback WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    await pool.query("DELETE FROM feedback WHERE id = ?", [id]);
    res.json({ message: "Feedback deleted successfully" });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { addFeedback, getFeedbacks, getFeedbackById, updateFeedback, deleteFeedback };
