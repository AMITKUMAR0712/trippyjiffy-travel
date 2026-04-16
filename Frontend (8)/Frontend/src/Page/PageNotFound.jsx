import React from "react";
import { Link } from "react-router-dom";

import Header from "../HomeCompontent/Header";
import Footer from "../HomeCompontent/Footer";
import WhatsappButton from "../HomeCompontent/WhatsappButton";
import ScrollToTop from "../HomeCompontent/ScrollToTop";
import HeaderTop from "../HomeCompontent/HeaderTop";

import { LanguageProvider } from "../HomeCompontent/LanguageContext";
import { HelmetProvider } from "react-helmet-async";

const PageNotFound = () => {

  return (
    <HelmetProvider>
      <LanguageProvider>
        <ScrollToTop />
        <HeaderTop />
        <Header />
        
        <div style={{
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
          height:"70vh",
          flexDirection:"column",
        }}>
          <h1 style={{fontSize:"72px", color:"var(--primary-color)"}}>404</h1>
          <p style={{fontSize:"18px"}}>Page not found!</p>
          <Link to="/" style={{
            padding:"10px 20px",
            background:"var(--primary-color)",
            color:"#fff",
            textDecoration:"none",
            borderRadius:"5px",
            marginTop: "16px",
            fontWeight: "bold"
          }}>Go to Home</Link>
        </div>

        <Footer />
        <WhatsappButton />
      </LanguageProvider>
    </HelmetProvider>
  );
};

export default PageNotFound;
