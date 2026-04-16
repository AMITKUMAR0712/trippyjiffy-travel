import pool from "../config/db.js";

async function checkMissing() {
  try {
    const [states] = await pool.query("SELECT id, state_name, image FROM state WHERE image IS NULL OR image = ''");
    const [countries] = await pool.query("SELECT id, country_name, images FROM asia WHERE images IS NULL OR images = '' OR images = '[]'");

    console.log("--- Missing Images Report ---");
    console.log(`States missing images (${states.length}):`);
    states.forEach(s => console.log(` - [${s.id}] ${s.state_name}`));
    
    console.log(`Countries missing images (${countries.length}):`);
    countries.forEach(c => console.log(` - [${c.id}] ${c.country_name}`));

  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

checkMissing();
