



import pool from "../config/db.js";
import fs from "fs";


export const sendPDFToUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!req.file) return res.status(400).json({ message: "No PDF uploaded" });

    // Read uploaded file as buffer
    const pdfBuffer = fs.readFileSync(req.file.path);

    await pool.query(
      "INSERT INTO user_documents (user_id, pdf_name, pdf_file, uploaded_at) VALUES (?, ?, ?, NOW())",
      [userId, req.file.originalname, pdfBuffer]
    );

    fs.unlinkSync(req.file.path);
    res.status(200).json({ message: "✅ PDF uploaded successfully" });
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


export const getUserPDFsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await pool.query(
      "SELECT id, user_id, pdf_name, uploaded_at FROM user_documents WHERE user_id = ? ORDER BY uploaded_at DESC",
      [userId]
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error("❌ Fetch error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


export const downloadPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT pdf_name, pdf_file FROM user_documents WHERE id = ?",
      [id]
    );

    if (!rows.length) return res.status(404).json({ message: "PDF not found" });

    const pdf = rows[0];
    res.setHeader("Content-Disposition", `attachment; filename="${pdf.pdf_name}"`);
    res.setHeader("Content-Type", "application/pdf");
    res.end(pdf.pdf_file);
  } catch (error) {
    console.error("❌ Download error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


export const deletePDF = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT id FROM user_documents WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ message: "PDF not found" });

    await pool.query("DELETE FROM user_documents WHERE id = ?", [id]);
    res.status(200).json({ message: "🗑️ PDF deleted successfully" });
  } catch (error) {
    console.error("❌ Delete error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
