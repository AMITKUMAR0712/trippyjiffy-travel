import express from "express";
import { resetPassword } from "../controller/forget.js";

const router = express.Router();

router.post("/api/reset-password", resetPassword);

export default router;
