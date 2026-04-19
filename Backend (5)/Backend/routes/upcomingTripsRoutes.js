
import express from "express";
import {
  addUpcomingTrip,
  getAllUpcomingTrips,
  getUpcomingTripById,
  updateUpcomingTrip,
  deleteUpcomingTrip,
  toggleUpcomingTripVisibility,
} from "../controller/upcomingTripsController.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post("/post", upload.fields([{ name: 'images', maxCount: 10 }, { name: 'banner_image', maxCount: 1 }]), addUpcomingTrip);
router.get("/get", getAllUpcomingTrips);
router.get("/get/:id", getUpcomingTripById);
router.put("/put/:id", upload.fields([{ name: 'images', maxCount: 10 }, { name: 'banner_image', maxCount: 1 }]), updateUpcomingTrip);
router.put("/toggle/:id", toggleUpcomingTripVisibility);
router.delete("/delete/:id", deleteUpcomingTrip);

export default router;
