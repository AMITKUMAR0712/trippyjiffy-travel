import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sharedContact = {
  phones: ["+91 98702 10896", "+91 85274 54549"],
  email: "travelqueries@trippyjiffy.com",
  address: "Sector 1, Vikas Nagar Lucknow 226022 (India)",
};

const sharedCertificates = [
  { src: "/api/uploads/Certificates1.jpeg", alt: "Ministry of Tourism Certificate" },
  { src: "/api/uploads/Certificates2.jpeg", alt: "Tourism Registration Certificate" },
];

// Image URLs mapping to exactly what the user has in their local Frontend/src/Img setup
const images = {
  heroGolden: "/api/uploads/Banner2.jpg",
  heroSouth: "/api/uploads/travel.jpg",
  heroRajasthan: "/api/uploads/Banner3.jpg",
  
  gallery1: "/api/uploads/Banner!.webp",
  gallery2: "/api/uploads/Banner32.webp",
  gallery3: "/api/uploads/contact.jpg",
  gallery4: "/api/uploads/l1.jpeg",
  gallery5: "/api/uploads/people-doi-pha-tang-against-sky-sunrise_1048944-4357386.jpeg",
  gallery6: "/api/uploads/hiker-looking-mountains-from-great-wall-china-sunset_1048944-9830948.jpeg",
};

