import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const addToWishlist = async (req, res) => {
  try {
    const { item_id, item_type, title, image, url } = req.body;
    const user_id = req.user.id;

    if (!item_id || !item_type || !title) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const exists = await prisma.user_wishlist.findFirst({
      where: { user_id, item_id: String(item_id), item_type },
    });

    if (exists) {
      return res.status(400).json({ success: false, message: "Item already in wishlist" });
    }

    const wishlistItem = await prisma.user_wishlist.create({
      data: {
        user_id,
        item_id: String(item_id),
        item_type,
        title,
        image,
        url,
      },
    });

    res.status(201).json({ success: true, message: "Added to wishlist", wishlistItem });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const user_id = req.user.id;
    const wishlist = await prisma.user_wishlist.findMany({
      where: { user_id },
      orderBy: { created_at: 'desc' },
    });
    res.status(200).json({ success: true, wishlist });
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    await prisma.user_wishlist.deleteMany({
      where: { id: parseInt(id), user_id },
    });

    res.status(200).json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const addToCompare = async (req, res) => {
  try {
    const { item_id, item_type, title, image, url } = req.body;
    const user_id = req.user.id;

    if (!item_id || !item_type || !title) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const exists = await prisma.user_compare.findFirst({
      where: { user_id, item_id: String(item_id), item_type },
    });

    if (exists) {
      return res.status(400).json({ success: false, message: "Item already in compare list" });
    }

    const count = await prisma.user_compare.count({ where: { user_id } });
    if (count >= 3) {
       return res.status(400).json({ success: false, message: "You can only compare up to 3 items" });
    }

    const compareItem = await prisma.user_compare.create({
      data: {
        user_id,
        item_id: String(item_id),
        item_type,
        title,
        image,
        url,
      },
    });

    res.status(201).json({ success: true, message: "Added to compare list", compareItem });
  } catch (error) {
    console.error("Add to compare error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getCompare = async (req, res) => {
  try {
    const user_id = req.user.id;
    const compareList = await prisma.user_compare.findMany({
      where: { user_id },
      orderBy: { created_at: 'desc' },
    });
    res.status(200).json({ success: true, compareList });
  } catch (error) {
    console.error("Get compare list error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const removeFromCompare = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    await prisma.user_compare.deleteMany({
      where: { id: parseInt(id), user_id },
    });

    res.status(200).json({ success: true, message: "Removed from compare list" });
  } catch (error) {
    console.error("Remove from compare error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const user_id = req.user.id;

    // 1. Wishlist Count
    const wishlistCount = await prisma.user_wishlist.count({
      where: { user_id }
    });

    // 2. Booked Trips Count (from enquiries associated with this user)
    const bookedTripsCount = await prisma.enquiries.count({
      where: { user_id }
    });

    // 3. Recent Activities
    const recentActivities = await prisma.enquiries.findMany({
      where: { user_id },
      orderBy: { created_at: 'desc' },
      take: 5
    });

    // 4. Destinations (Fixed or can be based on something else)
    const destinations = "Global";

    // 5. Active Plan
    const activePlan = "Free";

    res.status(200).json({
      success: true,
      stats: {
        wishlist: wishlistCount,
        bookedTrips: bookedTripsCount,
        destinations,
        activePlan
      },
      recentActivities
    });

  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

