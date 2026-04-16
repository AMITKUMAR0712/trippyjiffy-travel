// import express from "express";
// import {
//   addState,
//   getStates,
//   updateState,
//   deleteState,
// } from "../controller/stateController.js";
// import upload from "../middlewares/upload.js";

// const router = express.Router();

// router.post("/post", upload.single("image"), addState);

// router.get("/get", getStates);

// router.put("/put/:id", upload.single("image"), updateState);

// router.delete("/delete/:id", deleteState);

// export default router;



import express from "express";
import {
  addState,
  getStates,
  updateState,
  updateStateVisibility,
  deleteState,
} from "../controller/stateController.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post("/post", upload.single("image"), addState);
router.get("/get", getStates);
router.put("/put/:id", upload.single("image"), updateState);
router.put("/put-visibility/:id", updateStateVisibility); // new endpoint
router.delete("/delete/:id", deleteState);

export default router;
