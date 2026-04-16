import express from "express";
import { forgotPassword, resetPassword } from "../controller/forget.js";

const router = express.Router();
router.post("/users/forget-password", forgotPassword);
router.post("/users/reset-password", resetPassword);

export default router;
