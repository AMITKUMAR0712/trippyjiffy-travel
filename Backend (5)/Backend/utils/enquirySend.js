import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const enquirySend = async (subject, htmlContent, recipient) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      to: recipient,
      from: process.env.GMAIL_USER,
      subject: subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${recipient}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

export default enquirySend;
