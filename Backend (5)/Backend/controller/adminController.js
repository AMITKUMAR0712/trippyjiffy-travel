import pool from "../config/db.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = "your_jwt_secret_here";

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password required" });
  }

  try {
    const [results] = await pool.query(
      "SELECT * FROM Admin WHERE email = ? AND password = ?",
      [email, password]
    );

    if (results.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const admin = results[0];
    const token = jwt.sign(
      { id: admin.id, name: admin.name, email: admin.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (err) {
    console.error("DB error:", err);
    res
      .status(500)
      .json({ success: false, message: "DB error", error: err.message });
  }
};

const adminLogout = async (req, res) => {
  res.json({ success: true, message: "Logout successful" });
};

const createAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Name, email and password required" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO Admin (name, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    );

    res.json({
      success: true,
      message: "Admin created",
      admin: { id: result.insertId, name, email },
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "DB error", error: err.message });
  }
};

const getAdmins = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, password FROM Admin"
    );
    res.json({ success: true, admins: rows });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "DB error", error: err.message });
  }
};

const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    if (!password) {
      await pool.query("UPDATE Admin SET name=?, email=? WHERE id=?", [
        name,
        email,
        id,
      ]);
    } else {
      await pool.query(
        "UPDATE Admin SET name=?, email=?, password=? WHERE id=?",
        [name, email, password, id]
      );
    }

    res.json({ success: true, message: "Admin updated" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "DB error", error: err.message });
  }
};

const deleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM Admin WHERE id=?", [id]);
    res.json({ success: true, message: "Admin deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "DB error", error: err.message });
  }
};

export {
  adminLogin,
  adminLogout,
  createAdmin,
  getAdmins,
  updateAdmin,
  deleteAdmin,
};
