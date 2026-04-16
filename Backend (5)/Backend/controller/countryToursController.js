
import pool from "../config/db.js";
const parseJSON = (val) => {
  try {
    return typeof val === "string" ? JSON.parse(val) : val;
  } catch {
    return { blocks: [] };
  }
};

export const getCountry = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Countrytours ORDER BY id DESC");

    const cleaned = rows.map((r) => ({
      ...r,
      description: parseJSON(r.description),
      routing: parseJSON(r.routing),
      inclusions: parseJSON(r.inclusions),
      supplemental_activities: parseJSON(r.supplemental_activities),
      exclusions: parseJSON(r.exclusions),
      sightseeing_points: parseJSON(r.sightseeing_points),
      activities: parseJSON(r.activities),
      monument_info: parseJSON(r.monument_info),
      market_info: parseJSON(r.market_info),
    }));

    res.json({ success: true, data: cleaned });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Database error", error: err.message });
  }
};

export const postCountry = async (req, res) => {
  try {
    const {
      asiastate_id,
      title,
      description,
      routing,
      inclusions,
      supplemental_activities,
      exclusions,
      sightseeing_points,
      activities,
      monument_info,
      market_info,
    } = req.body;

    if (!asiastate_id) {
      return res.status(400).json({ success: false, message: "asiastate_id required" });
    }

    await pool.query(
      `INSERT INTO Countrytours 
      (asiastate_id, title, description, routing, inclusions, supplemental_activities, exclusions, sightseeing_points, activities, monument_info, market_info)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        asiastate_id,
        title,
        description,
        routing,
        inclusions,
        supplemental_activities,
        exclusions,
        sightseeing_points,
        activities,
        monument_info,
        market_info,
      ]
    );

    res.json({ success: true, message: "Added successfully" });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Database error",
      error: err.message,
    });
  }
};

export const putCountry = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      asiastate_id,
      title,
      description,
      routing,
      inclusions,
      supplemental_activities,
      exclusions,
      sightseeing_points,
      activities,
      monument_info,
      market_info,
    } = req.body;

    await pool.query(
      `UPDATE Countrytours SET
       asiastate_id = ?, title = ?, description = ?, routing = ?, inclusions = ?, 
       supplemental_activities = ?, exclusions = ?, sightseeing_points = ?, 
       activities = ?, monument_info = ?, market_info = ? 
       WHERE id = ?`,
      [
        asiastate_id,
        title,
        description,
        routing,
        inclusions,
        supplemental_activities,
        exclusions,
        sightseeing_points,
        activities,
        monument_info,
        market_info,
        id,
      ]
    );

    res.json({ success: true, message: "Updated successfully" });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Database error",
      error: err.message,
    });
  }
};

export const deleteCountry = async (req, res) => {
  try {
    const id = req.params.id;

    await pool.query("DELETE FROM Countrytours WHERE id = ?", [id]);

    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Database error",
      error: err.message,
    });
  }
};
