import React, { lazy, Suspense } from "react";
import Banner from "./HomeCompontent/Banner";
import SEO from "./HomeCompontent/SEO";
import AutoLeadPopup from "./HomeCompontent/AutoLeadPopup";

const Destinations = lazy(() => import("./HomeCompontent/Destinations"));
const Testimonials = lazy(() => import("./Page/Testimonials"));
const Blog = lazy(() => import("./HomeCompontent/Blog"));
const Choose = lazy(() => import("./HomeCompontent/Choose"));

const SectionFallback = ({ minHeight = 420 }) => (
  <div aria-hidden="true" style={{ minHeight }} />
);

const Homepage = () => {
  return (
    <div>
      <SEO
        title="Best Family Tour Packages in India & Overseas"
        description="Book customized family tours, India tour packages, overseas holidays, honeymoon trips, and group travel deals with TrippyJiffy. Get expert itinerary planning and affordable vacation packages."
        keywords="family tour packages, India tour packages, travelling packages in India, vacation packages, overseas tour packages, honeymoon packages, TrippyJiffy"
        canonical="https://trippyjiffy.com/"
        ogUrl="https://trippyjiffy.com/"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "TravelAgency",
            "name": "TrippyJiffy",
            "url": "https://trippyjiffy.com/",
            "logo": "https://trippyjiffy.com/logo.png",
            "image": "https://trippyjiffy.com/og-banner.jpg",
            "description": "Customized India and overseas tour packages for families, groups, honeymoon travelers, and holiday planners.",
            "telephone": "+91-9870210896",
            "email": "travelqueries@trippyjiffy.com",
            "priceRange": "$$",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Sector 1, Vikas Nagar",
              "addressLocality": "Lucknow",
              "addressRegion": "Uttar Pradesh",
              "postalCode": "226022",
              "addressCountry": "IN"
            },
            "sameAs": [
              "https://www.facebook.com/profile.php?id=61590639771522",
              "https://www.instagram.com/trippy.jiffy",
              "https://www.linkedin.com/company/trippyjiffy/",
              "https://www.youtube.com/@trippyjiffy"
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "TrippyJiffy",
            "url": "https://trippyjiffy.com/",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://trippyjiffy.com/family-tours?search={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }
        ]}
      />

      <AutoLeadPopup context="Homepage" triggerAfterScrollPercent={60} />

      <Banner />

      <Suspense fallback={<SectionFallback minHeight={620} />}>
        <Destinations />
      </Suspense>
      <Suspense fallback={<SectionFallback minHeight={520} />}>
        <Testimonials />
      </Suspense>
      <Suspense fallback={<SectionFallback minHeight={460} />}>
        <Blog />
      </Suspense>
      <Suspense fallback={<SectionFallback minHeight={420} />}>
        <Choose />
      </Suspense>
    </div>
  );
};

export default Homepage;
