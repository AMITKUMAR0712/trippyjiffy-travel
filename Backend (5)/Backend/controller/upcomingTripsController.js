
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
    const parsed = typeof data === "string" ? JSON.parse(data) : data;
    return Array.isArray(parsed) ? parsed.flat().map(String) : [String(parsed)];
  } catch {
    return [String(data)];
  }
};

export const getAllUpcomingTrips = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM upcoming_trips ORDER BY created_at DESC");
    const trips = rows.map((r) => ({
      ...r,
      images: safeParse(r.images).map((img) =>
        img ? (img.startsWith("http") ? img : `${BASE_URL}/api/uploads/${img.replace(/^\/?uploads\//, "")}`) : null
      ),
      banner_image: r.banner_image ? (r.banner_image.startsWith("http") ? r.banner_image : `${BASE_URL}/api/uploads/${r.banner_image.replace(/^\/?uploads\//, "")}`) : null
    }));
    res.json(trips);
  } catch (err) {
    console.error("❌ getAllUpcomingTrips error:", err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

export const getUpcomingTripById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM upcoming_trips WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ message: "Not found" });

    res.json({
      ...rows[0],
      images: safeParse(rows[0].images).map((img) =>
        img ? (img.startsWith("http") ? img : `${BASE_URL}/api/uploads/${img.replace(/^\/?uploads\//, "")}`) : null
      ),
      banner_image: rows[0].banner_image ? (rows[0].banner_image.startsWith("http") ? rows[0].banner_image : `${BASE_URL}/api/uploads/${rows[0].banner_image.replace(/^\/?uploads\//, "")}`) : null
    });
  } catch (err) {
    console.error("❌ getUpcomingTripById error:", err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

export const addUpcomingTrip = async (req, res) => {
  const { title, tags, link, is_visible, description, details } = req.body;
  
  // Handle multiple images and a single banner image
  const images = [];
  let banner_image = null;

  if (req.files) {
    req.files.forEach(file => {
      if (file.fieldname === 'banner_image') {
        banner_image = file.filename;
      } else if (file.fieldname === 'images') {
        images.push(file.filename);
      }
    });
  }

  const visible = is_visible !== undefined ? is_visible : 1;

  try {
    const [result] = await pool.query(
      "INSERT INTO upcoming_trips (title, tags, link, images, banner_image, description, details, is_visible) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [title, tags, link, JSON.stringify(images), banner_image, description, details, visible]
    );

    res.status(201).json({
      id: result.insertId,
      title,
      tags,
      link,
      images: images.map((img) => `${BASE_URL}/api/uploads/${img}`),
      banner_image: banner_image ? `${BASE_URL}/api/uploads/${banner_image}` : null,
      description,
      details,
      is_visible: visible,
    });
  } catch (err) {
    console.error("❌ addUpcomingTrip error:", err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

export const updateUpcomingTrip = async (req, res) => {
  const { id } = req.params;
  const { title, tags, link, is_visible, description, details } = req.body;
  
  const newImages = [];
  let newBannerImage = null;

  if (req.files) {
    req.files.forEach(file => {
      if (file.fieldname === 'banner_image') {
        newBannerImage = file.filename;
      } else if (file.fieldname === 'images') {
        newImages.push(file.filename);
      }
    });
  }

  try {
    // Delete old files if new ones are uploaded
    if (newImages.length > 0 || newBannerImage) {
      const [rows] = await pool.query("SELECT images, banner_image FROM upcoming_trips WHERE id = ?", [id]);
      if (rows[0]) {
        if (newImages.length > 0 && rows[0].images) {
          const oldImages = safeParse(rows[0].images);
          oldImages.forEach(img => {
            if (img && !img.startsWith("http")) {
              const fullPath = path.join(__dirname, "../uploads", img.replace(/^\/?uploads\//, ""));
              if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
            }
          });
        }
        if (newBannerImage && rows[0].banner_image) {
          const fullPath = path.join(__dirname, "../uploads", rows[0].banner_image.replace(/^\/?uploads\//, ""));
          if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        }
      }
    }

    const [result] = await pool.query(
      "UPDATE upcoming_trips SET title = COALESCE(?, title), tags = COALESCE(?, tags), link = COALESCE(?, link), images = IF(? IS NOT NULL AND JSON_LENGTH(?) > 0, ?, images), banner_image = COALESCE(?, banner_image), description = COALESCE(?, description), details = COALESCE(?, details), is_visible = COALESCE(?, is_visible) WHERE id = ?",
      [
        title, 
        tags, 
        link, 
        newImages.length > 0 ? JSON.stringify(newImages) : null,
        newImages.length > 0 ? JSON.stringify(newImages) : null,
        newImages.length > 0 ? JSON.stringify(newImages) : null,
        newBannerImage, 
        description, 
        details, 
        is_visible, 
        id
      ]
    );

    if (!result.affectedRows) return res.status(404).json({ message: "Not found" });

    const [updatedRows] = await pool.query("SELECT * FROM upcoming_trips WHERE id = ?", [id]);
    res.json({
      ...updatedRows[0],
      images: safeParse(updatedRows[0].images).map((img) =>
        img ? `${BASE_URL}/api/uploads/${img.replace(/^\/?uploads\//, "")}` : null
      ),
      banner_image: updatedRows[0].banner_image ? `${BASE_URL}/api/uploads/${updatedRows[0].banner_image.replace(/^\/?uploads\//, "")}` : null,
      is_visible: updatedRows[0].is_visible,
    });
  } catch (err) {
    console.error("❌ updateUpcomingTrip error:", err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

export const deleteUpcomingTrip = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT images FROM upcoming_trips WHERE id = ?", [id]);

    if (rows[0]?.images) {
      const imgs = safeParse(rows[0].images);
      imgs.forEach((img) => {
        if (img && !img.startsWith("http")) {
            const fileName = img.replace(/^\/?uploads\//, "");
            const fullPath = path.join(__dirname, "../uploads", fileName);
            if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        }
      });
    }

    const [result] = await pool.query("DELETE FROM upcoming_trips WHERE id = ?", [id]);
    if (!result.affectedRows) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Deleted ✅" });
  } catch (err) {
    console.error("❌ deleteUpcomingTrip error:", err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

export const toggleUpcomingTripVisibility = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT is_visible FROM upcoming_trips WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ message: "Not found" });

    const newVisibility = rows[0].is_visible === 1 ? 0 : 1;
    await pool.query("UPDATE upcoming_trips SET is_visible = ? WHERE id = ?", [newVisibility, id]);

    res.json({ id, is_visible: newVisibility, message: "Visibility updated ✅" });
  } catch (err) {
    console.error("❌ toggleUpcomingTripVisibility error:", err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};
