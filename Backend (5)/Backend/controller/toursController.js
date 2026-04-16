import pool from "../config/db.js";

export const getAllTours = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM tours ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching tours:", err);
    res.status(500).json({ message: "Database error" });
  }
};

export const getTourById = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM tours WHERE id = ?", [
      req.params.id,
    ]);
    if (!rows.length) {
      return res.status(404).json({ message: "Tour not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching tour:", err);
    res.status(500).json({ message: "Database error" });
  }
};

export const addTour = async (req, res) => {
  try {
    const {
      state_id,
      title,
      description,
      routing,
      sightseeing_points,
      inclusions,
      activities,
      monument_info,
      market_info,
      supplemental_activities,
      exclusions,
    } = req.body || {};

    if (!state_id || !title) {
      return res.status(400).json({ message: "state_id and title required" });
    }

    const [existing] = await pool.query(
      "SELECT * FROM tours WHERE state_id = ?",
      [state_id]
    );
    if (existing.length) {
      return res.status(400).json({
        message: "A tour for this state already exists ❌",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO tours 
      (state_id, title, description, routing, sightseeing_points, inclusions, activities, monument_info, market_info, supplemental_activities, exclusions) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        state_id,
        title,
        description || null,
        routing || null,
        sightseeing_points || null,
        inclusions || null,
        activities || null,
        monument_info || null,
        market_info || null,
        supplemental_activities || null,
        exclusions || null,
      ]
    );

    res.status(201).json({
      id: result.insertId,
      title,
      state_id,
      message: "Tour added successfully ✅",
    });
  } catch (err) {
    console.error("Error adding tour:", err);
    res.status(500).json({ message: "Database error" });
  }
};

export const updateTour = async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;

    if (!Object.keys(fields).length) {
      return res.status(400).json({ message: "No data provided" });
    }

    const updates = Object.keys(fields)
      .map((key) => `${key} = ?`)
      .join(", ");

    const values = Object.values(fields);
    values.push(id);

    await pool.query(`UPDATE tours SET ${updates} WHERE id = ?`, values);

    res.json({ message: "Tour updated successfully ✅" });
  } catch (err) {
    console.error("Error updating tour:", err);
    res.status(500).json({ message: "Database error" });
  }
};

export const deleteTour = async (req, res) => {
  try {
    await pool.query("DELETE FROM tours WHERE id = ?", [req.params.id]);
    res.json({ message: "Tour deleted successfully ✅" });
  } catch (err) {
    console.error("Error deleting tour:", err);
    res.status(500).json({ message: "Database error" });
  }
};
