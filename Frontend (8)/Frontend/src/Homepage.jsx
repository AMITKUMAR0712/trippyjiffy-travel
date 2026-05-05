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
        title="Best Tour Packages, Holiday Packages & Travel Deals"
        description="Book the best tour packages and holiday packages with TrippyJiffy. Explore curated India tours and Asia travel deals at unbeatable prices. Plan your dream vacation today!"
        keywords="tour packages, holiday packages, travel packages, India travel, adventure tours, TrippyJiffy"
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
