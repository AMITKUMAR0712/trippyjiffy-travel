// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");

// const {
//   createState,
//   getStates,
//   getStateById,
//   updateState,
//   deleteState,
// } = require("../controller/asiastateController");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) =>
//     cb(null, Date.now() + path.extname(file.originalname)),
// });

// const upload = multer({ storage });

// router.post("/post", upload.single("state_image"), createState);
// router.put("/update/:id", upload.single("state_image"), updateState);
// router.get("/get", getStates);
// router.get("/get/:id", getStateById);
// router.delete("/delete/:id", deleteState);

// module.exports = router;


import express from "express";
import multer from "multer";
import path from "path";
import {
  createState,
  getStates,
  getStateById,
  updateState,
  deleteState,
} from "../controller/asiastateController.js";

const router = express.Router();

// ✅ Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// ✅ Routes
router.post("/post", upload.single("state_image"), createState);
router.put("/update/:id", upload.single("state_image"), updateState);
router.get("/get", getStates);
router.get("/get/:id", getStateById);
router.delete("/delete/:id", deleteState);

// ✅ Export default router
export default router;
