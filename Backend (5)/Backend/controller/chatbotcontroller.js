import pool from "../config/db.js";

/**
 * FULLY DYNAMIC TRIPPYJIFFY CHATBOT CONTROLLER
 * Tables Used:
 * - CategoryIndia (India tour categories)
 * - state (India tour packages)
 * - asiastate (Asia / International tour packages)
 * - blog
 */

export const handleChatQuery = async (req, res) => {
  try {
    const { message } = req.body;

    // ✅ lowercase + trim (capital/small fix)
    const userMessage = message?.toLowerCase().trim() || "";

    const fallbackText =
      "Hello! 😊 Aap *India Tour*, *Asia Tour*, *Tour Packages*, *Blogs* ya *Contact Details* ke bare me puch sakte ho.";

    /* =====================================================
       📱 PHONE ONLY
    ===================================================== */
    if (
      ["phone", "number", "mobile", "pnumber"].includes(userMessage) ||
      userMessage.includes("phone") ||
      userMessage.includes("number") ||
      userMessage.includes("call")
    ) {
      return res.json({
        answer: "📱 **Phone Numbers:** 9870210896, 8527454549",
      });
    }

    /* =====================================================
       📧 EMAIL ONLY
    ===================================================== */
    if (
      ["email", "mail"].includes(userMessage) ||
      userMessage.includes("email")
    ) {
      return res.json({
        answer: "📧 **Email:** travelqueries@trippyjiffy.com",
      });
    }

    /* =====================================================
       🏢 ADDRESS ONLY
    ===================================================== */
    if (
      ["address", "office", "location"].includes(userMessage) ||
      userMessage.includes("address")
    ) {
      return res.json({
        answer: `🏢 **Office Address:**  
Sector 1, Vikas Nagar  
Lucknow - 226022  
India 🇮🇳`,
      });
    }

    /* =====================================================
       ☎️ FULL CONTACT
    ===================================================== */
    if (userMessage.includes("contact")) {
      return res.json({
        answer: `📞 **Contact Us**

📧 Email: travelqueries@trippyjiffy.com  
📱 Phone: 9870210896, 8527454549  

🏢 Address:  
Sector 1, Vikas Nagar  
Lucknow - 226022  
India 🇮🇳`,
      });
    }

    /* =====================================================
       🇮🇳 INDIA TOUR CATEGORIES (TYPO SAFE)
    ===================================================== */
    const indiaTourKeywords = [
      "india tour",
      "indai tour",
      "india taur",
      "indai taur",
      "indya tour",
      "bharat tour",
    ];

    if (indiaTourKeywords.some(k => userMessage.includes(k))) {
      const [categories] = await pool.query(
        "SELECT id, region_name FROM categoryindia"
      );

      if (!categories.length) {
        return res.json({ answer: "❌ Abhi India tour available nahi hai." });
      }

      let response = "🇮🇳 **India Tour Categories**\n\n";
      categories.forEach((cat, i) => {
        response += `${i + 1}. ${cat.region_name}\n`;
      });

      response +=
        "\n👉 Example: *Rajasthan tour* ya *Golden Triangle tour*";

      return res.json({ answer: response });
    }

    /* =====================================================
       📦 INDIA TOUR PACKAGES (CATEGORY MATCH)
    ===================================================== */
    const [indiaCategories] = await pool.query(
      "SELECT id, region_name FROM categoryindia"
    );

    const matchedCategory = indiaCategories.find(cat =>
      userMessage.includes(cat.region_name.toLowerCase())
    );

    if (matchedCategory) {
      const [packages] = await pool.query(
        `
        SELECT state_name
        FROM state
        WHERE category_id = ? AND is_visible = 1
        `,
        [matchedCategory.id]
      );

      if (!packages.length) {
        return res.json({
          answer: "❌ Is category ke liye packages available nahi hain.",
        });
      }

      let response = `🧳 **${matchedCategory.region_name} Packages**\n\n`;
      packages.forEach((pkg, i) => {
        response += `${i + 1}. ${pkg.state_name}\n`;
      });

      response += "\n👉 Website par complete itinerary & pricing milegi.";

      return res.json({ answer: response });
    }

    /* =====================================================
       🌏 ASIA TOUR PACKAGES
    ===================================================== */
    if (userMessage.includes("asia tour")) {
      const [packages] = await pool.query(
        "SELECT state_name FROM asiastate"
      );

      if (!packages.length) {
        return res.json({ answer: "❌ Abhi Asia tour available nahi hai." });
      }

      let response = "🌏 **Asia / International Tour Packages**\n\n";
      packages.forEach((pkg, i) => {
        response += `${i + 1}. ${pkg.state_name}\n`;
      });

      response += "\n👉 Example: *Nepal tour* ya *Dubai tour*";

      return res.json({ answer: response });
    }

    /* =====================================================
       🌍 SINGLE ASIA PACKAGE
    ===================================================== */
    const [asiaPackages] = await pool.query(
      "SELECT state_name FROM asiastate"
    );

    const matchedAsia = asiaPackages.find(pkg =>
      userMessage.includes(pkg.state_name.toLowerCase().split(" ")[0])
    );

    if (matchedAsia) {
      return res.json({
        answer: `🧳 **Tour Package Found:**\n\n${matchedAsia.state_name}\n\n👉 Website par complete itinerary & pricing milegi.`,
      });
    }

    /* =====================================================
       📝 BLOGS
    ===================================================== */
    if (userMessage.includes("blog")) {
      const [blogs] = await pool.query(
        "SELECT title FROM blog ORDER BY id DESC LIMIT 3"
      );

      let response = "📝 **Latest Blogs**\n\n";
      blogs.forEach((b, i) => {
        response += `${i + 1}. ${b.title}\n`;
      });

      return res.json({ answer: response });
    }

    /* =====================================================
       🔁 FALLBACK
    ===================================================== */
    return res.json({ answer: fallbackText });

  } catch (error) {
    console.error("Chatbot Error:", error);
    return res.json({
      answer: "❌ Internal error. Please try again later.",
    });
  }
};
