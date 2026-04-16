import pool from "../config/db.js";

async function checkCats() {
  try {
    const [rows] = await pool.query("SELECT id, region_name, image FROM CategoryIndia");
    console.log("All Categories:");
    console.log(JSON.stringify(rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

checkCats();
