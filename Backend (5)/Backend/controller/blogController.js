import pool from "../config/db.js";
import path from "path";
import fs from "fs";

const fixInlineImages = (blocks, req) => {
  if (!blocks || !Array.isArray(blocks)) return blocks;

  return blocks.map((block) => {
    if (block.type === "image" && block.data?.file?.url) {
      if (!block.data.file.url.startsWith("http")) {
        block.data.file.url = `${req.protocol}://${req.get("host")}/api/uploads/${
          block.data.file.url
        }`;
      }
    }
    return block;
  });
};

export const addBlog = async (req, res) => {
  try {
    const { title, date, paragraphs } = req.body;
    if (!title || !date || !paragraphs)
      return res.status(400).json({ message: "Required fields missing" });

    let image = null;
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    const [result] = await pool.query(
      "INSERT INTO blog (title, image, date, paragraphs) VALUES (?, ?, ?, ?)",
      [title, image, date, JSON.stringify(paragraphs)]
    );

    res.status(201).json({
      message: "Blog created successfully",
      blogId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getBlogs = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM blog ORDER BY id ASC");
    const blogs = rows.map((row) => ({
      ...row,
      paragraphs:
        typeof row.paragraphs === "string"
          ? JSON.parse(row.paragraphs)
          : row.paragraphs,
    }));
    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM blog WHERE id = ?", [id]);

    if (!rows.length)
      return res.status(404).json({ message: "Blog not found" });

    const blog = {
      ...rows[0],
      paragraphs:
        typeof rows[0].paragraphs === "string"
          ? JSON.parse(rows[0].paragraphs)
          : rows[0].paragraphs,
    };

    res.json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { title, date, paragraphs } = req.body;
    const { id } = req.params;

    const [rows] = await pool.query("SELECT * FROM blog WHERE id = ?", [id]);
    if (!rows.length)
      return res.status(404).json({ message: "Blog not found" });

    let image = rows[0].image;
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    await pool.query(
      "UPDATE blog SET title = ?, date = ?, paragraphs = ?, image = ? WHERE id = ?",
      [title, date, paragraphs, image, id]
    );

    res.json({ message: "Blog updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM blog WHERE id = ?", [id]);

    if (!result.affectedRows)
      return res.status(404).json({ message: "Blog not found" });

    await pool.query("ALTER TABLE blog AUTO_INCREMENT = 1");
    res.json({ message: "Blog deleted successfully and ID reset" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteBlogBlock = async (req, res) => {
  try {
    const { blogId, blockIndex } = req.params;
    const [rows] = await pool.query(
      "SELECT paragraphs FROM blog WHERE id = ?",
      [blogId]
    );

    if (!rows.length)
      return res.status(404).json({ message: "Blog not found" });

    let paragraphs = JSON.parse(rows[0].paragraphs || "{}");
    if (!paragraphs.blocks) paragraphs = { blocks: [] };

    const idx = parseInt(blockIndex, 10);
    if (idx >= 0 && idx < paragraphs.blocks.length) {
      paragraphs.blocks.splice(idx, 1);
    } else {
      return res.status(400).json({ message: "Invalid block index" });
    }

    await pool.query("UPDATE blog SET paragraphs = ? WHERE id = ?", [
      JSON.stringify(paragraphs),
      blogId,
    ]);

    res.json({ message: "✅ Block deleted", updatedParagraphs: paragraphs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
