import pool from "../config/db.js";

export const addFaq = async (req, res) => {
  try {
    const { question, answer, state_id, tour_id } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: "Question and answer required" });
    }

    let finalTourId = null;
    let finalStateId = null;

    if (tour_id) {
      const [tourExists] = await pool.query(
        "SELECT id FROM tours WHERE id = ?",
        [tour_id]
      );
      if (tourExists.length) finalTourId = tour_id;
    }

    if (state_id) {
      const [stateExists] = await pool.query(
        "SELECT id FROM state WHERE id = ?",
        [state_id]
      );
      if (stateExists.length) finalStateId = state_id;
    }

    const [result] = await pool.query(
      "INSERT INTO tours_faq (question, answer, state_id, tour_id) VALUES (?, ?, ?, ?)",
      [question, answer, finalStateId, finalTourId]
    );

    res
      .status(201)
      .json({ message: "FAQ added successfully", faqId: result.insertId });
  } catch (error) {
    console.error("Error adding FAQ:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getAllFaqs = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT f.id, f.question, f.answer, f.state_id, f.tour_id, s.state_name, t.title AS tour_title
       FROM tours_faq f
       LEFT JOIN state s ON f.state_id = s.id
       LEFT JOIN tours t ON f.tour_id = t.id
       ORDER BY 
         CASE 
           WHEN f.id = 1 THEN 0
           WHEN f.id = 2 THEN 1
           ELSE 2
         END ASC,
         f.id DESC`
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, state_id, tour_id } = req.body;

    let finalTourId = null;
    let finalStateId = null;

    if (tour_id) {
      const [tourExists] = await pool.query(
        "SELECT id FROM tours WHERE id = ?",
        [tour_id]
      );
      if (tourExists.length) finalTourId = tour_id;
    }

    if (state_id) {
      const [stateExists] = await pool.query(
        "SELECT id FROM state WHERE id = ?",
        [state_id]
      );
      if (stateExists.length) finalStateId = state_id;
    }

    const [result] = await pool.query(
      "UPDATE tours_faq SET question = ?, answer = ?, state_id = ?, tour_id = ? WHERE id = ?",
      [question, answer, finalStateId, finalTourId, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    res.status(200).json({ message: "FAQ updated successfully" });
  } catch (error) {
    console.error("Error updating FAQ:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM tours_faq WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    res.status(200).json({ message: "FAQ deleted successfully" });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllStates = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, state_name FROM state");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching states:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllTours = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, title FROM tours");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching tours:", error);
    res.status(500).json({ message: "Server error" });
  }
};
