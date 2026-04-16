import express from "express";
import {
  adminLogin,
  adminLogout,
  createAdmin,
  getAdmins,
  updateAdmin,
  deleteAdmin,
} from "../controller/adminController.js";

const router = express.Router();

router.post("/login", adminLogin);

router.post("/logout", adminLogout);

router.post("/create", createAdmin);

router.get("/get", getAdmins);

router.put("/update/:id", updateAdmin);

router.delete("/delete/:id", deleteAdmin);

export default router;
