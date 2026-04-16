import bcrypt from "bcrypt";
import pool from "../config/db.js";

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM UserRegister WHERE reset_token = ? AND reset_token_expire > NOW()",
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const email = rows[0].email;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE UserRegister SET password = ?, reset_token = NULL, reset_token_expire = NULL WHERE email = ?",
      [hashedPassword, email]
    );

    res.json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
