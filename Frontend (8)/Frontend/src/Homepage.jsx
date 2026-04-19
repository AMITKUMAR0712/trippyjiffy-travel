import React, { lazy, Suspense } from "react";
import Banner from "./HomeCompontent/Banner";
import SEO from "./HomeCompontent/SEO";
import AutoLeadPopup from "./HomeCompontent/AutoLeadPopup";

const Destinations = lazy(() => import("./HomeCompontent/Destinations"));
const Testimonials = lazy(() => import("./Page/Testimonials"));
const Blog = lazy(() => import("./HomeCompontent/Blog"));
const Choose = lazy(() => import("./HomeCompontent/Choose"));

const Homepage = () => {
  return (
    <div>
      <SEO 
        title="Explore Amazing Tours & Destinations"
        description="Discover exciting tours, travel destinations, blogs, and testimonials with TrippyJiffy Travel. Start your adventure today!"
        keywords="TrippyJiffy homepage, India travel packages, adventure tours India, travel blog India"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "TrippyJiffy",
          "url": "https://trippyjiffy.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://trippyjiffy.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }}
      />

      <AutoLeadPopup delay={4500} context="Homepage" />

      <Banner />
      
      <Suspense fallback={<div style={{height: '50vh'}}></div>}>
        <Destinations />
        <Testimonials />
        <Blog />
        <Choose />
      </Suspense>
    </div>
  );
};

export default Homepage;
