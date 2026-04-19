
import pool from "../config/db.js";

const seedUpcomingWithGallery = async () => {
    const trips = [
        {
            title: "Bali Tropical Bliss",
            tags: "Luxury, Tropical, Wellness",
            link: "",
            description: "Experience the ultimate tropical getaway in Bali. From the lush jungles of Ubud to the pristine beaches of Uluwatu, this trip is designed for rejuvenation and adventure.",
            details: JSON.stringify([
                "Day 1: Arrival & Welcome Dinner in Seminyak",
                "Day 2: Ubud Monkey Forest & Rice Terrace Swing",
                "Day 3: Sunrise Trek to Mount Batur",
                "Day 4: Tegenungan Waterfall & Holy Water Temple",
                "Day 5: Nusa Penida Island Day Trip",
                "Day 6: Beach Club Relaxation in Uluwatu",
                "Day 7: Farewell Brunch & Departure"
            ]),
            banner_image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
            images: JSON.stringify([
                "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1537953391147-f45cb5631438?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80"
            ]),
            is_visible: 1
        },
        {
            title: "Spiti Valley Expedition",
            tags: "Adventure, Mountains, Culture",
            link: "",
            description: "Journey to the 'Middle Land'. A high-altitude desert with ancient monasteries and breathtaking landscapes.",
            details: JSON.stringify([
                "Day 1: Manali Arrival",
                "Day 2: Kaza via Kunzum Pass",
                "Day 3: Key Monastery",
                "Day 4: Langza & Hikkim",
                "Day 5: Dhankar Monastery",
                "Day 6: Chandratal Lake",
                "Day 7: Return to Manali"
            ]),
            banner_image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80",
            images: JSON.stringify([
                "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=600&q=80"
            ]),
            is_visible: 1
        }
    ];

    try {
        await pool.query("DELETE FROM upcoming_trips");
        for (const trip of trips) {
            await pool.query(
                "INSERT INTO upcoming_trips (title, tags, link, description, details, banner_image, images, is_visible) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [trip.title, trip.tags, trip.link, trip.description, trip.details, trip.banner_image, trip.images, trip.is_visible]
            );
        }
        console.log("✅ Seeded trips with multiple small gallery images!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedUpcomingWithGallery();
