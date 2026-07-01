import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function ensureEnquirySchema() {
  const migrations = [
    "ADD COLUMN booking_timeline VARCHAR(100) NULL",
    "ADD COLUMN holiday_budget VARCHAR(100) NULL",
    "MODIFY COLUMN origin VARCHAR(150) NULL",
  ];

  for (const clause of migrations) {
    try {
      await pool.query(`ALTER TABLE enquiries ${clause}`);
      console.log(`✅ enquiries schema: ${clause}`);
    } catch (err) {
      if (err.code === "ER_DUP_FIELDNAME") continue;
      if (clause.startsWith("MODIFY") && err.code === "ER_BAD_FIELD_ERROR") continue;
      console.error(`⚠️ enquiries schema (${clause}):`, err.message);
    }
  }
}

(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ MySQL Connected");
    conn.release();
    await ensureEnquirySchema();
  } catch (err) {
    console.error("❌ MySQL Connection Error:", err.message);
  }
})();

export default pool;
