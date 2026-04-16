import pool from "../config/db.js";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getBaseURL = (req) => {
  if (process.env.BASE_URL) return process.env.BASE_URL;
  const host = req.headers["x-forwarded-host"] || req.get("host");
  const protocol = req.headers["x-forwarded-proto"] || req.protocol;
  return `${protocol}://${host}`;
};

export const createState = async (req, res) => {
  try {
    const { state_name, asia_id } = req.body;
    const state_image = req.file ? req.file.filename : null;

    const [result] = await pool.query(
      "INSERT INTO asiastate (state_name, state_image, asia_id) VALUES (?, ?, ?)",
      [state_name, state_image, asia_id]
    );

    res.status(201).json({
      message: "State added successfully",
      id: result.insertId,
      image_url: state_image
        ? `${getBaseURL(req)}/uploads/${state_image}`
        : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getStates = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM asiastate ORDER BY id DESC");
    const baseURL = getBaseURL(req);
    const data = rows.map((row) => ({
      ...row,
      image_url: row.state_image
        ? `${baseURL}/uploads/${row.state_image}`
        : null,
    }));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getStateById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM asiastate WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ message: "State not found" });

    const baseURL = getBaseURL(req);
    const state = rows[0];
    state.image_url = state.state_image
      ? `${baseURL}/uploads/${state.state_image}`
      : null;

    res.json(state);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const updateState = async (req, res) => {
  try {
    const { id } = req.params;
    const { state_name, asia_id } = req.body;
    const state_image = req.file ? req.file.filename : null;

    if (state_image) {
      const [existing] = await pool.query(
        "SELECT state_image FROM asiastate WHERE id = ?",
        [id]
      );
      if (existing[0]?.state_image) {
        const fullPath = path.join(
          __dirname,
          "../uploads",
          existing[0].state_image
        );
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      }
    }

    let query = "UPDATE asiastate SET state_name = ?, asia_id = ?";
    const values = [state_name, asia_id];

    if (state_image) {
      query += ", state_image = ?";
      values.push(state_image);
    }
    query += " WHERE id = ?";
    values.push(id);

    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "State not found" });

    res.json({
      message: "State updated successfully",
      image_url: state_image
        ? `${getBaseURL(req)}/uploads/${state_image}`
        : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteState = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query(
      "SELECT state_image FROM asiastate WHERE id = ?",
      [id]
    );
    if (existing[0]?.state_image) {
      const fullPath = path.join(
        __dirname,
        "../uploads",
        existing[0].state_image
      );
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }

    const [result] = await pool.query("DELETE FROM asiastate WHERE id = ?", [
      id,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "State not found" });

    res.json({ message: "State deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
