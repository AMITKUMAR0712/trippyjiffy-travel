import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

/**
 * Send an email using the pre-configured transporter.
 * @param {string} to - Recipient email address(es)
 * @param {string} subject - Email subject
 * @param {string} html - Email body in HTML format
 */
export const sendMail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"TrippyJiffy Travel" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("❌ Mail Service Error:", error);
    // Don't throw error to avoid crashing the main request
    return null;
  }
};

export default sendMail;
