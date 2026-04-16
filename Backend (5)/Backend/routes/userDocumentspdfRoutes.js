

// import express from "express";
// import upload from "../middlewares/upload.js";
// import {
//   sendPDFToUser,
//   getUserPDFsByUserId,
//   downloadPDF,
//   deletePDF,
// } from "../controller/userDocumentsControllerpdf.js";

// const router = express.Router();

// router.post("/upload/:userId", upload.single("pdf"), sendPDFToUser);
// router.get("/user/:userId", getUserPDFsByUserId);
// router.get("/download/:id", downloadPDF);
// router.delete("/delete/:id", deletePDF);

// export default router;
import express from "express";
import multer from "multer";
import {
  sendPDFToUser,
  getUserPDFsByUserId,
  downloadPDF,
  deletePDF
} from "../controller/userDocumentsControllerpdf.js";

const router = express.Router();
const upload = multer({ dest: "temp_uploads/" });

// ✅ Upload PDF
router.post("/upload/:userId", upload.single("pdf"), sendPDFToUser);

// ✅ Get all PDFs
router.get("/list/:userId", getUserPDFsByUserId);

// ✅ Download PDF
router.get("/download/:id", downloadPDF);

// ✅ Delete PDF
router.delete("/delete/:id", deletePDF);

// ✅ Test route
router.get("/test", (req, res) => {
  res.send("✅ userDocumentsRoutespdf working fine!");
});

export default router;
