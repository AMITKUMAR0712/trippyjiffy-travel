import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Clock } from "lucide-react";
import styles from "../Style/ShopWithUs.module.scss";
// ----------------- HELMET -----------------
import { Helmet } from "react-helmet-async";

const ShopWithUs = () => {
  // Dynamic meta info
  const metaTitle = "Shop With Us — TrippyJiffy Travel";
  const metaDescription =
    "Explore our exclusive products and offers. Shop with TrippyJiffy Travel. Page is under development.";

  return (
    <div className={styles.shopWithUs}>
      {/* ---------- DYNAMIC HELMET ---------- */}
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      {/* Background glow effect */}
      <div className={styles.glow}></div>

      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: 360 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={styles.iconWrapper}
      >
        <ShoppingBag size={80} color="#e43d12" />
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className={styles.title}
      >
        Shop With Us
      </motion.h1>

      {/* Subheading */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className={styles.subtitle}
      >
        This page is under development 🚧
      </motion.p>

      {/* Coming soon animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className={styles.comingSoon}
      >
        <Clock className={styles.clockIcon} />
        <span>Coming Soon...</span>
      </motion.div>

      {/* Footer note */}
      <p className={styles.footer}>
        © {new Date().getFullYear()} TrippyJiffy Travel. All Rights Reserved.
      </p>
    </div>
  );
};

export default ShopWithUs;
