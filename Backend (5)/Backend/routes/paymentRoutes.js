import express from "express";
import Razorpay from "razorpay";
import multer from "multer";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import pool from "../config/db.js";

dotenv.config();
const router = express.Router();

// =================== File Upload Setup ===================
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});
const upload = multer({ storage });

// =================== Razorpay Instance ===================
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =================== Create Order ===================
router.post("/create-order", async (req, res) => {
  try {
    let { amount, currency = "INR", receipt = "receipt_order_1" } = req.body;

    if (!amount) return res.status(400).json({ message: "Amount is required" });

    amount = parseFloat(amount);
    if (isNaN(amount) || amount < 1) amount = 1;

    // ✅ Validate supported currencies
    const supportedCurrencies = ["INR", "USD"];
    if (!supportedCurrencies.includes(currency.toUpperCase()))
      return res.status(400).json({
        message: `Invalid currency. Supported: ${supportedCurrencies.join(", ")}`,
      });

    const options = {
      amount: Math.ceil(amount * 100), // smallest unit (paise / cents)
      currency: currency.toUpperCase(),
      receipt,
    };

    // ✅ Create Razorpay order
    const order = await razorpay.orders.create(options);

    // ✅ Save order in DB
    await pool.query(
      "INSERT INTO orders (order_id, amount, currency, status) VALUES (?, ?, ?, ?)",
      [order.id, amount, order.currency, "created"]
    );

    res.json(order);
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Error creating order", error: error.toString() });
  }
});

// =================== Payment Success ===================
router.post("/payment-success", async (req, res) => {
  try {
    const { order_id, payment_id, status } = req.body;
    if (!order_id || !payment_id || !status)
      return res.status(400).json({ message: "Missing required fields" });

    await pool.query(
      "UPDATE orders SET payment_id=?, status=? WHERE order_id=?",
      [payment_id, status, order_id]
    );

    res.json({ success: true, message: "Payment updated successfully" });
  } catch (error) {
    console.error("Payment update error:", error);
    res.status(500).json({ success: false, message: "Error updating payment" });
  }
});

// =================== Manual Payment Details ===================
router.post("/payment-details", upload.single("screenshot"), async (req, res) => {
  try {
    const { name, email, phone, transactionId, currency } = req.body;
    if (!name || !email || !phone || !transactionId)
      return res.status(400).json({ success: false, message: "All fields are required" });

    const screenshot = req.file ? `/uploads/${req.file.filename}` : null;
    const time = new Date();

    await pool.query(
      "INSERT INTO payments (name, email, phone, transactionId, screenshot, currency, time) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, email, phone, transactionId, screenshot, currency, time]
    );

    res.json({ success: true, message: "Payment details saved" });
  } catch (error) {
    console.error("Payment details error:", error);
    res.status(500).json({ success: false, message: "Error saving payment details" });
  }
});

// =================== Admin: Fetch All Payments ===================
router.get("/admin/payments", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM payments ORDER BY time DESC");
    res.json(rows);
  } catch (error) {
    console.error("Admin fetch error:", error);
    res.status(500).json({ success: false, message: "Error fetching payments" });
  }
});

export default router;
