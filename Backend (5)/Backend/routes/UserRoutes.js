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
  deleteUserPDF,
  upload,
} from "../controller/UserController.js";

const router = express.Router();

/**
 * @route   POST /api/users/register
 * @desc    Register a new user with an optional PDF document
 */
router.post("/register", upload.single("pdf"), registerUser);

/**
 * @route   POST /api/users/login
 * @desc    Login and receive a JWT
 */
router.post("/login", login);

/**
 * @route   GET /api/users/me
 * @desc    Get current logged-in user profile
 */
router.get("/me", protect, getMe);

/**
 * @route   GET /api/users/get/users
 * @desc    Get all registered users (Admin View)
 */
router.get("/get/users", getUsers);

/**
 * @route   GET /api/users/get/users/:id
 * @desc    Get a specific user by ID
 */
router.get("/get/users/:id", getUserById);

/**
 * @route   PUT /api/users/update/users/:id
 * @desc    Update user details or upload new PDF
 */
router.put("/update/users/:id", upload.single("pdf"), updateUser);

/**
 * @route   DELETE /api/users/delete/users/:id
 * @desc    Delete a user account
 */
router.delete("/delete/users/:id", deleteUser);

/**
 * @route   PUT /api/users/send-admin-message/:id
 * @desc    Send a message or document from Admin to a specific User
 */
router.put(
  "/send-admin-message/:id",
  upload.single("admin_pdf"),
  sendAdminMessage
);

/**
 * @route   GET /api/users/announcements/:id
 * @desc    Get messages/announcements for a specific user
 */
router.get("/announcements/:id", getUserAnnouncements);

/**
 * @route   GET /api/users/download-pdf/:id
 * @desc    Download the user's uploaded PDF
 */
router.get("/download-pdf/:id", getUserPDF);

/**
 * @route   DELETE /api/users/delete-pdf/:id
 * @desc    Delete only the user's PDF, keeping the user account
 */
router.delete("/delete-pdf/:id", protect, deleteUserPDF);

export default router;
