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

// ✅ Use all routes
app.use('/api/chatbot', chatbotRoutes);
app.use("/api/landing-pages", landingPageRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/translate", translateRoutes);
app.use("/api/upcoming-trips", upcomingTripsRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/enquiry", enquiryRoutes);
app.use("/api", forgetRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/category-india", categoryIndiaRoutes);
app.use("/api/state", stateRoutes);
app.use("/api/tours", toursRoutes);
app.use("/api/asia", asiaRoutes);
app.use("/api/country", countryRoutes);
app.use("/api/asiaState", asiastateRoutes);
app.use("/api/faq", stateFaqRoutes);
app.use("/api/countrytoursfaq", countryToursFaqRoutes);
app.use("/api", combinedRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/BussianContent", bussiancontentRoutes);
app.use("/api/user-documents", userDocumentRoutes);
app.use("/api/user-document", userDocumentspdfRoutes);
app.use("/api/reviews", reviewsRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🖼️  Image path available at: http://localhost:${PORT}/uploads/<filename>`);
});
