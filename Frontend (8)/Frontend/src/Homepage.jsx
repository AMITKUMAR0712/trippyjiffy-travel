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
        title="Family Tours | India Tour Sites, Travelling Packages in India & Vacation Packages"
        description="Book affordable family tours and vacation packages with TrippyJiffy. Explore top India tour sites and the best travelling packages in India for an unforgettable trip."
        keywords="family tours, india tour sites, travelling packages in india, vacation packages, TrippyJiffy"
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

      <Suspense fallback={<div style={{ height: '50vh' }}></div>}>
        <Destinations />
        <Testimonials />
        <Blog />
        <Choose />
      </Suspense>
    </div>
  );
};

export default Homepage;
