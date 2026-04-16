import express from "express";
import { getCombinedData } from "../controller/combinedController.js";

const router = express.Router();

router.get("/combined-data", getCombinedData);

export default router;
