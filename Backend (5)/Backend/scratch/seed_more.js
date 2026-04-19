
import pool from "../config/db.js";

const seedMorePremiumTrips = async () => {
    const trips = [
        {
            title: "Kyoto Sakura Blossom",
            tags: "Cultural, Photography, Spring",
            link: "",
            description: "Witness the magical cherry blossom season in Japan's cultural heart. From ancient temples to traditional tea ceremonies, experience the true essence of Kyoto.",
            details: JSON.stringify([
                "Day 1: Arrival & Night Walk in Gion",
                "Day 2: Kiyomizu-dera Temple & Philosopher's Path",
                "Day 3: Arashiyama Bamboo Grove & Tenryu-ji",
                "Day 4: Fushimi Inari Shrine & Sake Tasting",
                "Day 5: Day Trip to Nara Deer Park",
                "Day 6: Traditional Kimono Experience & Tea Ceremony",
                "Day 7: Farewell Dinner & Departure"
            ]),
            banner_image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
            images: JSON.stringify([
                "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1528164344705-4754268799af?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1524413840049-59cb4a59bb5f?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1493780474015-ba834ff0ce2f?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1578469645742-46cae010e5d3?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80"
            ]),
            is_visible: 1
        },
        {
            title: "Santorini Blue Dome Escape",
            tags: "Luxury, Romantic, Sunset",
            link: "",
            description: "Sun-drenched islands, whitewashed villages, and the world's most famous sunsets. Santorini is a dream carved in white and blue.",
            details: JSON.stringify([
                "Day 1: Arrival in Oia & Sunset Cocktails",
                "Day 2: Hiking from Fira to Oia",
                "Day 3: Private Catamaran Cruise Around the Caldera",
                "Day 4: Wine Tasting in Megalochori",
                "Day 5: Red Beach & Akrotiri Excavations",
                "Day 6: Beach Day in Perissa (Black Sand Beach)",
                "Day 7: Departure"
            ]),
            banner_image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
            images: JSON.stringify([
                "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1516483642775-8129df48a607?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1558230551-d306b864a66a?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1542662565-7e4b66bae529?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80"
            ]),
            is_visible: 1
        },
        {
            title: "Ladakh Ultimate Road Trip",
            tags: "Adventure, Bikes, Mountains",
            link: "",
            description: "The land of high passes awaits. Ride across the world's highest motorable roads and camp under a billion stars by Pangong Lake.",
            details: JSON.stringify([
                "Day 1: Arrival in Leh & Acclimatization",
                "Day 2: Leh Local - Shanti Stupa & Magnetic Hill",
                "Day 3: Nubra Valley via Khardung La",
                "Day 4: Hunder Sand Dunes & Bactrian Camels",
                "Day 5: Pangong Tso via Shyok River",
                "Day 6: Return to Leh & Farewell Dinner",
                "Day 7: Departure"
            ]),
            banner_image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80",
            images: JSON.stringify([
                "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1504975813724-1183b0c8e665?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1519451241324-20b8ec228960?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1516690553959-71a414d6b9b6?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1545562083-a600704fa487?auto=format&fit=crop&w=600&q=80"
            ]),
            is_visible: 1
        },
        {
            title: "Cappadocia Balloon Magic",
            tags: "Fairytale, Sky, Adventure",
            link: "",
            description: "Wake up to a sky full of hot air balloons drifting over unique rock formations. Explore underground cities and caves in the heart of Turkey.",
            details: JSON.stringify([
                "Day 1: Arrival & Boutique Cave Hotel Stay",
                "Day 2: Sunrise Hot Air Balloon Flight",
                "Day 3: Goreme Open Air Museum & Rose Valley",
                "Day 4: Underground City & Horse Riding",
                "Day 5: Pashabagi Fairy Chimneys",
                "Day 6: Turkish Night Show & local Delicacies",
                "Day 7: Departure"
            ]),
            banner_image: "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=1200&q=80",
            images: JSON.stringify([
                "https://images.unsplash.com/photo-1516738901171-ec687d7805c5?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1544911845-1f34a3eb46b1?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1545562083-a600704fa487?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1527838832702-588f2379a763?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=600&q=80"
            ]),
            is_visible: 1
        }
    ];

    try {
        for (const trip of trips) {
            await pool.query(
                "INSERT INTO upcoming_trips (title, tags, link, description, details, banner_image, images, is_visible) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [trip.title, trip.tags, trip.link, trip.description, trip.details, trip.banner_image, trip.images, trip.is_visible]
            );
        }
        console.log("✅ Seeded 4 MORE best upcoming trips!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedMorePremiumTrips();
