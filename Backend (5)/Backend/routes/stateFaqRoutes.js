import express from "express";
import {
  addFaq,
  getAllFaqs,
  updateFaq,
  deleteFaq,
  getAllStates,
} from "../controller/stateFaqController.js";

const router = express.Router();

router.post("/post", addFaq);
router.get("/get", getAllFaqs);
router.put("/put/:id", updateFaq);
router.delete("/delete/:id", deleteFaq);

router.get("/state/get", getAllStates);

export default router;
