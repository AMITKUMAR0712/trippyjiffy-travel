import pool from "./config/db.js";

async function alterEnquiriesTable() {
  try {
    console.log("Altering enquiries table...");

    const columns = [
      "ADD COLUMN booking_timeline VARCHAR(100) NULL",
      "ADD COLUMN holiday_budget VARCHAR(100) NULL",
      "MODIFY COLUMN origin VARCHAR(150) NULL",
    ];

    for (const column of columns) {
      try {
        await pool.query(`ALTER TABLE enquiries ${column}`);
        console.log(`Applied: ${column}`);
      } catch (error) {
        if (error.code === "ER_DUP_FIELDNAME") {
          console.log(`Column already exists: ${column}`);
        } else {
          throw error;
        }
      }
    }

    console.log("Enquiries table altered successfully.");
  } catch (error) {
    console.error("Error altering enquiries table:", error.message);
  } finally {
    process.exit();
  }
}

alterEnquiriesTable();
