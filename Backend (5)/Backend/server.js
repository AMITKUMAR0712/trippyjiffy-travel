import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Setup directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Database config
import "./config/db.js";

// ✅ Static file serving
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Generic Upload Route
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }
  const fileUrl = `/api/uploads/${req.file.filename}`;
  res.json({ success: true, url: fileUrl });
});


// ✅ Route imports
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/UserRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import forgetRoutes from "./routes/authforget.js";
import contactRoutes from "./routes/contactRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import categoryIndiaRoutes from "./routes/categoryIndiaRoutes.js";
import stateRoutes from "./routes/stateRoutes.js";
import toursRoutes from "./routes/toursRoutes.js";
import asiaRoutes from "./routes/asiaRoutes.js";
import countryRoutes from "./routes/countryToursRoutes.js";
import asiastateRoutes from "./routes/asiastateRoutes.js";
import stateFaqRoutes from "./routes/stateFaqRoutes.js";
import countryToursFaqRoutes from "./routes/countryToursFaqRoutes.js";
import combinedRoutes from "./routes/combinedRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import bussiancontentRoutes from "./routes/bussiancontentRoutes.js";
import userDocumentRoutes from "./routes/userDocumentsRoutes.js";
import userDocumentspdfRoutes from "./routes/userDocumentspdfRoutes.js";
import reviewsRoutes from "./routes/reviewsRoutes.js";
import chatbotRoutes from './routes/chatbotroutes.js';
import landingPageRoutes from "./routes/landingPageRoutes.js"; 
import settingsRoutes from "./routes/settingsRoutes.js";
import translateRoutes from "./routes/translateRoutes.js";
import upcomingTripsRoutes from "./routes/upcomingTripsRoutes.js";
import userFeaturesRoutes from "./routes/userFeaturesRoutes.js";

// ✅ Helper to support both with and without /api prefix
const mountRoute = (path, route) => {
  app.use([`/api${path}`, path], route);
};

// ✅ Use all routes
mountRoute('/chatbot', chatbotRoutes);
mountRoute("/landing-pages", landingPageRoutes);
mountRoute("/settings", settingsRoutes);
mountRoute("/translate", translateRoutes);
mountRoute("/upcoming-trips", upcomingTripsRoutes);
mountRoute("/user-features", userFeaturesRoutes);

mountRoute("/admin", adminRoutes);
mountRoute("/users", userRoutes);
mountRoute("/enquiry", enquiryRoutes);
mountRoute("", forgetRoutes);
mountRoute("/contact", contactRoutes);
mountRoute("/blogs", blogRoutes);
mountRoute("/feedback", feedbackRoutes);
mountRoute("/category-india", categoryIndiaRoutes);
mountRoute("/state", stateRoutes);
mountRoute("/tours", toursRoutes);
mountRoute("/asia", asiaRoutes);
mountRoute("/country", countryRoutes);
mountRoute("/asiastate", asiastateRoutes);
mountRoute("/faq", stateFaqRoutes);
mountRoute("/countrytoursfaq", countryToursFaqRoutes);
mountRoute("", combinedRoutes);
mountRoute("/payment", paymentRoutes);
mountRoute("/bussiancontent", bussiancontentRoutes);
mountRoute("/user-documents", userDocumentRoutes);
mountRoute("/user-document", userDocumentspdfRoutes);
mountRoute("/reviews", reviewsRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🖼️  Image path available at: http://localhost:${PORT}/uploads/<filename>`);
});
