import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const contactSend = async (subject, htmlContent, userEmail = null) => {
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
    if (userEmail) {
      mailOptions.to = `${process.env.ADMIN_EMAIL}, ${userEmail}`;
    }

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

export default contactSend;
