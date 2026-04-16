import pool from "../config/db.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();
const BASE_URL = process.env.BASE_URL;
export const addState = async (req, res) => {
  try {
    const { state_name, category_id, is_visible } = req.body;
    if (!state_name || !category_id)
      return res.status(400).json({ msg: "state_name & category_id required" });

    const image = req.file ? req.file.filename : null;
    const visible = is_visible !== undefined ? is_visible : 1;

    const [result] = await pool.query(
      "INSERT INTO state (state_name, category_id, image, is_visible) VALUES (?, ?, ?, ?)",
      [state_name, category_id, image, visible]
    );

    res.status(201).json({
      msg: "State added",
      id: result.insertId,
      image_url: image ? `${BASE_URL}/api/uploads/${image}` : null,
      is_visible: visible,
    });
  } catch (err) {
    console.error("Error in addState:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const getStates = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.id, s.state_name, s.category_id, s.image, s.is_visible, c.region_name 
       FROM state s 
       JOIN CategoryIndia c ON s.category_id = c.id
       ORDER BY s.id DESC`
    );

    const data = rows.map((row) => ({
      ...row,
      image_url: row.image ? (row.image.startsWith("http") ? row.image : `${BASE_URL}/api/uploads/${row.image.replace(/^\/?uploads\//, "")}`) : null,
    }));

    res.json(data);
  } catch (err) {
    console.error("Error in getStates:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
export const updateState = async (req, res) => {
  try {
    const { id } = req.params;
    const { state_name, category_id, is_visible } = req.body;

    if (!state_name || !category_id)
      return res.status(400).json({ msg: "state_name & category_id required" });

    const [existing] = await pool.query("SELECT * FROM state WHERE id = ?", [id]);
    if (existing.length === 0)
      return res.status(404).json({ msg: "State not found" });

    let image = existing[0].image;

    if (req.file) {
      if (image) {
        const oldPath = path.join(process.cwd(), "uploads", image);
        fs.unlink(oldPath, (err) => { if (err) console.error(err); });
      }
      image = req.file.filename;
    }

    await pool.query(
      "UPDATE state SET state_name = ?, category_id = ?, image = ?, is_visible = ? WHERE id = ?",
      [state_name, category_id, image, is_visible !== undefined ? is_visible : existing[0].is_visible, id]
    );

    res.json({
      msg: "State updated successfully",
      image_url: image ? `${BASE_URL}/api/uploads/${image}` : null,
      is_visible: is_visible !== undefined ? is_visible : existing[0].is_visible,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
export const updateStateVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_visible } = req.body;

    const [existing] = await pool.query("SELECT * FROM state WHERE id = ?", [id]);
    if (existing.length === 0) return res.status(404).json({ msg: "State not found" });

    await pool.query("UPDATE state SET is_visible = ? WHERE id = ?", [is_visible, id]);
    res.json({ msg: "Visibility updated", is_visible });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
export const deleteState = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query("SELECT * FROM state WHERE id = ?", [id]);
    if (existing.length === 0) return res.status(404).json({ msg: "State not found" });

    if (existing[0].image) {
      const filePath = path.join(process.cwd(), "uploads", existing[0].image);
      fs.unlink(filePath, (err) => { if (err) console.error(err); });
    }

    await pool.query("DELETE FROM state WHERE id = ?", [id]);
    res.json({ msg: "State deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
