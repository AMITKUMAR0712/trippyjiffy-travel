import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  ogImage, 
  ogUrl, 
  canonical,
  structuredData,
  isDestination = false
}) => {
  const siteName = "TrippyJiffy";
  
  // Smart Title Formula: [Destination] Tour Package | TrippyJiffy
  const formattedTitle = isDestination && title 
    ? `${title} Tour | Best Deals` 
    : title;

  const fullTitle = formattedTitle ? `${formattedTitle} | ${siteName}` : `Best Tour Packages | ${siteName}`;
  
  const defaultDesc = "TrippyJiffy offers curated tour packages, customized itineraries, and unique travel experiences across India and Asia. Explore the 4th dimension of travel.";
  const defaultKeywords = "tour packages, holiday packages, travel packages, India tours, Asia travel, vacation planning, TrippyJiffy";
  const defaultOgImage = "https://trippyjiffy.com/og-banner.jpg"; 

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      <link rel="canonical" href={canonical || (typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '')} />


      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:image" content={ogImage || defaultOgImage} />
      <meta property="og:url" content={ogUrl || window.location.href} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
      <meta name="twitter:image" content={ogImage || defaultOgImage} />

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
