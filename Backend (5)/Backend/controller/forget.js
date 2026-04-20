import crypto from "crypto";
import nodemailer from "nodemailer";
import pool from "../config/db.js";
import bcrypt from "bcrypt";

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM userregister WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Email not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    const expireTimeIST = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    expireTimeIST.setDate(expireTimeIST.getDate() + 1);

    await pool.query(
      "UPDATE userregister SET reset_token = ?, reset_token_expire = ? WHERE email = ?",
      [token, expireTimeIST, email]
    );

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: email,
      subject: "Password Reset Link",
      html: `<p>Click here to reset your password (valid for 24 hours): <a href="${resetLink}">${resetLink}</a></p>`,
    });

    res.json({ message: "Reset link sent to your email." });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM userregister WHERE reset_token = ? AND reset_token_expire > NOW()",
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const email = rows[0].email;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE userregister SET password = ?, reset_token = NULL, reset_token_expire = NULL WHERE email = ?",
      [hashedPassword, email]
    );

    res.json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
