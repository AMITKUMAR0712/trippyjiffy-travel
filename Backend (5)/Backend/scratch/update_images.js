import pool from "../config/db.js";

async function updateImages() {
  try {
    // 1. Update specific well-known states
    await pool.query("UPDATE state SET image = 'rajasthan_premium.png' WHERE state_name LIKE '%Rajasthan%'");
    await pool.query("UPDATE state SET image = 'south_india_premium.png' WHERE state_name LIKE '%Kerala%'");
    await pool.query("UPDATE state SET image = 'himalayas_premium.png' WHERE state_name LIKE '%Himachal%' OR state_name LIKE '%Uttarakhand%'");
    
    // 2. Clear out obvious screenshots from 'state' table
    await pool.query("UPDATE state SET image = 'himalayas_premium.png' WHERE image LIKE '%Screenshot%' OR image LIKE '%Capture%'");
    
    // 3. Update tours table as well if needed
    await pool.query("UPDATE tours SET description = REPLACE(description, 'Screenshot', 'himalayas_premium')");
    
    console.log("Database images updated successfully! ✅");
    process.exit(0);
  } catch (err) {
    console.error("Error updating images:", err.message);
    process.exit(1);
  }
}

updateImages();
