import React, { useState, useEffect, useRef } from "react";
import Style from "../Style/Payment.module.scss";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Lock, CreditCard, MapPin, Star, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

// Travel images for the right-side slider
const SLIDES = [
  {
    img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=900&q=90",
    label: "Santorini, Greece",
  },
  {
    img: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=900&q=90",
    label: "Kerala Backwaters, India",
  },
  {
    img: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=900&q=90",
    label: "Iceland Waterfalls",
  },
  {
    img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=90",
    label: "Alpine Mountains, Switzerland",
  },
  {
    img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=900&q=90",
    label: "Road to Adventures",
  },
  {
    img: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=90",
    label: "Misty Highlands",
  },
];

/* ── Right-side Image Slider ── */
const ImageSlider = () => {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1); // 1 = forward, -1 = backward
  const timerRef = useRef(null);

  const go = (newIdx, direction) => {
    setDir(direction);
    setActive((newIdx + SLIDES.length) % SLIDES.length);
  };

  const next = () => go(active + 1, 1);
  const prev = () => go(active - 1, -1);

  // Auto-advance every 4 seconds
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setDir(1);
      setActive((i) => (i + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, []);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDir(1);
      setActive((i) => (i + 1) % SLIDES.length);
    }, 4000);
  };

  const handleNext = () => { next(); resetTimer(); };
  const handlePrev = () => { prev(); resetTimer(); };

  const variants = {
    enter: (d) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <div className={Style.SliderPanel}>
      {/* Slides */}
      <AnimatePresence custom={dir} initial={false}>
        <motion.div
          key={active}
          className={Style.Slide}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
        >
          <img
            src={SLIDES[active].img}
            alt={SLIDES[active].label}
            className={Style.SlideImg}
          />
          <div className={Style.SlideOverlay} />

          {/* Top branding */}
          <div className={Style.TopBrand}>
            <span className={Style.BrandLogo}>✈ TrippyJiffy</span>
            <p className={Style.BrandTagline}>Your journey to extraordinary begins here</p>
            <div className={Style.BrandLine} />
          </div>

          {/* Location label */}
          <div className={Style.LocationLabel}>
            <MapPin size={14} />
            <span>{SLIDES[active].label}</span>
          </div>

          {/* Quote */}
          <div className={Style.QuoteBox}>
            <p className={Style.QuoteMark}>"</p>
            <p className={Style.QuoteText}>
              Travel is the only thing you buy that makes you richer
            </p>
            <p className={Style.QuoteAuthor}>— Anonymous Explorer</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Arrow controls */}
      <button className={`${Style.Arrow} ${Style.ArrowLeft}`} onClick={handlePrev} aria-label="Previous">
        <ChevronLeft size={20} />
      </button>
      <button className={`${Style.Arrow} ${Style.ArrowRight}`} onClick={handleNext} aria-label="Next">
        <ChevronRight size={20} />
      </button>

      {/* Dot indicators */}
      <div className={Style.Dots}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`${Style.Dot} ${i === active ? Style.DotActive : ""}`}
            onClick={() => { go(i, i > active ? 1 : -1); resetTimer(); }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

/* ── Main Payment Component ── */
const Payment = () => {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [userDetails, setUserDetails] = useState({ name: "", email: "", phone: "" });

  const handlePayment = async () => {
    if (!amount || isNaN(amount) || amount <= 0)
      return toast.error("Please enter a valid amount");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/payment/create-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: parseFloat(amount), currency }),
        }
      );

      const order = await res.json();
      if (!order.id) return toast.error("Order creation failed. Please try again.");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "TrippyJiffy.com",
        description: "Secure Booking Payment",
        order_id: order.id,
        handler: function (response) {
          setTransactionId(response.razorpay_payment_id);
          setShowDetailsForm(true);
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/payment/payment-success`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              order_id: order.id,
              payment_id: response.razorpay_payment_id,
              status: "paid",
            }),
          });
        },
        theme: { color: "#d9630c" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Something went wrong during payment.");
    }
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    if (!transactionId || !userDetails.name || !userDetails.email || !userDetails.phone)
      return toast.error("Please fill all required fields");

    const formData = new FormData();
    formData.append("name", userDetails.name);
    formData.append("email", userDetails.email);
    formData.append("phone", userDetails.phone);
    formData.append("transactionId", transactionId);
    formData.append("currency", currency);
    if (screenshot) formData.append("screenshot", screenshot);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/payment/payment-details`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Details submitted successfully! ✅");
        setShowDetailsForm(false);
        setAmount("");
        setTransactionId("");
        setScreenshot(null);
        setUserDetails({ name: "", email: "", phone: "" });
        setCurrency("INR");
      } else toast.error(data.message || "Submission failed");
    } catch (error) {
      console.error(error);
      toast.error("Error submitting details. Please try again.");
    }
  };

  return (
    <div className={Style.PaymentPage}>
      {/* ── LEFT: Image Slider ── */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <ImageSlider />
      </motion.div>

      {/* ── RIGHT: Payment Form ── */}
      <motion.div
        className={Style.FormPanel}
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className={Style.FormInner}>
          {/* Header */}
          <div className={Style.FormHeader}>
            <div className={Style.IconRing}>
              <ShieldCheck size={28} />
            </div>
            <div>
              <h1 className={Style.FormTitle}>Secure Booking</h1>
              <p className={Style.FormSubtitle}>Complete your reservation safely</p>
            </div>
          </div>

          <div className={Style.Divider} />

          {/* Step indicator */}
          <div className={Style.StepBar}>
            <div className={`${Style.Step} ${Style.StepActive}`}>
              <span>1</span> Amount
            </div>
            <div className={Style.StepLine} />
            <div className={`${Style.Step} ${showDetailsForm ? Style.StepActive : ""}`}>
              <span>2</span> Verify
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!showDetailsForm ? (
              <motion.div
                key="payment-form"
                className={Style.FormBody}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
              >
                <div className={Style.InputGroup}>
                  <label>Currency</label>
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                    <option value="INR">🇮🇳 Pay in ₹ INR</option>
                    <option value="USD">🇺🇸 Pay in $ USD</option>
                  </select>
                </div>

                <div className={Style.InputGroup}>
                  <label>Amount</label>
                  <div className={Style.AmountWrapper}>
                    <span className={Style.CurrencySymbol}>
                      {currency === "INR" ? "₹" : "$"}
                    </span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>

                <button onClick={handlePayment} className={Style.PayBtn}>
                  <Lock size={16} /> Pay Now Securely
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="details-form"
                className={Style.FormBody}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
                onSubmit={handleDetailsSubmit}
              >
                <div className={Style.TxnBadge}>
                  <span>Transaction ID:</span>
                  <code>{transactionId}</code>
                </div>

                <div className={Style.InputGroup}>
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={userDetails.name}
                    onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                  />
                </div>

                <div className={Style.InputGroup}>
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={userDetails.email}
                    onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                  />
                </div>

                <div className={Style.InputGroup}>
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={userDetails.phone}
                    onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
                  />
                </div>

                <div className={Style.InputGroup}>
                  <label>Upload Screenshot</label>
                  <label className={Style.FileZone}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setScreenshot(e.target.files[0])}
                    />
                    {screenshot ? (
                      <span className={Style.FileChosen}>✅ {screenshot.name}</span>
                    ) : (
                      <span>Click to upload transaction screenshot</span>
                    )}
                  </label>
                </div>

                <button type="submit" className={Style.PayBtn}>
                  <ShieldCheck size={16} /> Submit Verification
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Trust Badges */}
          <div className={Style.TrustRow}>
            <div className={Style.TrustBadge}><Lock size={14} /><span>256-bit SSL</span></div>
            <div className={Style.TrustBadge}><CreditCard size={14} /><span>Safe &amp; Secure</span></div>
            <div className={Style.TrustBadge}><ShieldCheck size={14} /><span>Razorpay</span></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Payment;
