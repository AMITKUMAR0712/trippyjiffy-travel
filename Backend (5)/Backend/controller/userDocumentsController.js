import pool from "../config/db.js";
import fs from "fs";
import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/tempPDFs";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueName);
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files allowed"));
  },
});

export const uploadPDF = async (req, res) => {
  try {
    const user_id = req.user?.id || null; 
    const { pdf_text } = req.body;

    let pdf_name = null;
    let pdf_data = null;

    if (req.file) {
      pdf_name = req.file.originalname;
      pdf_data = fs.readFileSync(req.file.path);
      fs.unlinkSync(req.file.path);
    }

    if (!pdf_name && !pdf_text?.trim()) {
      return res.status(400).json({ message: "PDF file or text required" });
    }

    await pool.query(
      "INSERT INTO userdocuments (user_id, pdf_name, pdf_text, pdf_file) VALUES (?, ?, ?, ?)",
      [user_id, pdf_name, pdf_text || "", pdf_data]
    );

    res.json({ success: true, message: "Document uploaded successfully ✅" });
  } catch (err) {
    console.error("❌ Upload PDF/Text Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getAllPDFs = async (req, res) => {
  try {
    const [pdfs] = await pool.query(
      "SELECT id, user_id, pdf_name, pdf_text, uploaded_at, pdf_file IS NOT NULL AS has_file FROM userdocuments ORDER BY uploaded_at DESC"
    );
    res.json({ success: true, pdfs });
  } catch (err) {
    console.error("❌ Get All PDFs Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getUserPDFs = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });

    const user_id = req.user.id;
    const [pdfs] = await pool.query(
      "SELECT id, pdf_name, pdf_text, uploaded_at, pdf_file IS NOT NULL AS has_file FROM userdocuments WHERE user_id=? ORDER BY uploaded_at DESC",
      [user_id]
    );
    res.json({ success: true, pdfs });
  } catch (err) {
    console.error("❌ Get PDFs Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


export const downloadPDF = async (req, res) => {
  const pdfId = req.params.id;

  try {
    const [rows] = await pool.query(
      "SELECT pdf_name, pdf_file FROM userdocuments WHERE id = ?",
      [pdfId]
    );

    if (rows.length === 0) {
      console.error(`❌ Download failed: No PDF found with id=${pdfId}`);
      return res.status(404).json({ success: false, message: "PDF not found" });
    }

    const pdf = rows[0];

    if (!pdf.pdf_file || pdf.pdf_file.length === 0) {
      console.error(
        `❌ Download failed: PDF file is empty for id=${pdfId}, name=${pdf.pdf_name}`
      );
      return res
        .status(404)
        .json({ success: false, message: "PDF file is empty" });
    }

    const buffer = Buffer.isBuffer(pdf.pdf_file)
      ? pdf.pdf_file
      : Buffer.from(pdf.pdf_file, "binary");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${pdf.pdf_name}"`
    );

    console.log(`✅ PDF download success: id=${pdfId}, name=${pdf.pdf_name}`);
    res.send(buffer);
  } catch (err) {
    console.error(`❌ Download PDF Error for id=${pdfId}:`, err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const deletePDF = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT user_id FROM userdocuments WHERE id=?",
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ message: "Document not found" });

    // Only admin or owner can delete
    if (!req.user || (req.user.role !== "admin" && rows[0].user_id !== req.user.id))
      return res.status(403).json({ message: "Access denied" });

    await pool.query("DELETE FROM userdocuments WHERE id=?", [id]);
    res.json({ success: true, message: "Document deleted successfully ✅" });
  } catch (err) {
    console.error("❌ Delete Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
