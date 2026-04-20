import dotenv from "dotenv";
dotenv.config();

import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import { sendEmailToAdmin } from "../utils/contentSendToAdmin.js";
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed!"), false);
  },
});

export const registerUser = async (req, res) => {
  try {
    const { name, email, mobile, password, country } = req.body;

    if (!name || !email || !mobile || !password || !country) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const [existing] = await pool.query(
      "SELECT * FROM userregister WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let pdfBuffer = null;
    if (req.file) pdfBuffer = req.file.buffer;

    await pool.query(
      "INSERT INTO userregister (name, email, mobile, password, country, pdf_file) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, mobile, hashedPassword, country, pdfBuffer]
    );

    const adminSubject = "🆕 New User Registered";
    const adminHtml = `
      <h3>New User Registration</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mobile:</strong> ${mobile}</p>
      <p><strong>Country:</strong> ${country}</p>
      ${req.file ? `<p>PDF uploaded ✅</p>` : "<p>No PDF uploaded</p>"}
    `;
    
    // Send email but don't block registration if it fails
    try {
      await sendEmailToAdmin(adminSubject, adminHtml);
    } catch (emailError) {
      console.error("⚠️ Email sending failed but registration succeeded:", emailError);
    }

    res.status(201).json({ message: "User registered successfully ✅" });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await pool.query(
      "SELECT * FROM userregister WHERE email = ?",
      [email]
    );

    if (users.length === 0)
      return res.status(400).json({ message: "Invalid email or password" });

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = generateToken(user);
    res.json({ token, user });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT id, name, email, mobile, country, admin_message, created_at FROM userregister"
    );
    res.json(users);
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [users] = await pool.query(
      "SELECT id, name, email, mobile, country, admin_message, created_at FROM userregister WHERE id = ?",
      [id]
    );

    if (users.length === 0)
      return res.status(404).json({ message: "User not found" });

    res.json(users[0]);
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, mobile, country, password } = req.body;

    const updates = [name, email, mobile, country];
    let query =
      "UPDATE userregister SET name=?, email=?, mobile=?, country=?";

    if (password && password.trim() !== "") {
      const hashed = await bcrypt.hash(password, 10);
      query += ", password=?";
      updates.push(hashed);
    }

    if (req.file) {
      query += ", pdf_file=?";
      updates.push(req.file.buffer);
    }

    query += " WHERE id=?";
    updates.push(id);

    await pool.query(query, updates);
    res.json({ message: "User updated successfully ✅" });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM userregister WHERE id=?", [id]);
    res.json({ message: "User deleted successfully ❌" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getMe = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({ message: "Not authorized" });

    const [users] = await pool.query(
      "SELECT id, name, email, mobile, country, admin_message, created_at FROM userregister WHERE id=?",
      [req.user.id]
    );

    if (users.length === 0)
      return res.status(404).json({ message: "User not found" });

    res.json(users[0]);
  } catch (error) {
    console.error("Get Me Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const [users] = await pool.query(
        "SELECT * FROM userregister WHERE id=?",
        [decoded.id]
      );

      if (users.length === 0)
        return res.status(401).json({ message: "User not found" });

      req.user = users[0];
      return next();
    } catch (error) {
      console.error("Auth Error:", error);
      return res.status(401).json({ message: "Token invalid or expired" });
    }
  }

  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });
};


export const sendAdminMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminMessage } = req.body;

    if (!adminMessage)
      return res.status(400).json({ message: "Admin message required" });

    await pool.query(
      "UPDATE userregister SET admin_message=? WHERE id=?",
      [adminMessage, id]
    );

    res.json({ success: true, message: "Message sent successfully ✅" });
  } catch (error) {
    console.error("Send Admin Message Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getUserAnnouncements = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT id, name, admin_message, created_at FROM userregister WHERE id=? AND admin_message IS NOT NULL",
      [id]
    );

    res.json({ success: true, announcements: rows });
  } catch (error) {
    console.error("Get Announcements Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getUserPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const [users] = await pool.query(
      "SELECT pdf_file, name FROM userregister WHERE id=?",
      [id]
    );

    if (users.length === 0 || !users[0].pdf_file) {
      return res.status(404).json({ message: "PDF not found" });
    }

    const user = users[0];
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${user.name.replace(/\s+/g, "_")}.pdf`
    );
    res.send(user.pdf_file);
  } catch (error) {
    console.error("Get PDF Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};




export const deleteUserPDF = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const [users] = await pool.query(
      "SELECT pdf_file FROM userregister WHERE id=?",
      [id]
    );

    if (users.length === 0)
      return res.status(404).json({ message: "User not found" });

    if (!users[0].pdf_file)
      return res.status(400).json({ message: "No PDF to delete" });

    // Delete PDF (set pdf_file to NULL)
    await pool.query("UPDATE userregister SET pdf_file=NULL WHERE id=?", [id]);

    res.json({ message: "PDF deleted successfully ✅" });
  } catch (error) {
    console.error("Delete PDF Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


