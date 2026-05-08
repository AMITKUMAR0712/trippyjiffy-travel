import express from "express";
const router = express.Router();
import { verifyToken } from "../middlewares/verifyToken.js";
import { 
  addToWishlist, 
  getWishlist, 
  removeFromWishlist,
  addToCompare,
  getCompare,
  removeFromCompare,
  getDashboardStats
} from "../controller/userFeaturesController.js";

// Dashboard Stats
router.get("/dashboard-stats", verifyToken, getDashboardStats);

// Wishlist Routes
router.post("/wishlist", verifyToken, addToWishlist);
router.get("/wishlist", verifyToken, getWishlist);
router.delete("/wishlist/:id", verifyToken, removeFromWishlist);

// Compare Routes
router.post("/compare", verifyToken, addToCompare);
router.get("/compare", verifyToken, getCompare);
router.delete("/compare/:id", verifyToken, removeFromCompare);

export default router;
