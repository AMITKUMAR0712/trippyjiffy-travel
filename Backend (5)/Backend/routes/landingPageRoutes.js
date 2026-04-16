import express from "express";
import {
  getAllLandingPages,
  getLandingPageBySlug,
  upsertLandingPage,
  deleteLandingPage,
} from "../controller/landingPageController.js";

const router = express.Router();

// Get all landing pages (admin)
router.get("/all", getAllLandingPages);

// Get landing page by slug (public)
router.get("/:slug", getLandingPageBySlug);

// Create/Update landing page (admin)
router.post("/", upsertLandingPage);

// Delete landing page (admin)
router.delete("/:slug", deleteLandingPage);

export default router;
