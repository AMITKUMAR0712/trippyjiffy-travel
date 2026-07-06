import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const router = express.Router();
router.use(express.json());

let translationWarningLogged = false;

function logTranslationWarningOnce(message, detail) {
  if (translationWarningLogged) return;
  translationWarningLogged = true;
  console.warn(message, detail || "");
}

router.post("/", async (req, res) => {
  const { text, target } = req.body;
  if (!text || !target) {
    return res.status(400).json({ message: "Text & target required" });
  }

  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY?.trim();
  if (!apiKey || target === "en") {
    return res.json({ translation: text });
  }

  try {
    const response = await axios.post(
      "https://translation.googleapis.com/language/translate/v2",
      {},
      {
        params: {
          q: text,
          target,
          key: apiKey,
        },
        timeout: 10000,
      }
    );

    res.json({
      translation: response.data.data.translations[0].translatedText,
    });
  } catch (err) {
    const apiError = err.response?.data?.error;
    logTranslationWarningOnce(
      "Translation API unavailable — returning original text.",
      apiError?.message || err.message
    );

    res.json({
      translation: text,
      warning: "Translation unavailable",
    });
  }
});

export default router;
