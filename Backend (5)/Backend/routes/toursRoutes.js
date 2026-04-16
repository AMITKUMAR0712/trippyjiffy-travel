import express from "express";
import multer from "multer";
import {
  getAllTours,
  getTourById,
  addTour,
  updateTour,
  deleteTour,
} from "../controller/toursController.js";

const router = express.Router();
const upload = multer();

router.get("/get", getAllTours);

router.get("/get/:id", getTourById);

router.post("/post", upload.none(), addTour);

router.put("/update/:id", upload.none(), updateTour);

router.delete("/delete/:id", deleteTour);

export default router;
