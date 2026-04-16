
import pool from "../config/db.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_URL = process.env.BASE_URL;

const safeParse = (data) => {
  if (!data) return [];
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed.flat().map(String) : [String(parsed)];
  } catch {
    return [String(data)];
  }
};

export const getAllCountries = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM asia");
    const countries = rows.map((r) => ({
      ...r,
      images: safeParse(r.images).map((img) =>
        img ? (img.startsWith("http") ? img : `${BASE_URL}/api/uploads/${img.replace(/^\/?uploads\//, "")}`) : null
      ),
    }));
    res.json(countries);
  } catch (err) {
    console.error("❌ getAllCountries error:", err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

export const getCountryById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM asia WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ message: "Not found" });

    res.json({
      ...rows[0],
      images: safeParse(rows[0].images).map((img) =>
        img ? (img.startsWith("http") ? img : `${BASE_URL}/api/uploads/${img.replace(/^\/?uploads\//, "")}`) : null
      ),
    });
  } catch (err) {
    console.error("❌ getCountryById error:", err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

export const addCountry = async (req, res) => {
  const { country_name, is_visible } = req.body;
  const images = req.files ? req.files.map((f) => f.filename) : [];
  const visible = is_visible !== undefined ? is_visible : 1;

  try {
    const [result] = await pool.query(
      "INSERT INTO asia (country_name, images, is_visible) VALUES (?, ?, ?)",
      [country_name, JSON.stringify(images), visible]
    );

    res.status(201).json({
      id: result.insertId,
      country_name,
      images: images.map((img) => `${BASE_URL}/api/uploads/${img}`),
      is_visible: visible,
    });
  } catch (err) {
    console.error("❌ addCountry error:", err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

export const updateCountry = async (req, res) => {
  const { id } = req.params;
  const { country_name, is_visible } = req.body;
  const newImages = req.files ? req.files.map((f) => f.filename) : null;

  try {
    if (newImages) {
      const [rows] = await pool.query("SELECT images FROM asia WHERE id = ?", [id]);
      if (rows[0]?.images) {
        const oldImages = safeParse(rows[0].images);
        oldImages.forEach((img) => {
          if (img) {
            const fullPath = path.join(__dirname, "../uploads", img);
            if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
          }
        });
      }
    }

    const [result] = await pool.query(
      "UPDATE asia SET country_name = ?, images = COALESCE(?, images), is_visible = COALESCE(?, is_visible) WHERE id = ?",
      [country_name, newImages ? JSON.stringify(newImages) : null, is_visible, id]
    );

    if (!result.affectedRows) return res.status(404).json({ message: "Not found" });

    const [updatedRows] = await pool.query("SELECT * FROM asia WHERE id = ?", [id]);
    res.json({
      ...updatedRows[0],
      images: safeParse(updatedRows[0].images).map((img) =>
        img ? `${BASE_URL}/api/uploads/${img}` : null
      ),
      is_visible: updatedRows[0].is_visible,
    });
  } catch (err) {
    console.error("❌ updateCountry error:", err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

export const deleteCountry = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT images FROM asia WHERE id = ?", [id]);

    if (rows[0]?.images) {
      const imgs = safeParse(rows[0].images);
      imgs.forEach((img) => {
        if (img) {
          const fullPath = path.join(__dirname, "../uploads", img);
          if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        }
      });
    }

    const [result] = await pool.query("DELETE FROM asia WHERE id = ?", [id]);
    if (!result.affectedRows) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Deleted ✅" });
  } catch (err) {
    console.error("❌ deleteCountry error:", err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

export const toggleVisibility = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT is_visible FROM asia WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ message: "Not found" });

    const newVisibility = rows[0].is_visible === 1 ? 0 : 1;
    await pool.query("UPDATE asia SET is_visible = ? WHERE id = ?", [newVisibility, id]);

    res.json({ id, is_visible: newVisibility, message: "Visibility updated ✅" });
  } catch (err) {
    console.error("❌ toggleVisibility error:", err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};
