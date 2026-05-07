import React from "react";

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
      <div
        className={styles.iconWrapper}
      >
        <ShoppingBag size={80} color="#e43d12" />
      </div>

      {/* Title */}
      <h1
        className={styles.title}
      >
        Shop With Us
      </h1>

      {/* Subheading */}
      <p
        className={styles.subtitle}
      >
        This page is under development 🚧
      </p>

      {/* Coming soon animation */}
      <div
        className={styles.comingSoon}
      >
        <Clock className={styles.clockIcon} />
        <span>Coming Soon...</span>
      </div>

      {/* Footer note */}
      <p className={styles.footer}>
        © {new Date().getFullYear()} TrippyJiffy Travel. All Rights Reserved.
      </p>
    </div>
  );
};

export default ShopWithUs;
