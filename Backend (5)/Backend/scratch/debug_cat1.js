import pool from "../config/db.js";

async function debugImages() {
  try {
    const [rows] = await pool.query("SELECT id, state_name, image FROM state WHERE category_id = 1 OR id = 1");
    console.log("States with cat_id=1 or id=1:");
    console.log(JSON.stringify(rows, null, 2));
    
    // Check files
    const fs = await import("fs");
    const path = await import("path");
    
    rows.forEach(row => {
      const img = row.image;
      console.log(`\nChecking state: ${row.state_name}`);
      console.log(`Original img: ${img}`);
      
      if (img) {
         // Extract filename
         const filename = img.replace(/^https?:\/\/[^\/]+\/api\/uploads\//, "")
                            .replace(/^https?:\/\/[^\/]+\/uploads\//, "")
                            .replace(/^\/?api\/uploads\//, "")
                            .replace(/^\/?uploads\//, "")
                            .replace(/^\//, "");
         
         const fullPath = path.join(process.cwd(), "uploads", filename);
         console.log(`Filename extracted: ${filename}`);
         console.log(`Checking path: ${fullPath}`);
         if (fs.existsSync(fullPath)) {
           console.log("✅ File exists");
         } else {
           console.log("❌ File MISSING");
         }
      }
    });

  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

debugImages();
