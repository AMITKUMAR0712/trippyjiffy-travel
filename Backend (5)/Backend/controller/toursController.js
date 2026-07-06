import pool from "../config/db.js";

const stringifyIfObject = (val) => {
  if (val && typeof val === "object") {
    return JSON.stringify(val);
  }
  return val;
};


export const getAllTours = async (req, res) => {
  try {
    const { id, state_id, exclude_id, limit } = req.query;
    const conditions = [];
    const values = [];

    if (id) {
      conditions.push("id = ?");
      values.push(id);
    }

    if (state_id) {
      const stateIds = String(state_id)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      if (stateIds.length === 1) {
        conditions.push("state_id = ?");
        values.push(stateIds[0]);
      } else if (stateIds.length > 1) {
        conditions.push(`state_id IN (${stateIds.map(() => "?").join(", ")})`);
        values.push(...stateIds);
      }
    }

    if (exclude_id) {
      conditions.push("id != ?");
      values.push(exclude_id);
    }

    let query = "SELECT * FROM tours";
    if (conditions.length) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }
    query += " ORDER BY id DESC";

    if (limit && Number(limit) > 0) {
      query += " LIMIT ?";
      values.push(Number(limit));
    }

    const [rows] = await pool.query(query, values);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching tours:", err);
    res.status(500).json({ message: "Database error", error: err.message });
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
    res.status(500).json({ message: "Database error", error: err.message });
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
        stringifyIfObject(description),
        stringifyIfObject(routing),
        stringifyIfObject(sightseeing_points),
        stringifyIfObject(inclusions),
        stringifyIfObject(activities),
        stringifyIfObject(monument_info),
        stringifyIfObject(market_info),
        stringifyIfObject(supplemental_activities),
        stringifyIfObject(exclusions),
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
    res.status(500).json({ message: "Database error", error: err.message });
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

    const values = Object.values(fields).map(v => stringifyIfObject(v));
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