const landingPagesData = {
  "golden-triangle": {
    slug: "golden-triangle",
    title: "Golden Triangle Tour",
    hero: {
      title: "Golden Triangle Tour",
      subtitle:
        "Delhi · Agra · Jaipur — a perfectly curated introduction to India's royal heritage, iconic monuments, and vibrant bazaars.",
      image: images.heroGolden,
      slides: [images.heroGolden, images.gallery2, images.gallery3],
      badge: "Limited Slots · Personalized Itineraries",
      ctaPrimary: "Get Free Quote",
      ctaSecondary: "Call Now",
      ctaPhone: "+919870210896",
    },
    theme: {
      primary: "#f97316",
      secondary: "#0ea5e9",
      accent: "#1e293b",
    },
    stats: [
      { value: "6-7 Days", label: "Ideal Duration" },
      { value: "3 Cities", label: "Delhi • Agra • Jaipur" },
      { value: "4.9★", label: "Guest Rating" },
    ],
    recommendTourId: 55,
    recommendedTours: [
      {
        title: "A Journey of Heritage and Harmony: Golden Triangle with Amritsar Tour",
        image: images.gallery3,
        link: "/landing-pages/golden-triangle",
      },
      {
        title: "Roars & Royals: Golden Triangle + Ranthambore Safari",
        image: images.gallery1,
        link: "/landing-pages/golden-triangle",
      },
      {
        title: "Wings & Wonders: Golden Triangle with Bharatpur Birding",
        image: images.gallery5,
        link: "/landing-pages/golden-triangle",
      },
      {
        title: "Inner Peace: Golden Triangle with Haridwar & Rishikesh",
        image: images.gallery4,
        link: "/landing-pages/golden-triangle",
      },
      {
        title: "Divine Bliss: Golden Triangle with Mathura & Vrindavan",
        image: images.gallery2,
        link: "/landing-pages/golden-triangle",
      },
      {
        title: "Heritage Meets Spirituality: Golden Triangle with Varanasi",
        image: images.gallery6,
        link: "/landing-pages/golden-triangle",
      },
    ],
    highlights: [
      {
        title: "Taj Mahal Sunrise",
        description: "Witness the world's most celebrated monument at dawn in Agra.",
      },
      {
        title: "Jaipur Heritage Walk",
        description: "Explore palaces, forts, and colorful markets in the Pink City.",
      },
      {
        title: "Old Delhi Culture",
        description: "Rickshaw rides, bustling bazaars, and street food trails.",
      },
      {
        title: "Comfort Transfers",
        description: "Private AC vehicle with professional driver throughout.",
      },
    ],
    about: {
      heading: "About the Golden Triangle",
      description:
        "The Golden Triangle connects Delhi, Agra, and Jaipur — India's most iconic circuit for first-time visitors. Expect Mughal marvels, royal palaces, vibrant bazaars, and unforgettable food experiences.",
      points: [
        "Guided city tours with cultural insights",
        "Flexible pacing for families and couples",
        "Handpicked stays near key attractions",
      ],
    },
    intro: {
      eyebrow: "Explore, Discover, and Relax",
      heading: "Unforgettable Golden Triangle Tours",
      description:
        "Embark on a classic journey through Delhi, Agra, and Jaipur. From the Taj Mahal at sunrise to royal palaces and vibrant bazaars, enjoy a perfectly balanced mix of heritage, culture, and comfort with expert guidance throughout.",
      cta: "Contact Now",
      image: images.gallery2,
    },
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival in Delhi",
        description:
          "Airport pickup, check-in, and a relaxed evening at India Gate and Connaught Place.",
      },
      {
        day: "Day 2",
        title: "Old & New Delhi",
        description:
          "Qutub Minar, Lotus Temple, Jama Masjid, Raj Ghat, and Chandni Chowk.",
      },
      {
        day: "Day 3",
        title: "Delhi → Agra",
        description:
          "Drive to Agra. Visit Agra Fort and enjoy sunset views of the Taj Mahal.",
      },
      {
        day: "Day 4",
        title: "Agra → Jaipur",
        description:
          "Sunrise Taj Mahal, then proceed to Jaipur with a stop at Fatehpur Sikri.",
      },
      {
        day: "Day 5",
        title: "Jaipur Sightseeing",
        description:
          "Amber Fort, City Palace, Hawa Mahal, Jantar Mantar, and local markets.",
      },
      {
        day: "Day 6",
        title: "Departure",
        description:
          "Transfer to airport/railway station with wonderful memories of the Golden Triangle.",
      },
    ],
    gallery: [
      { src: images.gallery1, alt: "Delhi heritage" },
      { src: images.gallery2, alt: "Agra Taj Mahal" },
      { src: images.gallery3, alt: "Jaipur palaces" },
      { src: images.gallery4, alt: "Local markets" },
      { src: images.gallery5, alt: "Cultural experiences" },
      { src: images.gallery6, alt: "Royal forts" },
    ],
    certificates: sharedCertificates,
    inclusions: [
      "Airport pick-up & drop",
      "Private AC vehicle with driver",
      "Handpicked stays with breakfast",
      "Guided sightseeing tours",
      "All tolls, parking, and taxes",
    ],
    exclusions: [
      "Airfare/train tickets",
      "Lunch & dinner unless mentioned",
      "Entry fees to monuments",
      "Personal expenses & tips",
      "Travel insurance",
    ],
    whyChooseUs: [
      {
        title: "Tailor-Made Itineraries",
        description: "Trips designed around your pace, preferences, and budget.",
      },
      {
        title: "Trusted Local Experts",
        description: "On-ground teams to ensure smooth experiences at every stop.",
      },
      {
        title: "Transparent Pricing",
        description: "Clear quotes with no hidden costs or last-minute surprises.",
      },
    ],
    whyIntro: {
      eyebrow: "Your India Travel Experts",
      heading: "Why Choose Us",
      description:
        "We are your trusted partner for Golden Triangle tours, handling every detail from airport pickup to stays and curated experiences.",
      images: [images.gallery5, images.gallery3, images.gallery6],
    },
    testimonials: [
      {
        name: "Ananya Sharma",
        rating: 5,
        text: "Impeccable planning and a very comfortable journey. Taj Mahal at sunrise was unforgettable!",
      },
      {
        name: "Rohan Mehta",
        rating: 5,
        text: "Great guides, smooth transfers, and beautiful hotels. Highly recommended.",
      },
    ],
    faqs: [
      {
        question: "What is the best time to visit the Golden Triangle?",
        answer:
          "October to March offers pleasant weather for sightseeing across Delhi, Agra, and Jaipur.",
      },
      {
        question: "Can this tour be customized?",
        answer:
          "Yes. We can adjust duration, hotels, and experiences as per your preferences.",
      },
      {
        question: "Is the Taj Mahal closed on any day?",
        answer: "Yes, the Taj Mahal is closed every Friday.",
      },
    ],
    contact: sharedContact,
    seo: {
      title: "Golden Triangle Tour | TrippyJiffy",
      description:
        "Explore Delhi, Agra, and Jaipur with a curated Golden Triangle tour. Custom itineraries, premium stays, and seamless transfers.",
    },
  },
  "south-india": {
    slug: "south-india",
    title: "South India Tour",
    hero: {
      title: "South India Tour",
      subtitle:
        "Kerala backwaters, Tamil Nadu temples, and coastal getaways — a serene blend of culture and nature.",
      image: images.heroSouth,
      slides: [images.heroSouth, images.gallery5, images.gallery4],
      badge: "Exclusive South India Experiences",
      ctaPrimary: "Get Free Quote",
      ctaSecondary: "Call Now",
      ctaPhone: "+919870210896",
    },
    theme: {
      primary: "#0ea5e9",
      secondary: "#10b981",
      accent: "#0f172a",
    },
    stats: [
      { value: "7-9 Days", label: "Ideal Duration" },
      { value: "3 States", label: "Kerala • Tamil Nadu • Karnataka" },
      { value: "4.8★", label: "Guest Rating" },
    ],
    recommendTourId: null,
    recommendedTours: [
      {
        title: "Backwaters & Temples: Kerala to Madurai",
        image: images.gallery5,
        link: "/landing-pages/south-india",
      },
      {
        title: "Hill Breezes: Munnar & Tea Gardens Escape",
        image: images.gallery4,
        link: "/landing-pages/south-india",
      },
      {
        title: "Coastal Bliss: Kovalam & Varkala Beaches",
        image: images.gallery2,
        link: "/landing-pages/south-india",
      },
      {
        title: "Sacred South: Rameswaram & Madurai Trail",
        image: images.gallery3,
        link: "/landing-pages/south-india",
      },
      {
        title: "Wild & Water: Periyar Wildlife with Alleppey",
        image: images.gallery1,
        link: "/landing-pages/south-india",
      },
    ],
    highlights: [
      {
        title: "Kerala Backwaters",
        description: "Houseboat stay and serene lagoon cruises in Alleppey.",
      },
      {
        title: "Temple Trails",
        description: "Meenakshi Temple, Brihadeeswarar Temple, and more.",
      },
      {
        title: "Hill Escapes",
        description: "Munnar tea estates and misty viewpoints.",
      },
      {
        title: "Coastal Sunsets",
        description: "Relax at Marari or Kovalam beaches with curated stays.",
      },
    ],
    about: {
      heading: "About South India",
      description:
        "South India is known for its tranquil backwaters, temple architecture, hill stations, and warm hospitality. This tour blends nature, culture, and wellness experiences.",
      points: [
        "Houseboat stay with curated meals",
        "Temple trails with local guides",
        "Tea estates and scenic hill drives",
      ],
    },
    intro: {
      eyebrow: "Explore, Discover, and Relax",
      heading: "Unforgettable South India Tours",
      description:
        "Cruise Kerala's backwaters, explore ancient temples, and unwind in misty hill stations. Our South India tours blend culture, nature, and comfort with handcrafted itineraries.",
      cta: "Contact Now",
      image: images.gallery5,
    },
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival in Kochi",
        description:
          "Pick-up and explore Fort Kochi, Chinese fishing nets, and local cafés.",
      },
      {
        day: "Day 2",
        title: "Kochi → Munnar",
        description:
          "Scenic drive to tea plantations, waterfalls, and spice gardens.",
      },
      {
        day: "Day 3",
        title: "Munnar Sightseeing",
        description:
          "Eravikulam National Park, tea museum, and panoramic viewpoints.",
      },
      {
        day: "Day 4",
        title: "Munnar → Alleppey",
        description:
          "Houseboat check-in and relaxing backwater cruise.",
      },
      {
        day: "Day 5",
        title: "Alleppey → Madurai",
        description:
          "Temple visit and cultural evening experience.",
      },
      {
        day: "Day 6",
        title: "Madurai → Rameswaram",
        description:
          "Island temple tour and coastal sightseeing.",
      },
      {
        day: "Day 7",
        title: "Departure",
        description: "Transfer to airport/railway station with lasting memories.",
      },
    ],
    gallery: [
      { src: images.gallery5, alt: "Kerala backwaters" },
      { src: images.gallery4, alt: "Tea plantations" },
      { src: images.gallery3, alt: "South India temples" },
      { src: images.gallery2, alt: "Coastal sunsets" },
      { src: images.gallery1, alt: "Cultural shows" },
      { src: images.gallery6, alt: "Hill stations" },
    ],
    certificates: sharedCertificates,
    inclusions: [
      "Airport pick-up & drop",
      "Private AC vehicle with driver",
      "Houseboat experience (Alleppey)",
      "Breakfast and selected meals",
      "All tolls, parking, and taxes",
    ],
    exclusions: [
      "Airfare/train tickets",
      "Entry fees to monuments",
      "Personal expenses & tips",
      "Lunch & dinner unless mentioned",
      "Travel insurance",
    ],
    whyChooseUs: [
      {
        title: "Handpicked Stays",
        description: "Premium hotels and unique stays tailored to your needs.",
      },
      {
        title: "Local Specialists",
        description: "Regional experts ensuring authentic experiences.",
      },
      {
        title: "Seamless Planning",
        description: "Everything organized end-to-end, stress-free.",
      },
    ],
    whyIntro: {
      eyebrow: "Your South India Travel Experts",
      heading: "Why Choose Us",
      description:
        "From backwater cruises to temple trails, our team crafts seamless South India journeys with expert guidance.",
      images: [images.gallery4, images.gallery5, images.gallery2],
    },
    testimonials: [
      {
        name: "Meera Nair",
        rating: 5,
        text: "Amazing backwater stay and smooth itinerary. The team handled everything perfectly!",
      },
      {
        name: "Siddharth Rao",
        rating: 5,
        text: "The temple trail was insightful and the hill stations were refreshing. Excellent service!",
      },
    ],
    faqs: [
      {
        question: "Is the houseboat stay private?",
        answer: "Yes, we arrange private houseboats for couples and families.",
      },
      {
        question: "Can we add beaches to the itinerary?",
        answer: "Absolutely. We can include Kovalam or Marari as per your preference.",
      },
      {
        question: "What is the best time for South India tours?",
        answer:
          "September to March is ideal for pleasant weather and smooth travel.",
      },
    ],
    contact: sharedContact,
    seo: {
      title: "South India Tour | TrippyJiffy",
      description:
        "Discover Kerala backwaters, temple trails, and coastal escapes with a curated South India tour.",
    },
  },
  rajasthan: {
    slug: "rajasthan",
    title: "Rajasthan Tour",
    hero: {
      title: "Rajasthan Tour",
      subtitle:
        "Royal palaces, desert safaris, and lakeside retreats — experience the grandeur of Rajasthan.",
      image: images.heroRajasthan,
      slides: [images.heroRajasthan, images.gallery6, images.gallery1],
      badge: "Royal Rajasthan Experiences",
      ctaPrimary: "Get Free Quote",
      ctaSecondary: "Call Now",
      ctaPhone: "+919870210896",
    },
    theme: {
      primary: "#f59e0b",
      secondary: "#ef4444",
      accent: "#111827",
    },
    stats: [
      { value: "7-10 Days", label: "Ideal Duration" },
      { value: "5 Cities", label: "Jaipur • Jodhpur • Udaipur • Jaisalmer" },
      { value: "4.9★", label: "Guest Rating" },
    ],
    recommendTourId: null,
    recommendedTours: [
      {
        title: "Royal Circuit: Jaipur, Jodhpur, Udaipur",
        image: images.gallery2,
        link: "/landing-pages/rajasthan",
      },
      {
        title: "Desert Dreams: Jaisalmer Safari Escape",
        image: images.gallery1,
        link: "/landing-pages/rajasthan",
      },
      {
        title: "Lakeside Romance: Udaipur Heritage Stay",
        image: images.gallery4,
        link: "/landing-pages/rajasthan",
      },
      {
        title: "Fortress Trail: Mehrangarh to Amber",
        image: images.gallery6,
        link: "/landing-pages/rajasthan",
      },
      {
        title: "Safari & Sands: Ranthambore to Sam Dunes",
        image: images.gallery5,
        link: "/landing-pages/rajasthan",
      },
    ],
    highlights: [
      {
        title: "Desert Safari",
        description: "Camel rides and starlit camps in Jaisalmer.",
      },
      {
        title: "Lake City Escape",
        description: "Boat rides and palaces in Udaipur.",
      },
      {
        title: "Mehrangarh Fort",
        description: "Explore one of India's most iconic forts in Jodhpur.",
      },
      {
        title: "Heritage Havelis",
        description: "Stay in royal heritage hotels and havelis.",
      },
    ],
    about: {
      heading: "About Rajasthan",
      description:
        "Rajasthan is India's royal heartland with majestic forts, desert landscapes, colorful bazaars, and heritage stays. Ideal for luxury, culture, and photography lovers.",
      points: [
        "Royal palaces and fort tours",
        "Desert safari with cultural show",
        "Lakeside sunsets in Udaipur",
      ],
    },
    intro: {
      eyebrow: "Explore, Discover, and Relax",
      heading: "Unforgettable Rajasthan Tours",
      description:
        "Experience royal palaces, golden deserts, and vibrant bazaars with curated Rajasthan itineraries. Enjoy heritage stays, expert guides, and seamless travel.",
      cta: "Contact Now",
      image: images.gallery1,
    },
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival in Jaipur",
        description:
          "Check-in, local market visit, and evening at Chokhi Dhani.",
      },
      {
        day: "Day 2",
        title: "Jaipur Sightseeing",
        description:
          "Amber Fort, City Palace, Hawa Mahal, and Jantar Mantar.",
      },
      {
        day: "Day 3",
        title: "Jaipur → Jodhpur",
        description: "Drive to Jodhpur and explore local bazaars.",
      },
      {
        day: "Day 4",
        title: "Jodhpur → Jaisalmer",
        description:
          "Visit Mehrangarh Fort, then proceed to the Golden City.",
      },
      {
        day: "Day 5",
        title: "Jaisalmer Desert Camp",
        description:
          "Sam Sand Dunes, camel safari, cultural show, and overnight camp.",
      },
      {
        day: "Day 6",
        title: "Jaisalmer → Udaipur",
        description: "Scenic drive to Udaipur, the City of Lakes.",
      },
      {
        day: "Day 7",
        title: "Udaipur Sightseeing",
        description:
          "City Palace, Jagdish Temple, Saheliyon Ki Bari, and Lake Pichola.",
      },
      {
        day: "Day 8",
        title: "Departure",
        description: "Transfer to airport/railway station with royal memories.",
      },
    ],
    gallery: [
      { src: images.gallery2, alt: "Rajasthan forts" },
      { src: images.gallery1, alt: "Desert safari" },
      { src: images.gallery6, alt: "Heritage palace" },
      { src: images.gallery5, alt: "Royal architecture" },
      { src: images.gallery4, alt: "Lakeside Udaipur" },
      { src: images.gallery3, alt: "Cultural performances" },
    ],
    certificates: sharedCertificates,
    inclusions: [
      "Airport pick-up & drop",
      "Private AC vehicle with driver",
      "Heritage stays with breakfast",
      "Guided sightseeing tours",
      "All tolls, parking, and taxes",
    ],
    exclusions: [
      "Airfare/train tickets",
      "Entry fees to monuments",
      "Lunch & dinner unless mentioned",
      "Personal expenses & tips",
      "Travel insurance",
    ],
    whyChooseUs: [
      {
        title: "Royal Experiences",
        description: "Curated stays and activities that showcase Rajasthan's grandeur.",
      },
      {
        title: "Expert Guides",
        description: "Knowledgeable guides for forts, palaces, and heritage sites.",
      },
      {
        title: "Flexible Plans",
        description: "Easy customizations to match your preferred pace.",
      },
    ],
    whyIntro: {
      eyebrow: "Your Rajasthan Travel Experts",
      heading: "Why Choose Us",
      description:
        "We handle every detail of your Rajasthan escape with premium stays, expert guides, and smooth travel logistics.",
      images: [images.gallery1, images.gallery6, images.gallery2],
    },
    testimonials: [
      {
        name: "Nikita Singh",
        rating: 5,
        text: "The desert camp was magical and the palaces were stunning. Everything was well organized!",
      },
      {
        name: "Arjun Verma",
        rating: 5,
        text: "Seamless travel and beautiful heritage hotels. Great experience overall!",
      },
    ],
    faqs: [
      {
        question: "Is the desert camp safe for families?",
        answer:
          "Yes, our camps are well-managed, comfortable, and ideal for families.",
      },
      {
        question: "Can we reduce the number of cities?",
        answer:
          "Yes. We can tailor the itinerary to focus on your preferred destinations.",
      },
      {
        question: "When is the best time to visit Rajasthan?",
        answer:
          "October to March is best for pleasant weather and sightseeing.",
      },
    ],
    contact: sharedContact,
    seo: {
      title: "Rajasthan Tour | TrippyJiffy",
      description:
        "Explore Rajasthan's palaces, deserts, and lakes with a curated tour package and personalized itinerary.",
    },
  },
};

async function seed() {
  try {
    console.log("🌱 Seeding landing pages data...");

    for (const [key, pageData] of Object.entries(landingPagesData)) {
      const result = await prisma.landing_page.upsert({
        where: { slug: pageData.slug },
        update: {
          title: pageData.title,
          data: pageData,
          updatedAt: new Date(),
        },
        create: {
          slug: pageData.slug,
          title: pageData.title,
          data: pageData,
        },
      });
      console.log(`✅ Seeded: ${result.slug}`);
    }

    console.log("✅ All landing pages seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
