


import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import {
  upload,
  uploadPDF,
  getUserPDFs,
  downloadPDF,
  deletePDF,
  getAllPDFs,
} from "../controller/userDocumentsController.js";

const router = express.Router();

router.get("/all", getAllPDFs);
router.post("/upload", verifyToken, upload.single("pdf"), uploadPDF);
router.get("/user", verifyToken, getUserPDFs);
router.get("/download/:id", downloadPDF);
router.delete("/delete/:id", verifyToken, deletePDF);

export default router;


// import express from "express";
// import { verifyToken } from "../middlewares/verifyToken.js";
// import {
//   upload,
//   uploadPDF,
//   getUserPDFs,
//   downloadPDF,
//   deletePDF,
//   getAllPDFs,
// } from "../controller/userDocumentsController.js";

// const router = express.Router();

// router.get("/all", getAllPDFs);
// router.post("/upload", verifyToken, upload.single("pdf"), uploadPDF);
// router.get("/user", verifyToken, getUserPDFs);
// router.get("/download/:id", verifyToken, downloadPDF);
// router.delete("/delete/:id", verifyToken, deletePDF);

// export default router;
