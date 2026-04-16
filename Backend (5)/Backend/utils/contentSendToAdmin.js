import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendEmailToAdmin = async (subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      to: process.env.ADMIN_EMAIL,
      from: process.env.GMAIL_USER,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Admin email sent successfully!");
  } catch (error) {
    console.error("❌ Error sending email to admin:", error);
  }
};
