import React from "react";
import Banner from "./HomeCompontent/Banner";
import Destinations from "./HomeCompontent/Destinations";
import Blog from "./HomeCompontent/Blog";
import Testimonials from "./Page/Testimonials";
import Choose from "./HomeCompontent/Choose";
import SEO from "./HomeCompontent/SEO";

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

      <Banner />
      <Destinations />
      <Testimonials />
      <Blog />
      <Choose />
    </div>
  );
};

export default Homepage;
