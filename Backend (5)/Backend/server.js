// import dotenv from "dotenv";
// dotenv.config();

// import express from "express";
// import cors from "cors";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// import "./config/db.js";

// app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

// import adminRoutes from "./routes/adminRoutes.js";
// app.use("/api/admin", adminRoutes);

// import userRoutes from "./routes/UserRoutes.js";
// app.use("/api/users", userRoutes);

// import enquiryRoutes from "./routes/enquiryRoutes.js";
// app.use("/api/enquiry", enquiryRoutes);

// import forgetRoutes from "./routes/authforget.js";
// app.use("/api", forgetRoutes);

// import contactRoutes from "./routes/contactRoutes.js";
// app.use("/api/contact", contactRoutes);

// import blogRoutes from "./routes/blogRoutes.js";
// app.use("/api/blogs", blogRoutes);

// import feedbackRoutes from "./routes/feedbackRoutes.js";
// app.use("/api/feedback", feedbackRoutes);

// import categoryIndiaRoutes from "./routes/categoryIndiaRoutes.js";
// app.use("/api/category-india", categoryIndiaRoutes);

// import stateRoutes from "./routes/stateRoutes.js";
// app.use("/api/state", stateRoutes);

// import toursRoutes from "./routes/toursRoutes.js";
// app.use("/api/tours", toursRoutes);

// import asiaRoutes from "./routes/asiaRoutes.js";
// app.use("/api/asia", asiaRoutes);

// import countryRoutes from "./routes/countryToursRoutes.js";
// app.use("/api/country", countryRoutes);

// import asiastateRoutes from "./routes/asiastateRoutes.js";
// app.use("/api/asiaState", asiastateRoutes);

// import stateFaqRoutes from "./routes/stateFaqRoutes.js";
// app.use("/api/faq", stateFaqRoutes);

// import countryToursFaqRoutes from "./routes/countryToursFaqRoutes.js";
// app.use("/api/countrytoursfaq", countryToursFaqRoutes);

// import combinedRoutes from "./routes/combinedRoutes.js";
// app.use("/api", combinedRoutes);

// import paymentRoutes from "./routes/paymentRoutes.js";
// app.use("/api/payment", paymentRoutes);

// import bussiancontentRoutes from "./routes/bussiancontentRoutes.js";
// app.use("/api/BussianContent", bussiancontentRoutes);

// import userDocumentRoutes from "./routes/userDocumentsRoutes.js";
// app.use("/api/user-documents", userDocumentRoutes);

// import userDocumentspdfRoutes from "./routes/userDocumentspdfRoutes.js";
// app.use("/api/user-documents", userDocumentspdfRoutes);


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`ðŸš€ Server running on port ${PORT}`);
// });





// import dotenv from "dotenv";
// dotenv.config();

// import express from "express";
// import cors from "cors";
// import path from "path";
// import { fileURLToPath } from "url";
// import fetch from "node-fetch"; // ✅ for calling Google API

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // ✅ Database config
// import "./config/db.js";

// // ✅ Static file serving
// app.use("/api/uploads", express.static(path.join(__dirname, "uploads"))); 



// // ✅ All your existing route imports
// import adminRoutes from "./routes/adminRoutes.js";
// import userRoutes from "./routes/UserRoutes.js";
// import enquiryRoutes from "./routes/enquiryRoutes.js";
// import forgetRoutes from "./routes/authforget.js";
// import contactRoutes from "./routes/contactRoutes.js";
// import blogRoutes from "./routes/blogRoutes.js";
// import feedbackRoutes from "./routes/feedbackRoutes.js";
// import categoryIndiaRoutes from "./routes/categoryIndiaRoutes.js";
// import stateRoutes from "./routes/stateRoutes.js";
// import toursRoutes from "./routes/toursRoutes.js";
// import asiaRoutes from "./routes/asiaRoutes.js";
// import countryRoutes from "./routes/countryToursRoutes.js";
// import asiastateRoutes from "./routes/asiastateRoutes.js";
// import stateFaqRoutes from "./routes/stateFaqRoutes.js";
// import countryToursFaqRoutes from "./routes/countryToursFaqRoutes.js";
// import combinedRoutes from "./routes/combinedRoutes.js";
// import paymentRoutes from "./routes/paymentRoutes.js";
// import bussiancontentRoutes from "./routes/bussiancontentRoutes.js";
// import userDocumentRoutes from "./routes/userDocumentsRoutes.js";
// import userDocumentspdfRoutes from "./routes/userDocumentspdfRoutes.js";
// import reviewsRoutes from "./routes/reviewsRoutes.js";



// // ✅ Use all your old routes
// app.use("/api/admin", adminRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/enquiry", enquiryRoutes);
// app.use("/api", forgetRoutes);
// app.use("/api/contact", contactRoutes);
// app.use("/api/blogs", blogRoutes);
// app.use("/api/feedback", feedbackRoutes);
// app.use("/api/category-india", categoryIndiaRoutes);
// app.use("/api/state", stateRoutes);
// app.use("/api/tours", toursRoutes);
// app.use("/api/asia", asiaRoutes);
// app.use("/api/country", countryRoutes);
// app.use("/api/asiaState", asiastateRoutes);
// app.use("/api/faq", stateFaqRoutes);
// app.use("/api/countrytoursfaq", countryToursFaqRoutes);
// app.use("/api", combinedRoutes);
// app.use("/api/payment", paymentRoutes);
// app.use("/api/BussianContent", bussiancontentRoutes);
// app.use("/api/user-documents", userDocumentRoutes);
// app.use("/api/user-document", userDocumentspdfRoutes);
// app.use("/api/reviews", reviewsRoutes);






// // ✅ Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });


























import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Database config
import "./config/db.js";

// ✅ Serve uploaded images (for frontend access)
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

