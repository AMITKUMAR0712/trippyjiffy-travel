import express from "express";
import {
  registerUser,
  login,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getMe,
  sendAdminMessage,
  getUserAnnouncements,
  protect,
  getUserPDF,
  deleteUserPDF,   // ✅ added
  upload,
} from "../controller/UserController.js";

const router = express.Router();

// ====================================================
// Register with PDF upload
// ====================================================
router.post("/register", upload.single("pdf"), registerUser);

// ====================================================
// Authentication routes
// ====================================================
router.post("/login", login);
router.get("/me", protect, getMe);

// ====================================================
// CRUD routes
// ====================================================
router.get("/get/users", getUsers);
router.get("/get/users/:id", getUserById);
router.put("/update/users/:id", updateUser);
router.delete("/delete/users/:id", deleteUser);

// ====================================================
// Admin Message + PDF upload
// ====================================================
router.put(
  "/send-admin-message/:id",
  upload.single("admin_pdf"),  // frontend field name
  sendAdminMessage
);

// ====================================================
// Get Announcements
// ====================================================
router.get("/announcements/:id", getUserAnnouncements);

// ====================================================
// Download PDF
// ====================================================
router.get("/download-pdf/:id", getUserPDF);

// ====================================================
// Delete PDF
// ====================================================
router.delete("/delete-pdf/:id", protect, deleteUserPDF); // ✅ new

export default router;



// import express from "express";
// import {
//   registerUser,
//   login,
//   getUsers,
//   updateUser,
//   getUserPDF,
//   upload,
// } from "../controller/UserController.js";

// const router = express.Router();

// router.post("/register", upload.single("pdf"), registerUser);
// router.post("/login", login);
// router.get("/get/users", getUsers);
// router.put("/update/users/:id", upload.single("pdf"), updateUser);
// router.get("/download-pdf/:id", getUserPDF);

// export default router;
