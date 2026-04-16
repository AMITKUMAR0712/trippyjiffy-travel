import express from "express";
const router = express.Router();
import { getSettings, updateSettings } from "../controller/settingsController.js";

router.get("/get", getSettings);
router.post("/update", updateSettings);

export default router;
