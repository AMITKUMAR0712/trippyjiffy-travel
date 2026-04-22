import pool from "../config/db.js";

export const getAllFaqs = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT f.id, f.question, f.answer, f.tour_id, f.created_at, f.updated_at
      FROM countrytours_faq f
      ORDER BY f.id DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error in getAllFaqs:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getFaqById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT f.id, f.question, f.answer, f.tour_id, f.created_at, f.updated_at
       FROM Countrytours_faq f
       WHERE f.id = ?`,
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "FAQ not found" });

    res.json(rows[0]);
  } catch (error) {
    console.error("Error in getFaqById:", error);
    res.status(500).json({ error: error.message });
  }
};

export const createFaq = async (req, res) => {
  try {
    const { question, answer, tour_id } = req.body;
    const [result] = await pool.query(
      "INSERT INTO Countrytours_faq (question, answer, tour_id) VALUES (?, ?, ?)",
      [question, answer, tour_id]
    );
    res.status(201).json({
      id: result.insertId,
      question,
      answer,
      tour_id,
    });
  } catch (error) {
    console.error("Error in createFaq:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, tour_id } = req.body;
    const [result] = await pool.query(
      `UPDATE Countrytours_faq
       SET question = ?, answer = ?, tour_id = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [question, answer, tour_id, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "FAQ not found" });

    res.json({ message: "FAQ updated successfully" });
  } catch (error) {
    console.error("Error in updateFaq:", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      "DELETE FROM Countrytours_faq WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "FAQ not found" });

    res.json({ message: "FAQ deleted successfully" });
  } catch (error) {
    console.error("Error in deleteFaq:", error);
    res.status(500).json({ error: error.message });
  }
};
