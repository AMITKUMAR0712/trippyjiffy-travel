import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const router = express.Router();
router.use(express.json());

router.post("/", async (req, res) => {
  try {
    const { text, target } = req.body;
    if (!text || !target) return res.status(400).json({ message: "Text & target required" });

    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2`,
      {},
      {
        params: {
          q: text,
          target,
          key: process.env.GOOGLE_TRANSLATE_API_KEY,
        },
      }
    );

    res.json({ translation: response.data.data.translations[0].translatedText });
  } catch (err) {
    console.error("Translation error:", err.response?.data || err.message);
    res.status(500).json({ message: "Translation failed", error: err.response?.data || err.message });
  }
});

export default router;
