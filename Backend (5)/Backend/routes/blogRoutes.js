import express from "express";
import multer from "multer";
import path from "path";
import {
  addBlog,
  updateBlog,
  getBlogs,
  getBlogById,
  deleteBlog,
  deleteBlogBlock,
} from "../controller/blogController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.post("/post", upload.single("image"), addBlog);
router.put("/put/:id", upload.single("image"), updateBlog);
router.get("/get", getBlogs);
router.get("/get/:id", getBlogById);
router.delete("/delete/:id", deleteBlog);
router.delete("/blogs/:blogId/blocks/:blockIndex", deleteBlogBlock);

export default router;
