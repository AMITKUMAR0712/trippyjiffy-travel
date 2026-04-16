import express from "express";
import {
  getAllFaqs,
  getFaqById,
  createFaq,
  updateFaq,
  deleteFaq,
} from "../controller/countryToursFaqController.js";

const router = express.Router();

router.get("/get", getAllFaqs);

router.get("/get/:id", getFaqById);

router.post("/post", createFaq);

router.put("/put/:id", updateFaq);

router.delete("/delete/:id", deleteFaq);

export default router;
