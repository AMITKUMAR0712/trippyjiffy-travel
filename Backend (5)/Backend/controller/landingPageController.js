import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all landing pages (for admin)
export const getAllLandingPages = async (req, res) => {
  try {
    const pages = await prisma.landing_page.findMany();
    res.status(200).json({
      success: true,
      data: pages,
      message: "Landing pages fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching landing pages:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch landing pages",
      error: error.message,
    });
  }
};

// Get single landing page by slug
export const getLandingPageBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const normalizedSlug = slug.toLowerCase();

    const page = await prisma.landing_page.findUnique({
      where: { slug: normalizedSlug },
    });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: `Landing page with slug '${slug}' not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: page,
      message: "Landing page fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching landing page:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch landing page",
      error: error.message,
    });
  }
};

// Create or update landing page
export const upsertLandingPage = async (req, res) => {
  try {
    const { slug, title, data } = req.body;

    if (!slug || !title || !data) {
      return res.status(400).json({
        success: false,
        message: "slug, title, and data are required",
      });
    }

    const page = await prisma.landing_page.upsert({
      where: { slug },
      update: {
        title,
        data,
        updatedAt: new Date(),
      },
      create: {
        slug,
        title,
        data,
      },
    });

    res.status(200).json({
      success: true,
      data: page,
      message: `Landing page '${slug}' saved successfully`,
    });
  } catch (error) {
    console.error("Error saving landing page:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save landing page",
      error: error.message,
    });
  }
};

// Delete landing page
export const deleteLandingPage = async (req, res) => {
  try {
    const { slug } = req.params;

    const page = await prisma.landing_page.delete({
      where: { slug },
    });

    res.status(200).json({
      success: true,
      message: `Landing page '${slug}' deleted successfully`,
      data: page,
    });
  } catch (error) {
    console.error("Error deleting landing page:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete landing page",
      error: error.message,
    });
  }
};
