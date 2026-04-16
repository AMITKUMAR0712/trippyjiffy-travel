// import express from "express";
// import multer from "multer";
// import path from "path";
// import {
//   getAllCountries,
//   getCountryById,
//   addCountry,
//   updateCountry,
//   deleteCountry,
// } from "../controller/asiaController.js";

// const router = express.Router();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) =>
//     cb(null, Date.now() + path.extname(file.originalname)),
// });
// const upload = multer({ storage });

// router.get("/get", getAllCountries);
// router.get("/get/:id", getCountryById);
// router.post("/post", upload.array("images", 5), addCountry);
// router.put("/put/:id", upload.array("images", 5), updateCountry);
// router.delete("/delete/:id", deleteCountry);

// export default router;


import express from "express";
import multer from "multer";
import path from "path";
import {
  getAllCountries,
  getCountryById,
  addCountry,
  updateCountry,
  deleteCountry,
  toggleVisibility, // ✅ import toggleVisibility
} from "../controller/asiaController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.get("/get", getAllCountries);
router.get("/get/:id", getCountryById);
router.post("/post", upload.array("images", 5), addCountry);
router.put("/put/:id", upload.array("images", 5), updateCountry);
router.delete("/delete/:id", deleteCountry);

// ✅ Toggle visibility route
router.put("/toggle/:id", toggleVisibility);

export default router;
