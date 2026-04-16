import pool from "../config/db.js";

async function seed() {
  try {
    const [rows] = await pool.query("SELECT * FROM admin");
    console.log(`Current admin count: ${rows.length}`);

    // Check if we have an admin or if we can pull from backup
    if (rows.length === 0 || (rows.length === 1 && !rows[0].email)) {
      console.log("No valid admin found, attempting to seed from backup or default...");
      
      try {
        const [backups] = await pool.query("SELECT * FROM admin_backup LIMIT 1");
        if (backups.length > 0) {
          const b = backups[0];
          await pool.query("DELETE FROM admin"); // Clean junk
          await pool.query(
            "INSERT INTO admin (name, email, password) VALUES (?, ?, ?)",
            [b.name, b.email, b.password]
          );
          console.log(`✅ Admin restored from backup: ${b.email}`);
        } else {
          // Default admin
          await pool.query("DELETE FROM admin"); 
          await pool.query(
            "INSERT INTO admin (name, email, password) VALUES (?, ?, ?)",
            ["Admin", "admin@trippyjiffy.com", "admin123"]
          );
          console.log("✅ Default admin created: admin@trippyjiffy.com / admin123");
        }
      } catch (backupErr) {
        console.error("Backup table doesn't exist or is empty, creating default...");
        await pool.query("DELETE FROM admin"); 
        await pool.query(
          "INSERT INTO admin (name, email, password) VALUES (?, ?, ?)",
          ["Admin", "admin@trippyjiffy.com", "admin123"]
        );
        console.log("✅ Default admin created: admin@trippyjiffy.com / admin123");
      }
    } else {
      console.log("✅ Admin table already has data.");
    }
  } catch (err) {
    console.error("❌ Seeding Error:", err.message);
  } finally {
    process.exit();
  }
}

seed();
