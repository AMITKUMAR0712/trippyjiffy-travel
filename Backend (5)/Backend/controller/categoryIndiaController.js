import pool from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

const addRegion = async (req, res) => {
  try {
    const { region_name } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!region_name) {
      return res.status(400).json({ message: "Region name is required" });
    }

    const [result] = await pool.query(
      "INSERT INTO categoryindia (region_name, image) VALUES (?, ?)",
      [region_name, image]
    );

    res.status(201).json({
      message: "Region added successfully",
      id: result.insertId,
      image,
    });
  } catch (error) {
    console.error("❌ Error adding region:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getRegions = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM categoryindia ORDER BY id ASC");
    const baseURL = process.env.BASE_URL || "";
    const data = rows.map((row) => ({
      ...row,
      image_url: row.image ? (row.image.startsWith("http") ? row.image : `${baseURL}/api/uploads/${row.image}`) : null,
    }));
    res.json(data);
  } catch (error) {
    console.error("❌ Error fetching regions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🟢 Get Region by ID
const getRegionById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM categoryindia WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Region not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error fetching region:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🟡 Update Region (with optional image)
const updateRegion = async (req, res) => {
  try {
    const { id } = req.params;
    const { region_name } = req.body;
    const image = req.file ? req.file.filename : null;

    const [existing] = await pool.query("SELECT * FROM categoryindia WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Region not found" });
    }

    const newRegionName = region_name || existing[0].region_name;
    const newImage = image || existing[0].image;

    await pool.query("UPDATE categoryindia SET region_name=?, image=? WHERE id=?", [
      newRegionName,
      newImage,
      id,
    ]);

    res.json({ message: "Region updated successfully" });
  } catch (error) {
    console.error("❌ Error updating region:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🔴 Delete Region
const deleteRegion = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query("SELECT * FROM categoryindia WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Region not found" });
    }

    await pool.query("DELETE FROM categoryindia WHERE id = ?", [id]);
    res.json({ message: "Region deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting region:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { addRegion, getRegions, getRegionById, updateRegion, deleteRegion };
