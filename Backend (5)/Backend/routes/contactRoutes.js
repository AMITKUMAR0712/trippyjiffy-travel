import express from "express";
import {
  addContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
} from "../controller/contactController.js";

const router = express.Router();

router.post("/post", addContact);

router.get("/get", getContacts);

router.get("/get/:id", getContactById);

router.put("/put/:id", updateContact);

router.delete("/delete/:id", deleteContact);

export default router;
