// routes/reviewsRoutes.js
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { GOOGLE_API_KEY, GOOGLE_PLACE_ID } = process.env;

    if (!GOOGLE_API_KEY || !GOOGLE_PLACE_ID) {
      return res.status(500).json({ message: "Missing API key or Place ID" });
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&fields=name,rating,reviews,user_ratings_total&key=${GOOGLE_API_KEY}`;
    const response = await axios.get(url);

    if (!response.data.result || !response.data.result.reviews) {
      return res.json([]);
    }

    // Format the reviews
    const formattedReviews = response.data.result.reviews.map((r) => ({
      name: r.author_name,
      photo: r.profile_photo_url,
      review: r.text,
      rating: r.rating,
      origin: r.relative_time_description,
      source: "google",
    }));

    res.json(formattedReviews);
  } catch (error) {
    console.error("Error fetching Google reviews:", error.message);
    res.status(500).json({ message: "Failed to fetch Google reviews" });
  }
});

export default router;
