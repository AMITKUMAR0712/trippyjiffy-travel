import express from "express";
import {
  getCountry,
  postCountry,
  putCountry,
  deleteCountry,
} from "../controller/countryToursController.js";

const router = express.Router();

router.get("/get", getCountry);
router.post("/post", postCountry);
router.put("/put/:id", putCountry);
router.delete("/delete/:id", deleteCountry);

export default router;
