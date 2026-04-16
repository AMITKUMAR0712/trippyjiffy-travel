// // routes/feedbackRoutes.js
// import express from "express";
// import {
//   addFeedback,
//   getFeedbacks,
//   getFeedbackById,
//   updateFeedback,
//   deleteFeedback,
// } from "../controller/feedbackController.js";

// import upload from "../middlewares/upload.js"; // ✅ ESM import

// const router = express.Router();

// router.post("/add", upload.single("photo"), addFeedback);
// router.get("/get", getFeedbacks);
// router.get("/get/:id", getFeedbackById);
// router.put("/update/:id", upload.single("photo"), updateFeedback);
// router.delete("/delete/:id", deleteFeedback);

// export default router; // ✅ ESM export





import express from "express";
import multer from "multer";
import {
  addFeedback,
  getFeedbacks,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
} from "../controller/feedbackController.js";

const router = express.Router();

// Multer config for photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// CRUD routes
router.post("/add", upload.single("photo"), addFeedback);
router.get("/get", getFeedbacks);
router.get("/:id", getFeedbackById);
router.put("/:id", upload.single("photo"), updateFeedback);
router.delete("/:id", deleteFeedback);

export default router;
