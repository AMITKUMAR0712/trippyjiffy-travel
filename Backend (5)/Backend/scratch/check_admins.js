import pool from "../config/db.js";

async function checkAdmins() {
  try {
    const [rows] = await pool.query("SELECT * FROM Admin");
    console.log("Existing Admins:", rows);
    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

checkAdmins();
