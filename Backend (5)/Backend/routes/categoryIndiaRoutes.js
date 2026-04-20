import express from "express";
import multer from "multer";
import {
  getRegions,
  getRegionById,
  addRegion,
  updateRegion,
  deleteRegion,
} from "../controller/categoryIndiaController.js";

const router = express.Router();

/**
 * @description Multer configuration for category images
 */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ✅ Fetch all regions
router.get("/get", getRegions);

// ✅ Fetch single region by ID
router.get("/get/:id", getRegionById);

// ✅ Create local tour category with image
router.post("/post", upload.single("image"), addRegion);

// ✅ Update category details or image
router.put("/put/:id", upload.single("image"), updateRegion);

// ✅ Delete category
router.delete("/delete/:id", deleteRegion);

export default router;
