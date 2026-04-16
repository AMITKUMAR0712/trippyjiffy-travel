import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

async function testTranslate() {
  try {
    const text = "Hello world";
    const target = "es";
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
    console.log("Success:", response.data.data.translations[0].translatedText);
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
  }
}

testTranslate();
