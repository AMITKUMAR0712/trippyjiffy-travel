import pool from "../config/db.js";

async function updateImgs() {
  const updates = [
    { id: 65, img: "neemrana.png" },
    { id: 69, img: "delhi_agra.png" },
    { id: 68, img: "mathura_vrindavan.png" },
    { id: 74, img: "mathura_vrindavan.png" },
    { id: 71, img: "haridwar_rishikesh.png" },
    { id: 75, img: "haridwar_rishikesh.png" },
    { id: 73, img: "varanasi.png" },
    { id: 76, img: "bharatpur.png" },
    { id: 77, img: "ranthambore.png" },
    { id: 78, img: "amritsar.png" },
    { id: 81, img: "jaisalmer.png" },
    { id: 85, img: "karnataka.png" },
    { id: 86, img: "jim_corbett.png" }
  ];

  try {
    for (const item of updates) {
      await pool.query("UPDATE state SET image = ? WHERE id = ?", [item.img, item.id]);
      console.log(`✅ Updated ID ${item.id} with ${item.img}`);
    }
    console.log("--- All updates completed ---");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

updateImgs();
