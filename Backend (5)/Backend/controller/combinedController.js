import pool from "../config/db.js";

const safeParse = (data) => {
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [data];
  }
};

export const getCombinedData = async (req, res) => {
  try {
    const [states] = await pool.query(
      `SELECT s.id, s.state_name, s.category_id, s.image, c.region_name 
       FROM state s 
       JOIN CategoryIndia c ON s.category_id = c.id`
    );

    const [asia] = await pool.query("SELECT * FROM asia");

    const asiaFormatted = asia.map((r) => ({
      ...r,
      images: safeParse(r.images),
    }));

    const mergedData = [...states, ...asiaFormatted];

    res.json(mergedData);
  } catch (err) {
    console.error("Error in getCombinedData:", err);
    res.status(500).json({ error: "Server error" });
  }
};
