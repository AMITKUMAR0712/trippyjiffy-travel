import express from "express";
import {
  addEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
  sendAdminMessage,
} from "../controller/enquiryController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/post-auth", verifyToken, addEnquiry);
router.post("/post", addEnquiry);
router.get("/get", getEnquiries);
router.get("/get/:id", getEnquiryById);
router.put("/update/:id", updateEnquiry);
router.delete("/delete/:id", deleteEnquiry);
router.put("/send-admin-message/:id", sendAdminMessage);

export default router;
