import express from "express";
import {
  addBusinessContact,
  getAllBusinessContacts,
  getBusinessContactById,
  updateBusinessContact,
  deleteBusinessContact,
} from "../controller/BussianContent.js";

const router = express.Router();

router.post("/post/business", addBusinessContact);
router.get("/get/business", getAllBusinessContacts);
router.get("/business/:id", getBusinessContactById);
router.put("/put/business/:id", updateBusinessContact);
router.delete("/delete/business/:id", deleteBusinessContact);

export default router;
