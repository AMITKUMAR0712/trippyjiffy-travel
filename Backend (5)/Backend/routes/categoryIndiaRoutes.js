// import express from "express";
// import {
//   getRegions,
//   getRegionById,
//   addRegion,
//   updateRegion,
//   deleteRegion,
// } from "../controller/categoryIndiaController.js";

// const router = express.Router();

// // Routes
// router.get("/get", getRegions);
// router.get("/get/:id", getRegionById);
// router.post("/post", addRegion);
// router.put("/put/:id", updateRegion);
// router.delete("/delete/:id", deleteRegion);

// // ✅ ESM compatible export
// export default router;
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

// 🗂 Multer setup (upload folder = /uploads)
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ✅ Routes
router.get("/get", getRegions);
router.get("/get/:id", getRegionById);
router.post("/post", upload.single("image"), addRegion);
router.put("/put/:id", upload.single("image"), updateRegion);
router.delete("/delete/:id", deleteRegion);

export default router;
